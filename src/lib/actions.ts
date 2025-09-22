
"use server";

import { extractDataFromPdf } from "@/ai/flows/extract-data-from-pdf";
import { transformExtractedData } from "@/ai/flows/transform-extracted-data";
import { z } from "zod";
import { supabase } from "./supabase";

const convertPdfSchema = z.object({
  pdfDataUri: z.string().startsWith("data:application/pdf;base64,"),
});

export async function convertPdf(input: z.infer<typeof convertPdfSchema>) {
  const validatedInput = convertPdfSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error("Invalid input: A valid PDF data URI is required.");
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

export async function sendContactMessage(input: z.infer<typeof sendContactMessageSchema>) {
    const validatedInput = sendContactMessageSchema.safeParse(input);

    if (!validatedInput.success) {
        throw new Error('Invalid input.');
    }
    
    if (!supabase) {
        throw new Error('Supabase client is not available.');
    }

    const { error } = await supabase
        .from('contact_messages')
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


const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  referralCode: z.string().uuid().nullable(),
});

export async function signupWithReferral(input: z.infer<typeof signupSchema>) {
  if (!supabase) {
    return { error: 'Supabase client is not configured.' };
  }

  const validatedInput = signupSchema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input: ' + validatedInput.error.flatten().fieldErrors };
  }
  
  const { email, password, firstName, lastName, referralCode } = validatedInput.data;

  // We need to use the admin client to update another user's credits
  // For this, we'll create a Supabase Edge Function (RPC) later.
  // For now, the signup will just proceed. The credit logic is a TODO.

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        // We'll store who referred this user, to prevent duplicate credits.
        referred_by: referralCode,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // TODO: Once the user is created, call an Edge Function to credit the referrer.
  // This needs to be done securely on the backend.
  // if (referralCode && authData.user) {
  //   const { error: creditError } = await supabase.rpc('award_referral_credit', {
  //     referrer_code: referralCode,
  //     new_user_id: authData.user.id
  //   });
  //   if (creditError) {
  //     console.error("Failed to award referral credit:", creditError);
  //     // We don't block the signup, but we log the error.
  //   }
  // }

  return { user: authData.user, error: null };
}

