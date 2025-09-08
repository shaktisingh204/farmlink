
'use server';

import { db } from '@/lib/firebase';
import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ProduceSchema = z.object({
  name: z.string().min(1, 'Produce name is required.'),
  variety: z.string().min(1, 'Variety is required.'),
  quantity: z.coerce.number().min(0.1, 'Quantity is required.'),
  price: z.coerce.number().min(0.01, 'Price is required.'),
  description: z.string().min(1, 'Description is required.'),
  imageUrl: z.string().optional(),
  farmerId: z.string().min(1, "Farmer ID is required."),
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

export async function getProduceListings(farmerId: string) {
    try {
        const produceRef = ref(db, 'produce');
        const q = query(produceRef, orderByChild('farmerId'), equalTo(farmerId));
        const snapshot = await get(q);

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
