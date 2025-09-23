
"use server";

import { extractDataFromPdf } from "@/ai/flows/extract-data-from-pdf";
import { transformExtractedData } from "@/ai/flows/transform-extracted-data";
import { z } from "zod";
import { supabase, supabaseAdmin } from "./supabase";
import { cookies, headers } from "next/headers";
import { createClient, type User } from "@supabase/supabase-js";
import { createHash } from 'crypto';
import { primaryModel, fallbackModel } from "@/ai/genkit";

async function getServerUser(): Promise<User | null> {
    const cookieStore = cookies();
    const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false
            },
            cookies: { 
                getAll: () => cookieStore.getAll() 
            } 
        }
    );
    const { data: { user } } = await client.auth.getUser();
    return user;
}

const convertPdfSchema = z.object({
  pdfDataUri: z.string().startsWith("data:application/pdf;base64,"),
  isAnonymous: z.boolean(),
});

export async function convertPdf(input: z.infer<typeof convertPdfSchema>) {
  const validatedInput = convertPdfSchema.safeParse(input);

  if (!validatedInput.success) {
    return { error: "Invalid input: A valid PDF data URI is required." };
  }

  const user = await getServerUser();
  const isEffectivelyAnonymous = validatedInput.data.isAnonymous || !user;

  if (isEffectivelyAnonymous) {
      if (!supabaseAdmin) {
        return { error: "Application is not configured for usage tracking." };
      }

      const headersList = headers();
      const ipAddress = headersList.get("x-forwarded-for") ?? '127.0.0.1';
      const ipHash = createHash('sha256').update(ipAddress).digest('hex');
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { count, error: usageError } = await supabaseAdmin
        .from('sc_anonymous_usage')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gt('created_at', twentyFourHoursAgo);
      
      if (usageError) {
        console.error("Error checking anonymous usage:", usageError);
      } else if (count !== null && count > 0) {
        return { error: "You have reached the free conversion limit for today. Please create an account to convert more documents."};
      }
  } else if (user) {
    if (!supabaseAdmin) {
      return { error: "Application is not configured for user management." };
    }
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('sc_users')
      .select('credits, plan')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return { error: "Could not retrieve user profile." };
    }

    if (userProfile.plan === 'Free' && userProfile.credits <= 0) {
      return { error: "You have no more credits. Please upgrade your plan to convert more documents." };
    }
  } else {
      return { error: "You must be logged in to perform this action." };
  }

  const handleSuccessfulConversion = async () => {
    if (isEffectivelyAnonymous) {
      if(supabaseAdmin) {
        const headersList = headers();
        const ipAddress = headersList.get("x-forwarded-for") ?? '127.0.0.1';
        const ipHash = createHash('sha256').update(ipAddress).digest('hex');
        
        const { error: insertError } = await supabaseAdmin
          .from('sc_anonymous_usage')
          .insert({ ip_hash: ipHash });

        if (insertError) {
            console.error('Failed to log anonymous usage:', insertError);
        }
      }
    } else if (user && supabaseAdmin) {
      const { data: userProfile } = await supabaseAdmin.from('sc_users').select('plan').eq('id', user.id).single();
      if (userProfile && userProfile.plan === 'Free') {
        const { error: decrementError } = await supabaseAdmin.rpc('decrement_credits', { p_user_id: user.id });
        if (decrementError) console.error("Failed to decrement credits:", decrementError);
      }
    }
  };

  try {
    // Attempt 1: Primary Model
    let totalTokens = 0;
    const extractionResult = await extractDataFromPdf({ pdfDataUri: validatedInput.data.pdfDataUri }, { model: primaryModel });
    if (!extractionResult || !extractionResult.extractedData) {
      throw new Error("AI failed to extract any data from the PDF with the primary model.");
    }
    totalTokens += extractionResult.tokenUsage?.totalTokens || 0;

    const transformationResult = await transformExtractedData({ extractedData: extractionResult.extractedData }, { model: primaryModel });
    if (!transformationResult || !transformationResult.standardizedData) {
      throw new Error("AI failed to format the extracted data with the primary model.");
    }
    totalTokens += transformationResult.tokenUsage?.totalTokens || 0;

    await handleSuccessfulConversion();
    return {
        standardizedData: transformationResult.standardizedData,
        totalTokens: totalTokens,
    };
  } catch (primaryError) {
    console.warn("Primary model failed. Attempting fallback.", primaryError);

    try {
        // Attempt 2: Fallback Model
        let totalTokens = 0;
        const fallbackExtractionResult = await extractDataFromPdf({ pdfDataUri: validatedInput.data.pdfDataUri }, { model: fallbackModel });
        if (!fallbackExtractionResult || !fallbackExtractionResult.extractedData) {
            throw new Error("AI failed to extract any data from the PDF with the fallback model.");
        }
        totalTokens += fallbackExtractionResult.tokenUsage?.totalTokens || 0;

        const fallbackTransformationResult = await transformExtractedData({ extractedData: fallbackExtractionResult.extractedData }, { model: fallbackModel });
        if (!fallbackTransformationResult || !fallbackTransformationResult.standardizedData) {
            throw new Error("AI failed to format the extracted data with the fallback model.");
        }
        totalTokens += fallbackTransformationResult.tokenUsage?.totalTokens || 0;
        
        await handleSuccessfulConversion();
        return {
            standardizedData: fallbackTransformationResult.standardizedData,
            totalTokens: totalTokens,
        };
    } catch (fallbackError) {
       console.error("Fallback conversion process also failed:", fallbackError);
       const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : "An unknown error occurred.";
       const primaryErrorMessage = primaryError instanceof Error ? primaryError.message : "An unknown error occurred.";
       
       if (primaryErrorMessage.includes("429") || fallbackErrorMessage.includes("429")) {
           return { error: `The service is currently overloaded, and the backup conversion method also failed. Please try again later. Details: ${primaryErrorMessage}` };
       }

       return { error: `The conversion failed on both primary and backup systems. Please check the file and try again. Details: ${fallbackErrorMessage}`};
    }
  }
}

