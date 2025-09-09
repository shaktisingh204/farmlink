
'use server';
import { faqBot, type FaqBotInput } from '@/ai/flows/faq-bot-flow';
import { db } from '@/lib/firebase';
import { push, ref, set } from 'firebase/database';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function getFaqBotResponse(input: FaqBotInput): Promise<{ answer: string, audioDataUri?: string } | { error: string }> {
    try {
        const result = await faqBot(input);
        return { answer: result.answer, audioDataUri: result.audioDataUri };
    } catch (e: any) {
        console.error("Error getting response from FAQ Bot flow", e);
        return { error: e.message || "An unexpected error occurred." };
    }
}


const ContactFormSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

export type ContactFormState = {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        [key: string]: string[];
    };
};

export async function saveContactMessageAction(
    prevState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const validatedFields = ContactFormSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            error: 'Invalid form data.',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    try {
        const contactMessagesRef = ref(db, 'contactMessages');
        const newMessageRef = push(contactMessagesRef);
        await set(newMessageRef, {
            ...validatedFields.data,
            timestamp: new Date().toISOString(),
            isRead: false,
        });
        
        revalidatePath('/admin-dashboard/contact-messages');
        return { success: true };

    } catch (e: any) {
        console.error("Failed to save contact message", e);
        return { error: 'An unexpected error occurred. Please try again.' };
    }
}
