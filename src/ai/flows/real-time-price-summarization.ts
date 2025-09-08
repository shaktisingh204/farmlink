// 'use server'
'use server';

/**
 * @fileOverview Summarizes real-time market prices for agricultural products from different sources.
 *
 * - summarizeMarketPrices - A function that summarizes market prices.
 * - SummarizeMarketPricesInput - The input type for the summarizeMarketPrices function.
 * - SummarizeMarketPricesOutput - The return type for the summarizeMarketPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketPricesInputSchema = z.object({
  product: z.string().describe('The agricultural product to summarize prices for.'),
  sources: z
    .array(z.string())
    .describe(
      'A list of sources to fetch market prices from.  These sources will be passed to the `getMarketPrice` tool, if available.'
    ),
});
export type SummarizeMarketPricesInput = z.infer<typeof SummarizeMarketPricesInputSchema>;

const SummarizeMarketPricesOutputSchema = z.object({
  summary: z.string().describe('A summary of the current market prices for the specified product.'),
});
export type SummarizeMarketPricesOutput = z.infer<typeof SummarizeMarketPricesOutputSchema>;

export async function summarizeMarketPrices(
  input: SummarizeMarketPricesInput
): Promise<SummarizeMarketPricesOutput> {
  return summarizeMarketPricesFlow(input);
}

const getMarketPrice = ai.defineTool({
  name: 'getMarketPrice',
  description: 'Returns the current market price for a given agricultural product from a specific source.',
  inputSchema: z.object({
    product: z.string().describe('The agricultural product to get the price for.'),
    source: z.string().describe('The source to get the market price from.'),
  }),
  outputSchema: z.number().describe('The current market price for the product in INR.'),
},
async (input) => {
  // TODO: Implement the actual market price fetching logic here.
  // This is just a placeholder implementation.
  console.log(`getting market price for ${input.product} from ${input.source}`);
  return Math.random() * 10;
});

const summarizeMarketPricesPrompt = ai.definePrompt({
  name: 'summarizeMarketPricesPrompt',
  tools: [getMarketPrice],
  input: {schema: SummarizeMarketPricesInputSchema},
  output: {schema: SummarizeMarketPricesOutputSchema},
  prompt: `You are an expert agricultural market analyst.

  Summarize the current market prices for {{product}} from the following sources:
  {{#each sources}}
  - {{this}}
  {{/each}}

  Use the getMarketPrice tool to get the current price from each source.

  Provide a concise summary of the market prices, including the range of prices and any significant trends.
  `,
});

const summarizeMarketPricesFlow = ai.defineFlow(
  {
    name: 'summarizeMarketPricesFlow',
    inputSchema: SummarizeMarketPricesInputSchema,
    outputSchema: SummarizeMarketPricesOutputSchema,
  },
  async input => {
    const {output} = await summarizeMarketPricesPrompt(input);
    return output!;
  }
);
