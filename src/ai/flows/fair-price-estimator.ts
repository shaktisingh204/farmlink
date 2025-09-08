'use server';

/**
 * @fileOverview An AI agent that provides fair price recommendations for agricultural produce based on real-time market data and product quality.
 *
 * - fairPriceEstimator - A function that handles the price estimation process.
 * - FairPriceEstimatorInput - The input type for the fairPriceEstimator function.
 * - FairPriceEstimatorOutput - The return type for the fairPriceEstimator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FairPriceEstimatorInputSchema = z.object({
  produceType: z.string().describe('The type of agricultural produce (e.g., tomatoes, apples, corn).'),
  quantity: z.number().describe('The quantity of the produce available (e.g., 100 kg).'),
  qualityDescription: z.string().describe('A description of the quality of the produce (e.g., organic, fresh, slightly bruised).'),
  location: z.string().describe('The location where the produce is being sold (e.g., city, region).'),
});
export type FairPriceEstimatorInput = z.infer<typeof FairPriceEstimatorInputSchema>;

const FairPriceEstimatorOutputSchema = z.object({
  recommendedPrice: z.number().describe('The recommended fair price for the produce (e.g., 2.50).'),
  priceReasoning: z.string().describe('The reasoning behind the recommended price, based on market data and product quality.'),
});
export type FairPriceEstimatorOutput = z.infer<typeof FairPriceEstimatorOutputSchema>;

export async function fairPriceEstimator(input: FairPriceEstimatorInput): Promise<FairPriceEstimatorOutput> {
  return fairPriceEstimatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fairPriceEstimatorPrompt',
  input: {schema: FairPriceEstimatorInputSchema},
  output: {schema: FairPriceEstimatorOutputSchema},
  prompt: `You are an AI assistant that helps farmers determine a fair price for their produce.

  Based on the following information, provide a recommended price and explain your reasoning:

  Produce Type: {{{produceType}}}
  Quantity: {{{quantity}}}
  Quality Description: {{{qualityDescription}}}
  Location: {{{location}}}

  Consider real-time market data, the quality of the produce, and the location to provide the best recommendation.
  `,
});

const fairPriceEstimatorFlow = ai.defineFlow(
  {
    name: 'fairPriceEstimatorFlow',
    inputSchema: FairPriceEstimatorInputSchema,
    outputSchema: FairPriceEstimatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