const sendContactMessageSchema = z.object({
    fullName: z.string().min(1, 'Full name is required.'),
    email: z.string().email('Please enter a valid email.'),
    message: z.string().min(1, 'Message is required.'),
});

const sendInviteSchema = z.object({
    invites: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
    })),
    referralLink: z.string().url("Invalid referral link"),
});

export async function sendContactMessage(input: z.infer<typeof sendContactMessageSchema>) {
    const validatedInput = sendContactMessageSchema.safeParse(input);

    if (!validatedInput.success) {
        throw new Error('Invalid input.');
    }
    
    if (!supabaseAdmin) {
        throw new Error('Application is not configured for messaging.');
    }

    const { error } = await supabaseAdmin
        .from('sc_messages')
        .insert([
            { 
                full_name: validatedInput.data.fullName,
                email: validatedInput.data.email,
                message: validatedInput.data.message
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
        throw new Error('Invalid input: ' + JSON.stringify(validatedInput.error.flatten().fieldErrors));
    }

    console.log("Sending invites:", {
        invites: validatedInput.data.invites,
        referralLink: validatedInput.data.referralLink,
    });
    
    for (const invite of validatedInput.data.invites) {
        console.log(`Simulating sending email to ${invite.name} at ${invite.email}`);
        console.log(`Message: Hey ${invite.name}, check out this cool service! ${validatedInput.data.referralLink}`);
    }

    return { success: true, message: "Invitations have been sent successfully." };
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
    return { error: 'Invalid input: ' + JSON.stringify(validatedInput.error.flatten().fieldErrors) };
  }
  
  const { email, password, firstName, lastName, referralCode } = validatedInput.data;

  // Sign up the user via the client SDK to get a session
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`.trim(),
        referral_code: referralCode, // Pass referral code to trigger
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }
  
  // The on_auth_user_created trigger will handle inserting into sc_users.
  // We still need to handle awarding credit to the referrer, which the trigger can't do.
  if (authData.user && referralCode) {
      try {
        const { error: rpcError } = await supabaseAdmin.rpc('award_referral_credit', { p_referrer_code: referralCode });
        if (rpcError) {
            console.error("Failed to award referral credit:", rpcError);
            // Non-critical error, don't block signup
        }
      } catch(e) {
        console.error("Exception awarding referral credit:", e)
      }
  }


  return { user: authData.user, error: null };
}

export async function getUserCreditInfo(userFromClient?: User | null): Promise<string> {
    const user = userFromClient ?? await getServerUser();

    if (!user) {
        if (supabaseAdmin) {
            const headersList = headers();
            const ipAddress = headersList.get("x-forwarded-for") ?? '127.0.0.1';
            const ipHash = createHash('sha256').update(ipAddress).digest('hex');
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            
            const { count, error } = await supabaseAdmin
                .from('sc_anonymous_usage')
                .select('id', { count: 'exact', head: true })
                .eq('ip_hash', ipHash)
                .gt('created_at', twentyFourHoursAgo);

            if (error) {
                console.error("Error checking anonymous usage for header:", error);
                return "1 page remaining";
            }
            return (count !== null && count > 0) ? "0 pages remaining" : "1 page remaining";
        }
        return "1 page remaining";
    }

    if (!supabaseAdmin) {
      return "Error: Admin client not available";
    }

    const { data: userProfile, error } = await supabaseAdmin
        .from('sc_users')
        .select('credits, plan')
        .eq('id', user.id)
        .single();
    
    if (error || !userProfile) {
        console.error("Error fetching user profile for header:", error);
        // Return a default for registered users if profile is not found yet
        return "5 pages remaining"; 
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
            return `${userProfile.credits ?? 0} pages remaining`;
    }
}

    