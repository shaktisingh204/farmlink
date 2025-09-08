'use server';

import { fairPriceEstimator } from '@/ai/flows/fair-price-estimator';
import { z } from 'zod';

const PriceEstimatorSchema = z.object({
  produceType: z.string().min(1, 'Produce type is required.'),
  quantity: z.coerce.number().min(0.1, 'Quantity must be greater than 0.'),
  qualityDescription: z.string().min(1, 'Quality description is required.'),
  location: z.string().min(1, 'Location is required.'),
});

export type PriceEstimatorState = {
  result?: {
    recommendedPrice: number;
    priceReasoning: string;
  };
  error?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
};

export async function estimatePriceAction(
  prevState: PriceEstimatorState,
  formData: FormData
): Promise<PriceEstimatorState> {
  const validatedFields = PriceEstimatorSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await fairPriceEstimator(validatedFields.data);
    return { result };
  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
