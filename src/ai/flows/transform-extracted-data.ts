'use server';

/**
 * @fileOverview Transforms extracted data from a PDF into a standardized format suitable for Excel conversion.
 *
 * - transformExtractedData - A function that transforms extracted data into a standardized format.
 * - TransformExtractedDataInput - The input type for the transformExtractedData function.
 * - TransformExtractedDataOutput - The return type for the transformExtractedData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransformExtractedDataInputSchema = z.object({
  extractedData: z
    .string()
    .describe("The extracted data from the PDF, in a raw format."),
});

export type TransformExtractedDataInput = z.infer<
  typeof TransformExtractedDataInputSchema
>;

const TransformExtractedDataOutputSchema = z.object({
  standardizedData: z
    .string()
    .describe("The extracted data, transformed into a standardized, tabular format."),
});

export type TransformExtractedDataOutput = z.infer<
  typeof TransformExtractedDataOutputSchema
>;

export async function transformExtractedData(
  input: TransformExtractedDataInput
): Promise<TransformExtractedDataOutput> {
  return transformExtractedDataFlow(input);
}

const transformExtractedDataPrompt = ai.definePrompt({
  name: 'transformExtractedDataPrompt',
  input: {schema: TransformExtractedDataInputSchema},
  output: {schema: TransformExtractedDataOutputSchema},
  prompt: `You are an expert data transformation specialist.

You will receive raw data extracted from a PDF document. Your task is to transform this data into a standardized tabular format that can be easily converted into an Excel spreadsheet.

Ensure that the transformed data is well-structured, with clear columns and rows.

Raw Data: {{{extractedData}}}`,
});

const transformExtractedDataFlow = ai.defineFlow(
  {
    name: 'transformExtractedDataFlow',
    inputSchema: TransformExtractedDataInputSchema,
    outputSchema: TransformExtractedDataOutputSchema,
  },
  async input => {
    const {output} = await transformExtractedDataPrompt(input);
    return output!;
  }
);
