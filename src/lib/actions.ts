
"use server";

import { extractDataFromPdf } from "@/ai/flows/extract-data-from-pdf";
import { transformExtractedData } from "@/ai/flows/transform-extracted-data";
import { z } from "zod";
import { supabase, supabaseAdmin } from "./supabase";
import { cookies } from "next/headers";
import { createClient, type User } from "@supabase/supabase-js";

async function getUser(): Promise<User | null> {
    const cookieStore = cookies();
    // This client is safe to use on the server because it uses the user's cookie.
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
});

export async function convertPdf(input: z.infer<typeof convertPdfSchema>) {
  const validatedInput = convertPdfSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error("Invalid input: A valid PDF data URI is required.");
  }

  const user = await getUser();

  if (!user) {
    // For now, allow anonymous users one-shot access.
    // In a real scenario, we'd implement IP-based or fingerprint-based limiting.
  } else {
    if (!supabaseAdmin) {
      throw new Error("Application is not configured for user management.");
    }
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('sc_users')
      .select('credits, plan')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      throw new Error("Could not retrieve user profile.");
    }

    if (userProfile.plan === 'Free' && userProfile.credits <= 0) {
      throw new Error("You have no more credits. Please upgrade your plan to convert more documents.");
    }
  }


  try {
    let totalTokens = 0;

    // Step 1: Extract data from the PDF
    const extractionResult = await extractDataFromPdf({
      pdfDataUri: validatedInput.data.pdfDataUri,
    });

    if (!extractionResult || !extractionResult.extractedData) {
      throw new Error("AI failed to extract any data from the PDF. The document might be empty, unreadable, or image-based.");
    }
    
    if (extractionResult.tokenUsage) {
        totalTokens += extractionResult.tokenUsage.totalTokens;
    }

    // Step 2: Transform the extracted data
    const transformationResult = await transformExtractedData({
      extractedData: extractionResult.extractedData,
    });

    if (!transformationResult || !transformationResult.standardizedData) {
      throw new Error("AI failed to format the extracted data. The data might be in an unusual format.");
    }
    
    if (transformationResult.tokenUsage) {
        totalTokens += transformationResult.tokenUsage.totalTokens;
    }

    // If conversion was successful, and the user is logged in and on a free plan, decrement their credits.
    if (user && supabaseAdmin) {
      const { data: userProfile, error: profileError } = await supabaseAdmin
        .from('sc_users')
        .select('plan')
        .eq('id', user.id)
        .single();
      
      if (userProfile && userProfile.plan === 'Free') {
        const { error: decrementError } = await supabaseAdmin.rpc('decrement_credits', { p_user_id: user.id });
        if (decrementError) {
          console.error("Failed to decrement credits:", decrementError);
          // Don't block the user, but log the issue.
        }
      }
    }


    return { 
        standardizedData: transformationResult.standardizedData,
        totalTokens: totalTokens,
    };
  } catch (error) {
    console.error("Conversion process failed:", error);
    if (error instanceof Error) {
        if (error.message.includes("503") || error.message.toLowerCase().includes("model is overloaded")) {
            throw new Error("The AI model is currently overloaded. Please try again in a few moments.");
        }
        throw new Error(`Conversion process failed: ${error.message}`);
    }
    throw new Error(
      "An unknown error occurred during the conversion process. Please check the PDF file and try again."
    );
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
    
    if (!supabase) {
        throw new Error('Supabase client is not available.');
    }

    const { error } = await supabase
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

export async function getUserCreditInfo(): Promise<string> {
    const user = await getUser();
    if (!user) {
        return "1 page remaining";
    }

    if (!supabase) {
      return "Error: client not available";
    }

    const { data: userProfile, error } = await supabase
        .from('sc_users')
        .select('credits, plan')
        .eq('id', user.id)
        .single();
    
    if (error || !userProfile) {
        console.error("Error fetching user profile for header:", error);
        // Fallback for when profile is not found, maybe it's still being created
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
