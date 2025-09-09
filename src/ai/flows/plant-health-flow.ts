
'use server';

/**
 * @fileOverview An AI agent that diagnoses plant health from an image.
 *
 * - diagnosePlantHealth - A function that handles the plant diagnosis process.
 * - DiagnosePlantHealthInput - The input type for the function.
 * - DiagnosePlantHealthOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('An optional description or name of the plant.'),
});
export type DiagnosePlantHealthInput = z.infer<typeof DiagnosePlantHealthInputSchema>;

const DiagnosePlantHealthOutputSchema = z.object({
    plantType: z.string().describe('The identified type of the plant, e.g., Tomato.'),
    status: z.enum(['Healthy', 'At Risk', 'Sick']).describe('The overall health status of the plant.'),
    detectedIssue: z.string().describe('The specific disease, pest, or deficiency detected. E.g., "Early blight (fungal infection)".'),
    confidence: z.number().min(0).max(100).describe('The confidence level of the diagnosis, from 0 to 100.'),
    recommendations: z.array(z.string()).describe('A list of actionable steps for treatment or prevention.'),
});
export type DiagnosePlantHealthOutput = z.infer<typeof DiagnosePlantHealthOutputSchema>;

export async function diagnosePlantHealth(input: DiagnosePlantHealthInput): Promise<DiagnosePlantHealthOutput> {
  return diagnosePlantHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantHealthPrompt',
  input: {schema: DiagnosePlantHealthInputSchema},
  output: {schema: DiagnosePlantHealthOutputSchema},
  prompt: `You are an expert botanist and plant pathologist. Your task is to analyze an image of a plant and provide a detailed health diagnosis.

  User-provided information:
  - Plant Description: {{{description}}}
  - Photo: {{media url=photoDataUri}}

  Follow these steps:
  1.  **Identify the plant species** from the photo and the description.
  2.  **Assess the plant's health**. Determine if it is 'Healthy', 'At Risk', or 'Sick'.
  3.  **Identify the specific issue**. If the plant is not healthy, diagnose the disease, pest, or nutrient deficiency. Be specific (e.g., "Early blight (fungal infection)", "Aphid infestation", "Nitrogen deficiency"). If the plant is healthy, state "No issues detected".
  4.  **Estimate your confidence** in this diagnosis as a percentage (0-100).
  5.  **Provide clear, actionable recommendations**. Give the farmer a list of concrete steps to take for treatment and prevention. For example: "Spray with a copper-based fungicide.", "Introduce ladybugs to control the aphid population.", "Remove and destroy infected leaves to prevent spread.".

  Respond ONLY with the structured JSON object.
  `,
});

const diagnosePlantHealthFlow = ai.defineFlow(
  {
    name: 'diagnosePlantHealthFlow',
    inputSchema: DiagnosePlantHealthInputSchema,
    outputSchema: DiagnosePlantHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI failed to generate a diagnosis.");
    }
    return output;
  }
);
