
"use server";

import { extractDataFromPdf } from "@/ai/flows/extract-data-from-pdf";
import { transformExtractedData } from "@/ai/flows/transform-extracted-data";
import { z } from "zod";

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
