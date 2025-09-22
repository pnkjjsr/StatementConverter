
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
