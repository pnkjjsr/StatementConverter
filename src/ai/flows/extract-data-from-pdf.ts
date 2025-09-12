// src/ai/flows/extract-data-from-pdf.ts
'use server';

/**
 * @fileOverview Extracts tabular data from a PDF statement using AI.
 *
 * - extractDataFromPdf - A function that accepts a PDF data URI and returns the extracted tabular data.
 * - ExtractDataFromPdfInput - The input type for the extractDataFromPdf function.
 * - ExtractDataFromPdfOutput - The return type for the extractDataFromPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractDataFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractDataFromPdfInput = z.infer<typeof ExtractDataFromPdfInputSchema>;

const ExtractDataFromPdfOutputSchema = z.object({
  extractedData: z
    .string()
    .describe('The extracted tabular data from the PDF statement.'),
  tokenUsage: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
});
export type ExtractDataFromPdfOutput = z.infer<typeof ExtractDataFromPdfOutputSchema>;

export async function extractDataFromPdf(input: ExtractDataFromPdfInput): Promise<ExtractDataFromPdfOutput> {
  return extractDataFromPdfFlow(input);
}

const extractDataFromPdfPrompt = ai.definePrompt({
  name: 'extractDataFromPdfPrompt',
  input: { schema: ExtractDataFromPdfInputSchema },
  // output: { schema: ExtractDataFromPdfOutputSchema }, // Output schema is now more complex, let flow handle it.
  prompt: `You are an expert data extraction specialist. Your task is to extract tabular data from a PDF statement provided as a data URI.

  Analyze the PDF and extract all relevant tabular information, ensuring the data is accurately captured and formatted as a CSV.

  The PDF content is provided below:

  {{media url=pdfDataUri}}`,
});

const extractDataFromPdfFlow = ai.defineFlow(
  {
    name: 'extractDataFromPdfFlow',
    inputSchema: ExtractDataFromPdfInputSchema,
    outputSchema: ExtractDataFromPdfOutputSchema,
  },
  async input => {
    const result = await extractDataFromPdfPrompt(input);
    const output = result.output();

    if (!output) {
      return {
        extractedData: "",
      }
    }

    return {
      extractedData: output.extractedData,
      tokenUsage: result.usage,
    };
  }
);
