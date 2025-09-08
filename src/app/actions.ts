'use server';
import { faqBot, type FaqBotInput } from '@/ai/flows/faq-bot-flow';

export async function getFaqBotResponse(input: FaqBotInput): Promise<{ answer: string } | { error: string }> {
    try {
        const result = await faqBot(input);
        return { answer: result.answer };
    } catch (e: any) {
        console.error("Error getting response from FAQ Bot flow", e);
        return { error: e.message || "An unexpected error occurred." };
    }
}
