'use server';

import { producePriceAdvisor } from '@/ai/flows/produce-pricer-flow';
import { z } from 'zod';

const ProducePriceAdvisorSchema = z.object({
  photoDataUri: z.string().min(1, 'Image is required.'),
  commodity: z.string().min(1, 'Commodity is required.'),
  variety: z.string().min(1, 'Variety is required.'),
  location: z.string().min(1, 'Location is required.'),
});

export type PriceAdvisorState = {
  result?: {
    identification: string;
    isMatch: boolean;
    quality: string;
    recommendedPrice: number;
    priceReasoning: string;
  };
  error?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
};

export async function getPriceAdviceAction(
  prevState: PriceAdvisorState,
  formData: FormData
): Promise<PriceAdvisorState> {
  const validatedFields = ProducePriceAdvisorSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await producePriceAdvisor(validatedFields.data);
    return { result };
  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
