
'use server';

import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import type { UserProfile } from '@/lib/types';

export async function getAllUsers(): Promise<{ users?: UserProfile[], error?: string }> {
    try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersList: UserProfile[] = Object.keys(usersData).map(uid => ({
                uid,
                ...usersData[uid],
            }));
            return { users: usersList };
        }
        
        return { users: [] };
    } catch (error) {
        console.error("Error fetching all users:", error);
        return { error: "Failed to fetch users from the database." };
    }
}
