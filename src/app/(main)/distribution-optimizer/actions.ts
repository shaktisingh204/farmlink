'use server';

import { optimizeDistribution } from '@/ai/flows/optimize-distribution';
import { z } from 'zod';

const MarketDemandSchema = z.object({
  marketName: z.string().min(1, 'Market name is required.'),
  demand: z.coerce.number().min(1, 'Demand must be greater than 0.'),
  location: z.string().min(1, 'Market location is required.'),
});

const DistributionOptimizerSchema = z.object({
  produceType: z.string().min(1, 'Produce type is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be greater than 0.'),
  location: z.string().min(1, 'Your location is required.'),
  quality: z.string().min(1, 'Produce quality is required.'),
  marketDemands: z.array(MarketDemandSchema).min(1, 'At least one market demand is required.'),
});

export type DistributionOptimizerState = {
  result?: {
    recommendations: {
      marketName: string;
      quantity: number;
      reason: string;
    }[];
    summary: string;
  };
  error?: string;
};

export async function optimizeDistributionAction(
  prevState: DistributionOptimizerState,
  formData: FormData
): Promise<DistributionOptimizerState> {
  try {
    const marketDemands = JSON.parse(formData.get('marketDemands') as string);
    const validatedFields = DistributionOptimizerSchema.safeParse({
      produceType: formData.get('produceType'),
      quantity: formData.get('quantity'),
      location: formData.get('location'),
      quality: formData.get('quality'),
      marketDemands: marketDemands,
    });
    
    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten());
      return {
        error: 'Invalid form data. Please check your inputs.',
      };
    }

    const result = await optimizeDistribution(validatedFields.data);
    return { result };
  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
