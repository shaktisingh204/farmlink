
'use server';

import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import type { ProduceWithFarmer } from '../browse-produce/actions';

export async function getFavoriteProduce(retailerId: string): Promise<{ produce?: ProduceWithFarmer[], error?: string; }> {
    if (!retailerId) {
        return { error: 'User not authenticated.' };
    }

    try {
        const favoritesRef = ref(db, `favorites/${retailerId}`);
        const favoritesSnapshot = await get(favoritesRef);

        if (!favoritesSnapshot.exists()) {
            return { produce: [] };
        }
        
        const favoriteProduceIds = Object.keys(favoritesSnapshot.val());

        const produceRef = ref(db, 'produce');
        const usersRef = ref(db, 'users');

        const [produceSnapshot, usersSnapshot] = await Promise.all([
            get(produceRef),
            get(usersRef),
        ]);

        const allProduce = produceSnapshot.exists() ? produceSnapshot.val() : {};
        const allUsers = usersSnapshot.exists() ? usersSnapshot.val() : {};

        const favoriteProduceList: ProduceWithFarmer[] = favoriteProduceIds.map(produceId => {
            const produceItem = allProduce[produceId];
            if (!produceItem) return null;

            const farmer = allUsers[produceItem.farmerId] || null;
            return {
                id: produceId,
                ...produceItem,
                farmer: farmer,
                isFavorited: true,
            };
        }).filter((item): item is ProduceWithFarmer => item !== null);

        return { produce: favoriteProduceList };

    } catch (error) {
        console.error("Error fetching favorites:", error);
        return { error: "Failed to fetch favorite produce from the database." };
    }
}
