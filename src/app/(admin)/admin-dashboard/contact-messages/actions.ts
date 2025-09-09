
'use server';

import { db } from '@/lib/firebase';
import { ref, get, set, serverTimestamp } from 'firebase/database';
import { revalidatePath } from 'next/cache';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export async function getContactMessages(): Promise<{
  messages?: ContactMessage[];
  error?: string;
}> {
  try {
    const messagesRef = ref(db, 'contactMessages');
    const snapshot = await get(messagesRef);

    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      const messagesList: ContactMessage[] = Object.keys(messagesData)
        .map((key) => ({
          id: key,
          ...messagesData[key],
        }))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      return { messages: messagesList };
    }

    return { messages: [] };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { error: 'A server error occurred while fetching messages.' };
  }
}

export async function markMessageAsRead(messageId: string): Promise<{ success?: boolean, error?: string }> {
    try {
        const messageRef = ref(db, `contactMessages/${messageId}/isRead`);
        await set(messageRef, true);
        revalidatePath('/admin-dashboard/contact-messages');
        return { success: true };
    } catch(e: any) {
        console.error("Failed to mark message as read", e);
        return { error: "Could not update the message status." };
    }
}
