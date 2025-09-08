// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-driven supply chain optimization for farmers.
 *
 * - optimizeDistribution - A function that analyzes supply and demand to recommend efficient distribution strategies.
 * - OptimizeDistributionInput - The input type for the optimizeDistribution function.
 * - OptimizeDistributionOutput - The return type for the optimizeDistribution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeDistributionInputSchema = z.object({
  produceType: z.string().describe('The type of produce (e.g., tomatoes, lettuce).'),
  quantity: z.number().describe('The quantity of produce available (e.g., in kilograms or pounds).'),
  location: z.string().describe('The current location of the produce (e.g., city, region).'),
  marketDemands: z.array(z.object({
    marketName: z.string().describe('The name of the local market.'),
    demand: z.number().describe('The estimated demand at the market (e.g., in kilograms or pounds).'),
    location: z.string().describe('The location of the market.'),
  })).describe('An array of local markets and their estimated demands.'),
  quality: z.string().describe('The quality of the produce (e.g., fresh, slightly bruised).'),
});

export type OptimizeDistributionInput = z.infer<typeof OptimizeDistributionInputSchema>;

const OptimizeDistributionOutputSchema = z.object({
  recommendations: z.array(z.object({
    marketName: z.string().describe('The name of the market to distribute to.'),
    quantity: z.number().describe('The recommended quantity to distribute to the market.'),
    reason: z.string().describe('The reasoning behind the distribution recommendation.'),
  })).describe('An array of distribution recommendations for each market.'),
  summary: z.string().describe('A summary of the overall distribution strategy.'),
});

export type OptimizeDistributionOutput = z.infer<typeof OptimizeDistributionOutputSchema>;

export async function optimizeDistribution(input: OptimizeDistributionInput): Promise<OptimizeDistributionOutput> {
  return optimizeDistributionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeDistributionPrompt',
  input: {schema: OptimizeDistributionInputSchema},
  output: {schema: OptimizeDistributionOutputSchema},
  prompt: `You are an AI assistant that helps farmers optimize the distribution of their produce to local markets.

  Analyze the following information to provide distribution recommendations:

  Produce Type: {{{produceType}}}
  Quantity Available: {{{quantity}}} 
  Location: {{{location}}}
  Quality: {{{quality}}}
  Market Demands:
  {{#each marketDemands}}
    - Market Name: {{{marketName}}}, Demand: {{{demand}}}, Location: {{{location}}}
  {{/each}}

  Based on this information, recommend the optimal distribution strategy to minimize waste and maximize profit for the farmer.
  Consider factors such as market demand, transportation costs, and produce quality.
  Provide a clear recommendation for each market, including the quantity of produce to distribute and the reasoning behind the recommendation. Also include a summary of the overall strategy.
  `,
});

const optimizeDistributionFlow = ai.defineFlow(
  {
    name: 'optimizeDistributionFlow',
    inputSchema: OptimizeDistributionInputSchema,
    outputSchema: OptimizeDistributionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
