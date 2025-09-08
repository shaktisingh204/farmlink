'use server';

import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { UserProfile } from '@/lib/types';

export async function getUserProfile(userId: string): Promise<{ profile?: UserProfile; error?: string }> {
    if (!userId) {
        return { error: 'User not authenticated.' };
    }

    try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            return { profile: { uid: userId, ...snapshot.val() } };
        } else {
            return { error: 'User profile not found.' };
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return { error: 'Failed to fetch user profile.' };
    }
}

const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  location: z.string().optional(),
});

export type UpdateProfileState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
};

export async function updateProfileAction(
  userId: string,
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  if (!userId) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const validatedFields = UpdateProfileSchema.safeParse({
    name: formData.get('name'),
    location: formData.get('location'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid data provided.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, validatedFields.data);
    revalidatePath('/*/*-dashboard/profile', 'page');
    return { success: true };
  } catch (e: any) {
    console.error("Failed to update profile", e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
