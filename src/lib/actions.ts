
'use server';

import { extractDataFromPdf } from '@/ai/flows/extract-data-from-pdf';
import { transformExtractedData } from '@/ai/flows/transform-extracted-data';
import { z } from 'zod';
import { supabase, supabaseAdmin } from './supabase';
import { cookies, headers } from 'next/headers';
import { createClient, type User } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { primaryModel, fallbackModel, tertiaryModel } from '@/ai/genkit';
import type { Model } from 'genkit/model';

async function getIpAddress(): Promise<string | null> {
  try {
    const headersList = headers();
    return headersList.get('x-forwarded-for') ?? '127.0.0.1';
  } catch (error) {
    console.log('Could not get headers for IP tracking, likely a static build.');
    return null;
  }
}

async function getServerUser(): Promise<User | null> {
  const cookieStore = cookies();
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  );
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}

const convertPdfSchema = z.object({
  pdfDataUri: z.string().startsWith('data:application/pdf;base64,'),
  isAnonymous: z.boolean(),
});

async function handleSuccessfulConversion(
  isAnonymous: boolean,
  user: User | null
) {
  if (isAnonymous) {
    if (supabaseAdmin) {
      const ipAddress = await getIpAddress();
      if (!ipAddress) return;

      const ipHash = createHash('sha256').update(ipAddress).digest('hex');
      const { error: insertError } = await supabaseAdmin
        .from('sc_anonymous_usage')
        .insert({ ip_hash: ipHash, last_conversion_at: new Date().toISOString() });

      if (insertError) {
        console.error('Failed to log anonymous usage:', insertError);
      }
    }
  } else if (user && supabaseAdmin) {
    const { data: userProfile } = await supabaseAdmin
      .from('sc_users')
      .select('plan')
      .eq('id', user.id)
      .single();
    if (userProfile && userProfile.plan === 'Free') {
      const { error: decrementError } = await supabaseAdmin.rpc(
        'decrement_credits',
        { p_user_id: user.id }
      );
      if (decrementError)
        console.error('Failed to decrement credits:', decrementError);
    }
  }
}

