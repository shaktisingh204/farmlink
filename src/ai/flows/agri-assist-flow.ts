'use server';

/**
 * @fileOverview An AI agent that serves as an agricultural assistant for farmers.
 *
 * - agriAssistFlow - A function that answers farming-related questions.
 * - AgriAssistInput - The input type for the function.
 * - AgriAssistOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgriAssistInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
      text: z.string()
    }))
  })).optional(),
  message: z.string().describe('The farmer\'s question about agriculture.'),
});
export type AgriAssistInput = z.infer<typeof AgriAssistInputSchema>;

const AgriAssistOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the farmer\'s question.'),
});
export type AgriAssistOutput = z.infer<typeof AgriAssistOutputSchema>;

export async function agriAssist(input: AgriAssistInput): Promise<AgriAssistOutput> {
  return agriAssistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agriAssistPrompt',
  input: {schema: AgriAssistInputSchema},
  output: {schema: AgriAssistOutputSchema},
  prompt: `You are an expert agricultural assistant. Your audience is farmers in India.
  Your goal is to provide helpful, concise, and actionable answers to their questions.
  Use a friendly and encouraging tone. Keep answers short and to the point where possible.
  
  User's question:
  {{{message}}}
  `,
});

const agriAssistFlow = ai.defineFlow(
  {
    name: 'agriAssistFlow',
    inputSchema: AgriAssistInputSchema,
    outputSchema: AgriAssistOutputSchema,
  },
  async (input) => {
    const { history, message } = input;
    const llmHistory = history?.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const llmResponse = await ai.generate({
        prompt: message,
        history: llmHistory,
        model: 'googleai/gemini-2.5-flash',
    });

    return { answer: llmResponse.text };
  }
);
