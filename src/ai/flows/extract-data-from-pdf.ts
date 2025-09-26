
// src/ai/flows/extract-data-from-pdf.ts
'use server';

/**
 * @fileOverview Extracts tabular data from a PDF statement using AI and formats it into a standardized CSV.
 *
 * - extractDataFromPdf - A function that accepts a PDF data URI and returns the extracted and standardized tabular data as a CSV.
 * - ExtractDataFromPdfInput - The input type for the extractDataFromPdf function.
 * - ExtractDataFromPdfOutput - The return type for the extractDataFromPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Model } from 'genkit/model';

const ExtractDataFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractDataFromPdfInput = z.infer<typeof ExtractDataFromPdfInputSchema>;

const ExtractDataFromPdfOutputSchema = z.object({
  standardizedData: z
    .string()
    .describe('The extracted and standardized tabular data from the PDF statement, formatted as a CSV.'),
  tokenUsage: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
});
export type ExtractDataFromPdfOutput = z.infer<typeof ExtractDataFromPdfOutputSchema>;

export async function extractDataFromPdf(input: ExtractDataFromPdfInput, options?: { model: Model<any, any> }): Promise<ExtractDataFromPdfOutput> {
  return extractDataFromPdfFlow(input, options);
}

const extractDataFromPdfPrompt = ai.definePrompt({
  name: 'extractDataFromPdfPrompt',
  input: { schema: ExtractDataFromPdfInputSchema },
  output: { schema: z.object({
    standardizedData: z
      .string()
      .describe('The extracted data, transformed into a standardized, CSV format. If the input is a single column, the output should also be a single column.'),
  })},
  prompt: `You are an expert data extraction and transformation specialist. Your task is to extract tabular data from a PDF statement and format it into a perfect, standardized CSV format suitable for Excel.

Analyze the PDF and extract all relevant tabular information.
- First, determine if the document contains a multi-column table or just a simple single-column list.
- If it's a multi-column table, ensure the data is accurately captured and formatted as a well-structured CSV. Preserve headers.
- If it's just a single column or a simple list, extract that data into a single-column CSV. DO NOT invent new columns or data.
- Ensure all data is properly escaped for CSV format (e.g., handle commas within fields by quoting them).
- Clean up any artifacts, noise, or irrelevant text from the extraction process.
- The final output must only be the clean CSV data and nothing else.

The PDF content is provided below:

{{media url=pdfDataUri}}`,
});

const extractDataFromPdfFlow = ai.defineFlow(
  {
    name: 'extractDataFromPdfFlow',
    inputSchema: ExtractDataFromPdfInputSchema,
    outputSchema: ExtractDataFromPdfOutputSchema,
  },
  async (input, options) => {
    const result = await extractDataFromPdfPrompt(input, { model: options?.model });
    const output = result.output;

    if (!output) {
      return {
        standardizedData: "",
      }
    }

    return {
      standardizedData: output.standardizedData,
      tokenUsage: result.usage,
    };
  }
);
