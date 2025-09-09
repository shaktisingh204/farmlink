
'use server';

import { diagnosePlantHealth } from '@/ai/flows/plant-health-flow';
import { z } from 'zod';

const DiagnosePlantHealthSchema = z.object({
  photoDataUri: z.string().min(1, 'Image is required.'),
  description: z.string().optional(),
});

export type PlantHealthState = {
  result?: {
    plantType: string;
    status: 'Healthy' | 'At Risk' | 'Sick';
    detectedIssue: string;
    confidence: number;
    recommendations: string[];
    uploadedImage: string;
  };
  error?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
};

export async function getPlantHealthAction(
  prevState: PlantHealthState,
  formData: FormData
): Promise<PlantHealthState> {
  const validatedFields = DiagnosePlantHealthSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await diagnosePlantHealth(validatedFields.data);
    return {
      result: {
        ...result,
        uploadedImage: validatedFields.data.photoDataUri,
      },
    };
  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
