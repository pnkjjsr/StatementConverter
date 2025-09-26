import {genkit, type Model} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const primaryModel = googleAI.model('gemini-2.5-flash-lite');
export const fallbackModel = googleAI.model('gemini-2.5-flash');
export const tertiaryModel = googleAI.model('gemini-2.5-pro');

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  // By default, Genkit will use the 'vertex' API if a location is provided.
  // We provide a default model here, but we will specify which model to use
  // at the call site in the action.
  model: 'googleai/gemini-2.5-flash',
  flow: {
    retry: {
      maxAttempts: 3,
      backoff: {
        // Double the delay with each retry, starting at 1s
        initialDelay: 1000,
        factor: 2,
        maxDelay: 30000,
        // Add a random jitter to the delay to avoid thundering herd issues
        jitter: true,
      },
    },
  },
});
