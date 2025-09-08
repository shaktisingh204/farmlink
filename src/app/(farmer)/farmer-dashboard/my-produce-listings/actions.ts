
'use server';

import { db, auth } from '@/lib/firebase';
import { ref, push, set, get } from 'firebase/database';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

// This is a temporary solution to get the user on the server.
// In a real app, you would have a more robust session management system.
async function getCurrentUserId() {
    try {
        const adminApp = getFirebaseAdminApp();
        // This is a placeholder for getting the current user's ID.
        // This won't work as is in a real app without passing the session cookie or token.
        // For this prototype, we'll have to rely on client-side auth state or a different method.
        // A simple approach for this prototype would be to pass the UID from the client,
        // but that's not secure. For now, we'll simulate it.
        // Let's assume we can get it, but acknowledge this is a simplification.
        // In a real app, you'd verify a JWT token from the client.
        return auth.currentUser?.uid; // This will likely be null on the server.
    } catch (e) {
        console.log("Could not get admin auth", e)
        return null;
    }
}


const ProduceSchema = z.object({
  name: z.string().min(1, 'Produce name is required.'),
  variety: z.string().min(1, 'Variety is required.'),
  quantity: z.coerce.number().min(0.1, 'Quantity is required.'),
  price: z.coerce.number().min(0.01, 'Price is required.'),
  description: z.string().min(1, 'Description is required.'),
  imageUrl: z.string().optional(),
  farmerId: z.string().min(1, "Farmer ID is required."), // Added farmerId
});

export type AddProduceState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
};

export async function addProduceAction(
  prevState: AddProduceState,
  formData: FormData
): Promise<AddProduceState> {
  try {
    const validatedFields = ProduceSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return {
        error: 'Invalid form data. Please check your inputs.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    if (!validatedFields.data.farmerId) {
        return { error: 'You must be logged in to add produce.' };
    }

    const newProduceRef = push(ref(db, 'produce'));
    await set(newProduceRef, {
      ...validatedFields.data,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/farmer-dashboard/my-produce-listings');
    revalidatePath('/retailer-dashboard/browse-produce'); // Revalidate retailer page
    return { success: true };
  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function getProduceListings() {
    try {
        const produceRef = ref(db, 'produce');
        const snapshot = await get(produceRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching produce listings:", error);
        return [];
    }
}
