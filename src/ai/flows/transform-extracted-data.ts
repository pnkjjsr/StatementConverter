
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
import type { Model } from 'genkit/model';


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
    .describe("The extracted data, transformed into a standardized, CSV format."),
  tokenUsage: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
});

export type TransformExtractedDataOutput = z.infer<
  typeof TransformExtractedDataOutputSchema
>;

export async function transformExtractedData(
  input: TransformExtractedDataInput,
  options?: { model: Model<any, any> }
): Promise<TransformExtractedDataOutput> {
  return transformExtractedDataFlow(input, options);
}

const transformExtractedDataPrompt = ai.definePrompt({
  name: 'transformExtractedDataPrompt',
  input: {schema: TransformExtractedDataInputSchema},
  output: {schema: z.object({
    standardizedData: z
      .string()
      .describe("The extracted data, transformed into a standardized, CSV format. If the input is a single column, the output should also be a single column."),
  })},
  prompt: `You are an expert data transformation specialist.

You will receive raw, semi-structured data extracted from a document. Your task is to clean and standardize this data into a perfect CSV format that can be easily used in an Excel spreadsheet.

- Analyze the structure of the incoming data.
- If the data represents a multi-column table, ensure it is formatted as a valid, well-structured CSV with clear columns and rows.
- If the data is just a single column or list, format it as a single-column CSV. DO NOT invent additional columns.
- Ensure all data is properly escaped for CSV format (e.g., handle commas within fields by quoting).
- Clean up any artifacts or noise from the extraction process.

Raw Data:
{{{extractedData}}}`,
});

const transformExtractedDataFlow = ai.defineFlow(
  {
    name: 'transformExtractedDataFlow',
    inputSchema: TransformExtractedDataInputSchema,
    outputSchema: TransformExtractedDataOutputSchema,
  },
  async (input, options) => {
    const result = await transformExtractedDataPrompt(input, { model: options?.model });
    const output = result.output;
    if (!output) {
        return {
            standardizedData: ""
        };
    }

    return {
      standardizedData: output.standardizedData,
      tokenUsage: result.usage,
    };
  }
);
