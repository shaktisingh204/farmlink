
'use server';

import { db } from '@/lib/firebase';
import { ref, push, set, get, query, orderByChild, equalTo, update } from 'firebase/database';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Produce } from '@/lib/types';
import { cn } from '@/lib/utils';

const ProduceSchema = z.object({
  name: z.string().min(1, 'Produce name is required.'),
  variety: z.string().min(1, 'Variety is required.'),
  quantity: z.coerce.number().min(0.1, 'Quantity is required.'),
  price: z.coerce.number().min(0.01, 'Price is required.'),
  description: z.string().min(1, 'Description is required.'),
  imageUrl: z.string().optional().transform(val => (val === '' ? undefined : val)),
  farmerId: z.string().min(1, 'Farmer ID is required.'),
  createdAt: z.string(),
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
    const validatedFields = ProduceSchema.safeParse({
      ...Object.fromEntries(formData.entries()),
      createdAt: new Date().toISOString(),
    });

    if (!validatedFields.success) {
      console.error('Validation failed:', validatedFields.error.flatten());
      return {
        error: 'Invalid form data. Please check your inputs.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    if (!validatedFields.data.farmerId) {
        return { error: 'You must be logged in to add produce.' };
    }

    const newProduceRef = push(ref(db, 'produce'));
    await set(newProduceRef, validatedFields.data);

    revalidatePath('/farmer-dashboard/my-produce-listings');
    revalidatePath('/retailer-dashboard/browse-produce'); // Revalidate retailer page
    return { success: true };
  } catch (e: any)
  {
    console.error('Error in addProduceAction:', e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function updateProduceAction(
  produceId: string,
  prevState: AddProduceState,
  formData: FormData
): Promise<AddProduceState> {
  try {
    const UpdateSchema = ProduceSchema.omit({ createdAt: true });
    const validatedFields = UpdateSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
       console.error('Update validation failed:', validatedFields.error.flatten());
      return {
        error: 'Invalid form data. Please check your inputs.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    if (!validatedFields.data.farmerId) {
        return { error: 'You must be logged in to update produce.' };
    }

    const produceRef = ref(db, `produce/${produceId}`);
    
    const snapshot = await get(produceRef);
    if (!snapshot.exists()) {
        return { error: 'The produce listing you are trying to edit does not exist.' };
    }
    const existingData = snapshot.val();
    
    const dataToUpdate = {
        ...existingData,
        ...validatedFields.data,
    };

    await set(produceRef, dataToUpdate);

    revalidatePath('/farmer-dashboard/my-produce-listings');
    revalidatePath(`/farmer-dashboard/my-produce-listings/edit/${produceId}`);
    revalidatePath('/retailer-dashboard/browse-produce');
    return { success: true };
  } catch (e: any) {
    console.error("Error in updateProduceAction:", e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function getProduceListings(farmerId?: string | null): Promise<{ produce: Produce[] }> {
    try {
        const produceRef = ref(db, 'produce');
        let dataQuery;

        if (farmerId) {
            // If a farmerId is provided, fetch only their produce
            dataQuery = query(produceRef, orderByChild('farmerId'), equalTo(farmerId));
        } else {
            // If no farmerId, fetch all produce
            dataQuery = produceRef;
        }

        const snapshot = await get(dataQuery);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            const produceArray: Produce[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).reverse(); // show newest first
            return { produce: produceArray };
        }
        return { produce: [] };
    } catch (error) {
        console.error("Error fetching produce listings:", error);
        return { produce: [] };
    }
}


export async function getProduceListingById(produceId: string) {
    try {
        const produceRef = ref(db, `produce/${produceId}`);
        const snapshot = await get(produceRef);

        if (snapshot.exists()) {
            return { id: produceId, ...snapshot.val() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching produce by ID:", error);
        return null;
    }
}