export async function convertPdf(input: z.infer<typeof convertPdfSchema>) {
  const validatedInput = convertPdfSchema.safeParse(input);

  if (!validatedInput.success) {
    return { error: 'Invalid input: A valid PDF data URI is required.' };
  }

  const user = await getServerUser();
  const isEffectivelyAnonymous = validatedInput.data.isAnonymous || !user;

  const creditInfo = await getUserCreditInfo(user);
  if (creditInfo.startsWith('0 pages')) {
      return {
          error: `You have reached the conversion limit. Please try again later or upgrade your plan.`,
      };
  }

  const modelsToTry: { name: string; model: Model }[] = [
    { name: 'primary (gemini-1.5-flash-latest)', model: primaryModel },
    { name: 'fallback (gemini-1.5-pro-latest)', model: fallbackModel },
    { name: 'tertiary (gemini-1.0-pro)', model: tertiaryModel },
  ];

  for (const { name, model } of modelsToTry) {
    try {
      console.log(`Attempt: Using ${name} model...`);
      const extractionResult = await extractDataFromPdf(
        { pdfDataUri: validatedInput.data.pdfDataUri },
        { model }
      );
      const transformationResult = await transformExtractedData(
        { extractedData: extractionResult.extractedData },
        { model }
      );
      if (!transformationResult.standardizedData) {
        throw new Error(`Model (${name}) failed to transform data.`);
      }

      await handleSuccessfulConversion(isEffectivelyAnonymous, user);
      const totalTokens = (extractionResult.tokenUsage?.totalTokens || 0) + (transformationResult.tokenUsage?.totalTokens || 0);
      return {
        standardizedData: transformationResult.standardizedData,
        totalTokens,
      };
    } catch (error) {
      console.log(
        `Attempt with ${name} failed:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  console.error('All conversion methods failed.');
  return {
    error: 'The service is currently overloaded or the document is unreadable. All backup methods failed. Please try again later.',
  };
}


const sendContactMessageSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Please enter a valid email.'),
  message: z.string().min(1, 'Message is required.'),
});

const sendInviteSchema = z.object({
  invites: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
    })
  ),
  referralLink: z.string().url('Invalid referral link'),
});

export async function sendContactMessage(
  input: z.infer<typeof sendContactMessageSchema>
) {
  const validatedInput = sendContactMessageSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error('Invalid input.');
  }

  if (!supabaseAdmin) {
    throw new Error('Application is not configured for messaging.');
  }

  const { error } = await supabaseAdmin.from('sc_messages').insert([
    {
      full_name: validatedInput.data.fullName,
      email: validatedInput.data.email,
      message: validatedInput.data.message,
    },
  ]);

  if (error) {
    console.error('Error inserting contact message:', error);
    throw new Error('Could not save your message. Please try again later.');
  }

  return { success: true };
}

export async function sendInvites(input: z.infer<typeof sendInviteSchema>) {
  const validatedInput = sendInviteSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(
      'Invalid input: ' +
      JSON.stringify(validatedInput.error.flatten().fieldErrors)
    );
  }

  console.log('Sending invites:', {
    invites: validatedInput.data.invites,
    referralLink: validatedInput.data.referralLink,
  });

  for (const invite of validatedInput.data.invites) {
    console.log(
      `Simulating sending email to ${invite.name} at ${invite.email}`
    );
    console.log(
      `Message: Hey ${invite.name}, check out this cool service! ${validatedInput.data.referralLink}`
    );
  }

  return { success: true, message: 'Invitations have been sent successfully.' };
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  referralCode: z.string().nullable(),
});

export async function signupWithReferral(input: z.infer<typeof signupSchema>) {
  if (!supabase || !supabaseAdmin) {
    return { error: 'Supabase client is not configured.' };
  }

  const validatedInput = signupSchema.safeParse(input);
  if (!validatedInput.success) {
    return {
      error:
        'Invalid input: ' +
        JSON.stringify(validatedInput.error.flatten().fieldErrors),
    };
  }

  const { email, password, firstName, lastName, referralCode } =
    validatedInput.data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`.trim(),
        referral_code: referralCode,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (authData.user && referralCode) {
    try {
      const { error: rpcError } = await supabaseAdmin.rpc(
        'award_referral_credit',
        { p_referrer_code: referralCode }
      );
      if (rpcError) {
        console.error('Failed to award referral credit:', rpcError);
      }
    } catch (e) {
      console.error('Exception awarding referral credit:', e);
    }
  }

  return { user: authData.user, error: null };
}

async function getRemainingTime(lastConversion: string | Date): Promise<string> {
    const lastConversionDate = new Date(lastConversion);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeSinceLastConversion = Date.now() - lastConversionDate.getTime();
  
    if (timeSinceLastConversion < twentyFourHours) {
      const remainingTime = twentyFourHours - timeSinceLastConversion;
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      return `0 pages remaining (${hours}h ${minutes}m left)`;
    }
    return '';
}

export async function getUserCreditInfo(
  userFromClient?: User | null
): Promise<string> {
  const user = userFromClient ?? (await getServerUser());

  if (!user) {
    if (supabaseAdmin) {
      const ipAddress = await getIpAddress();
      if (!ipAddress) {
        return '1 page remaining';
      }
      const ipHash = createHash('sha256').update(ipAddress).digest('hex');
      
      const { data, error } = await supabaseAdmin
        .from('sc_anonymous_usage')
        .select('last_conversion_at')
        .eq('ip_hash', ipHash)
        .order('last_conversion_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking anonymous usage:', error.message || JSON.stringify(error));
        return '1 page remaining'; // Default on error
      }

      if (data) {
        const remainingTimeMessage = await getRemainingTime(data.last_conversion_at);
        if (remainingTimeMessage) return remainingTimeMessage;
      }
      return '1 page remaining';
    }
    return '1 page remaining';
  }

  if (!supabaseAdmin) {
    return 'Error: Admin client not available';
  }

  const { data: userProfile, error } = await supabaseAdmin
    .from('sc_users')
    .select('credits, plan, last_free_conversion_at')
    .eq('id', user.id)
    .single();

  if (error || !userProfile) {
    console.error('Error fetching user profile for header:', error?.message || JSON.stringify(error));
    return '5 pages remaining';
  }

  switch (userProfile.plan) {
    case 'Starter':
      return '400 pages/month';
    case 'Professional':
      return '1000 pages/month';
    case 'Business':
      return '4000 pages/month';
    case 'Enterprise':
      return 'Custom plan';
    case 'Free':
    default:
        if (userProfile.credits > 0) {
            return `${userProfile.credits} pages remaining`;
        }
        if (userProfile.last_free_conversion_at) {
            const remainingTimeMessage = await getRemainingTime(userProfile.last_free_conversion_at);
            if (remainingTimeMessage) return remainingTimeMessage;
        }
      return `5 pages remaining`; // If time has passed, they get full credits back
  }
}
