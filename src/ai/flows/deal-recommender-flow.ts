
'use server';

/**
 * @fileOverview An AI agent that recommends produce deals to retailers.
 *
 * - getDealRecommenderFlow - A function that generates deal recommendations.
 * - DealRecommenderInput - The input type for the function.
 * - DealRecommenderOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { ref, get, query, limitToFirst } from 'firebase/database';

const DealRecommenderInputSchema = z.object({
  retailerId: z.string(),
  recentOrders: z.array(z.any()).describe("A list of the retailer's 5 most recent orders."),
  favoriteProduceIds: z.array(z.string()).describe("A list of produce IDs the retailer has favorited."),
});
export type DealRecommenderInput = z.infer<typeof DealRecommenderInputSchema>;

const DealRecommenderOutputSchema = z.object({
  deals: z.array(z.object({
    produceId: z.string().describe("The ID of the recommended produce item."),
    reason: z.string().describe("A short, compelling reason why this deal is recommended for the retailer."),
  })).describe('A list of 2-3 personalized produce deal recommendations.'),
});
export type DealRecommenderOutput = z.infer<typeof DealRecommenderOutputSchema>;

export async function getDealRecommenderFlow(input: DealRecommenderInput): Promise<DealRecommenderOutput> {
  return dealRecommenderFlow(input);
}

const getAvailableProduceTool = ai.defineTool(
    {
        name: 'getAvailableProduce',
        description: 'Get a list of all currently available produce listings from all farmers.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            description: z.string(),
        })),
    },
    async () => {
        console.log(`Getting all available produce`);
        const produceRef = ref(db, 'produce');
        const snapshot = await get(query(produceRef, limitToFirst(50))); // Limit to 50 to avoid huge payloads
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        }
        return [];
    }
);


const prompt = ai.definePrompt({
  name: 'dealRecommenderPrompt',
  input: { schema: DealRecommenderInputSchema },
  output: { schema: DealRecommenderOutputSchema },
  tools: [getAvailableProduceTool],
  prompt: `You are an expert wholesale agricultural purchasing assistant for a retailer in India.
  Your goal is to find the best 2-3 deals for the retailer based on their activity and current market availability.

  Here is the retailer's information:
  - Retailer ID: {{{retailerId}}}
  - Recent Orders: {{{json recentOrders}}}
  - Favorited Produce IDs: {{{json favoriteProduceIds}}}

  Follow these steps:
  1.  **Analyze the retailer's history.** Look at their recent orders and favorited items to understand their preferences (e.g., types of produce, farmers they buy from).
  2.  **Get all available produce** using the 'getAvailableProduce' tool.
  3.  **Compare the available produce** with the retailer's preferences.
  4.  **Identify 2-3 top recommendations.** Look for items that match their preferences, new items from farmers they like, or high-quantity items that might be a good deal.
  5.  **For each recommendation, provide a compelling 'reason'.** The reason should be short and personalized. For example: "Based on your recent purchase of tomatoes, you might also be interested in these bell peppers from the same farmer." or "A new batch of your favorited Gala Apples is now available."
  6.  **Respond ONLY with the JSON object.**
  `,
});

const dealRecommenderFlow = ai.defineFlow(
  {
    name: 'dealRecommenderFlow',
    inputSchema: DealRecommenderInputSchema,
    outputSchema: DealRecommenderOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The AI failed to generate recommendations.");
    }
    return output;
  }
);
