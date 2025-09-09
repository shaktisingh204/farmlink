'use server';
import { agriAssist, type AgriAssistInput } from '@/ai/flows/agri-assist-flow';

export async function getAgriAssistResponse(input: AgriAssistInput): Promise<{ answer: string, audioDataUri?: string } | { error: string }> {
    try {
        const result = await agriAssist(input);
        return { answer: result.answer, audioDataUri: result.audioDataUri };
    } catch (e: any) {
        console.error("Error getting response from Agri-Assist flow", e);
        return { error: e.message || "An unexpected error occurred." };
    }
}
