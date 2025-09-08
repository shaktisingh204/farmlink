'use server';

/**
 * @fileOverview An AI agent that provides fair price recommendations for agricultural produce based on an image and real-time market data.
 *
 * - producePriceAdvisor - A function that handles the price estimation process.
 * - ProducePriceAdvisorInput - The input type for the producePriceAdvisor function.
 * - ProducePriceAdvisorOutput - The return type for the producePriceAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getMarketData } from '@/app/(farmer)/farmer-dashboard/market-prices/actions';


const ProducePriceAdvisorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a produce item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  commodity: z.string().describe('The type of agricultural produce (e.g., tomatoes, apples, corn).'),
  variety: z.string().describe('The variety of the produce (e.g., Roma, Gala).'),
  location: z.string().describe('The location where the produce is being sold (e.g., city, region).'),
});
export type ProducePriceAdvisorInput = z.infer<typeof ProducePriceAdvisorInputSchema>;

const ProducePriceAdvisorOutputSchema = z.object({
  identification: z.string().describe('The produce identified from the image.'),
  isMatch: z.boolean().describe('Whether the identified produce matches the user-provided commodity.'),
  quality: z.string().describe('A detailed assessment of the produce quality based on the image.'),
  recommendedPrice: z.number().describe('The recommended fair price for the produce per kg.'),
  priceReasoning: z.string().describe('The reasoning behind the recommended price, considering identification, quality, and market data.'),
});
export type ProducePriceAdvisorOutput = z.infer<typeof ProducePriceAdvisorOutputSchema>;

export async function producePriceAdvisor(input: ProducePriceAdvisorInput): Promise<ProducePriceAdvisorOutput> {
  return producePriceAdvisorFlow(input);
}


const getMarketPriceTool = ai.defineTool(
    {
        name: 'getMarketPrice',
        description: 'Get the min and max price for a given commodity from the market data API.',
        inputSchema: z.object({
            commodity: z.string().describe("The commodity to search for."),
        }),
        outputSchema: z.object({
            minPrice: z.number().optional(),
            maxPrice: z.number().optional(),
        }),
    },
    async (input) => {
        console.log(`Getting market data for ${input.commodity}`);
        const marketData = await getMarketData({
            limit: 1,
            filters: {
                Commodity: input.commodity,
            },
        });

        if (marketData.length > 0) {
            const record = marketData[0];
            return {
                minPrice: parseFloat(record.Min_Price),
                maxPrice: parseFloat(record.Max_Price),
            };
        }
        return {};
    }
);


const prompt = ai.definePrompt({
  name: 'producePriceAdvisorPrompt',
  input: {schema: ProducePriceAdvisorInputSchema},
  output: {schema: ProducePriceAdvisorOutputSchema},
  tools: [getMarketPriceTool],
  prompt: `You are an expert agricultural analyst. Your task is to analyze an image of produce, identify it, assess its quality, and recommend a fair market price.

  User-provided information:
  - Commodity: {{{commodity}}}
  - Variety: {{{variety}}}
  - Location: {{{location}}}
  - Photo: {{media url=photoDataUri}}

  Follow these steps:
  1.  **Identify the produce in the photo.** Determine what the item is (e.g., "Tomato", "Apple").
  2.  **Compare your identification** with the user-provided "Commodity". Set the 'isMatch' field to true if they are the same, and false otherwise.
  3.  **Assess the quality** of the produce from the image. Look for factors like freshness, ripeness, size, color, and any visible defects like bruises, blemishes, or signs of disease. Provide a detailed description in the 'quality' field.
  4.  **Determine a fair price.** Use the 'getMarketPrice' tool with the user-provided commodity to get the current minimum and maximum market prices.
  5.  **Calculate a recommended price.** Based on your quality assessment and the fetched market prices, calculate a specific recommended price per kg. For example, if the quality is premium, the price should be closer to the max price. If the quality is poor, it should be closer to the min price.
  6.  **Provide reasoning.** In the 'priceReasoning' field, explain how you arrived at the recommended price, referencing the visual quality, market data, and your identification.
  `,
});

const producePriceAdvisorFlow = ai.defineFlow(
  {
    name: 'producePriceAdvisorFlow',
    inputSchema: ProducePriceAdvisorInputSchema,
    outputSchema: ProducePriceAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
