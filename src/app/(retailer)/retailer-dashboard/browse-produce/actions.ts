
'use server';

import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import type { Produce } from '@/lib/types';

interface FarmerInfo {
    name: string;
    email: string;
    role: string;
    location?: string; // Assuming location might be added later
}

export interface ProduceWithFarmer extends Produce {
    farmer: FarmerInfo | null;
}

export async function getBrowseableProduce(): Promise<{ produce?: ProduceWithFarmer[], error?: string; }> {
    try {
        const produceRef = ref(db, 'produce');
        const usersRef = ref(db, 'users');

        const [produceSnapshot, usersSnapshot] = await Promise.all([
            get(produceRef),
            get(usersRef),
        ]);
        
        const allUsers = usersSnapshot.exists() ? usersSnapshot.val() : {};

        if (produceSnapshot.exists()) {
            const produceData = produceSnapshot.val();
            const produceList: ProduceWithFarmer[] = Object.keys(produceData).map(key => {
                const produceItem = produceData[key];
                const farmer = allUsers[produceItem.farmerId] || null;
                return {
                    id: key,
                    ...produceItem,
                    farmer: farmer,
                }
            });
            return { produce: produceList.reverse() }; // Show newest first
        }
        return { produce: [] };
    } catch (error) {
        console.error("Error fetching produce listings:", error);
        return { error: "Failed to fetch produce from the database." };
    }
}
