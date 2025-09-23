import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const primaryModel = googleAI.model('gemini-1.5-flash-latest');
export const fallbackModel = googleAI.model('gemini-1.5-pro-latest');

export const ai = genkit({
  plugins: [googleAI()],
  model: primaryModel,
});
