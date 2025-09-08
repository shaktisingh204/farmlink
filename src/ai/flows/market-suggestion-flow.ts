'use server';

/**
 * @fileOverview An AI agent that analyzes market data to provide actionable suggestions to farmers.
 *
 * - getMarketSuggestions - A function that provides market suggestions.
 * - MarketSuggestionInput - The input type for the getMarketSuggestions function.
 * - MarketSuggestionOutput - The return type for the getMarketSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getMarketData, type MarketRecord } from '@/app/(farmer)/farmer-dashboard/market-prices/actions';

const MarketSuggestionInputSchema = z.object({
  commodity: z.string().describe('The type of agricultural produce (e.g., tomatoes, apples, corn).'),
});
export type MarketSuggestionInput = z.infer<typeof MarketSuggestionInputSchema>;

const MarketSuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of actionable suggestions for the farmer based on the market data.'),
  summary: z.string().describe('A high-level summary of the current market situation for the given commodity.'),
});
export type MarketSuggestionOutput = z.infer<typeof MarketSuggestionOutputSchema>;

export async function getMarketSuggestions(input: MarketSuggestionInput): Promise<MarketSuggestionOutput> {
  return marketSuggestionFlow(input);
}

const getMarketDataTool = ai.defineTool(
    {
        name: 'getLatestMarketData',
        description: 'Get the latest market prices for a given commodity across various locations. Returns the top 5 records.',
        inputSchema: z.object({
            commodity: z.string().describe("The commodity to search for."),
        }),
        outputSchema: z.array(z.object({
            Market: z.string(),
            District: z.string(),
            State: z.string(),
            Min_Price: z.string(),
            Max_Price: z.string(),
            Modal_Price: z.string(),
        })),
    },
    async (input) => {
        console.log(`Getting market data for ${input.commodity}`);
        const marketData = await getMarketData({
            limit: 5,
            filters: {
                Commodity: input.commodity,
                Arrival_Date: new Date().toISOString(),
            },
        });
        
        return marketData.map(record => ({
            Market: record.Market,
            District: record.District,
            State: record.State,
            Min_Price: record.Min_Price,
            Max_Price: record.Max_Price,
            Modal_Price: record.Modal_Price,
        }));
    }
);


const prompt = ai.definePrompt({
  name: 'marketSuggestionPrompt',
  input: {schema: MarketSuggestionInputSchema},
  output: {schema: MarketSuggestionOutputSchema},
  tools: [getMarketDataTool],
  prompt: `You are an expert agricultural market analyst for farmers in India. Your goal is to provide clear, actionable advice.

  User-provided commodity: {{{commodity}}}
  
  1. Use the 'getLatestMarketData' tool to fetch the most recent market prices for the user's commodity.
  2. Analyze the data you receive. Look for markets with high prices (both max and modal), significant price differences between markets, or other interesting trends.
  3. Based on your analysis, generate a bulleted list of 2-3 specific, actionable 'suggestions' for the farmer. For example, "Consider selling at [Market Name] in [District] where the maximum price is ₹[Price], which is higher than other listed markets." or "The price range in [District] is wide, from ₹[Min] to ₹[Max]. Aim for the higher end if your produce is of high quality."
  4. Provide a 'summary' of the overall market conditions. For example, "Prices for {{{commodity}}} are currently strongest in the [State/Region] region, with several markets showing high demand."
  5. Respond ONLY with the JSON object containing 'suggestions' and 'summary'. Do not add any extra conversational text.
  `,
});

const marketSuggestionFlow = ai.defineFlow(
  {
    name: 'marketSuggestionFlow',
    inputSchema: MarketSuggestionInputSchema,
    outputSchema: MarketSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
