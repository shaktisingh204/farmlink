'use server';

import { summarizeMarketPrices } from '@/ai/flows/real-time-price-summarization';
import { z } from 'zod';

const MarketPricesSchema = z.object({
  product: z.string().min(1, 'Product is required.'),
  sources: z.string().min(1, 'At least one source is required.'),
});

export type MarketPricesState = {
  result?: {
    summary: string;
  };
  error?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
};

export async function summarizePricesAction(
  prevState: MarketPricesState,
  formData: FormData
): Promise<MarketPricesState> {
  const sourcesString = formData.get('sources') as string;
  const sources = sourcesString ? sourcesString.split(',').map(s => s.trim()).filter(Boolean) : [];

  const validatedFields = MarketPricesSchema.safeParse({
    product: formData.get('product'),
    sources: sourcesString,
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await summarizeMarketPrices({
      product: validatedFields.data.product,
      sources,
    });
    return { result };
  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
