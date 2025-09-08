'use server';

import { getMarketSuggestions } from '@/ai/flows/market-suggestion-flow';
import { z } from 'zod';

const MarketSuggestionSchema = z.object({
  commodity: z.string().min(1, 'Commodity is required.'),
});

export type MarketSuggestionState = {
  result?: {
    suggestions: string[];
    summary: string;
  };
  error?: string;
  fieldErrors?: {
    commodity?: string[];
  };
};

export async function getMarketSuggestionAction(
  prevState: MarketSuggestionState,
  formData: FormData
): Promise<MarketSuggestionState> {
  const validatedFields = MarketSuggestionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await getMarketSuggestions(validatedFields.data);
    return { result };
  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred while fetching suggestions.' };
  }
}
