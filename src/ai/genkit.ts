
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const primaryModel = googleAI.model('gemini-2.5-flash');
export const fallbackModel = googleAI.model('gemini-2.5-pro');

export const ai = genkit({
  plugins: [googleAI({
    apiVersion: 'v1beta',
  })],
  model: primaryModel,
});
