
'use server';

import { db } from '@/lib/firebase';
import { ref, get, set, push, serverTimestamp, remove } from 'firebase/database';
import type { Produce } from '@/lib/types';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

// This is a temporary solution to get the user on the server.
async function getCurrentUserId() {
    // In a real app, you would get this from a session or verified token.
    // For now, this will not work reliably on the server.
    // We will pass the UID from the client.
    return null;
}

interface FarmerInfo {
    name: string;
    email: string;
    role: string;
    location?: string;
}

export interface ProduceWithFarmer extends Produce {
    farmer: FarmerInfo | null;
    isFavorited?: boolean;
}

export async function getBrowseableProduce(): Promise<{ produce?: ProduceWithFarmer[], error?: string; }> {
    try {
        const produceRef = ref(db, 'produce');
        const usersRef = ref(db, 'users');
        // This is a placeholder, a real implementation would get the current user ID securely.
        const currentUserId = await getCurrentUserId();
        const favoritesRef = currentUserId ? ref(db, `favorites/${currentUserId}`) : null;

        const [produceSnapshot, usersSnapshot, favoritesSnapshot] = await Promise.all([
            get(produceRef),
            get(usersRef),
            favoritesRef ? get(favoritesRef) : Promise.resolve(null),
        ]);
        
        const allUsers = usersSnapshot.exists() ? usersSnapshot.val() : {};
        const favoriteProduceIds = favoritesSnapshot?.exists() ? Object.keys(favoritesSnapshot.val()) : [];

        if (produceSnapshot.exists()) {
            const produceData = produceSnapshot.val();
            const produceList: ProduceWithFarmer[] = Object.keys(produceData).map(key => {
                const produceItem = produceData[key];
                const farmer = allUsers[produceItem.farmerId] || null;
                return {
                    id: key,
                    ...produceItem,
                    farmer: farmer,
                    isFavorited: favoriteProduceIds.includes(key),
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

interface CreateOrderParams {
    retailerId: string;
    produceId: string;
    farmerId: string;
    quantity: number;
    totalPrice: number;
}
export async function createOrder(params: CreateOrderParams) {
    const { retailerId, produceId, farmerId, quantity, totalPrice } = params;
    try {
        const ordersRef = ref(db, 'orders');
        const newOrderRef = push(ordersRef);
        await set(newOrderRef, {
            retailerId,
            produceId,
            farmerId,
            quantity,
            totalPrice,
            status: 'placed',
            orderDate: serverTimestamp(),
        });
    } catch (e) {
        console.error("Failed to create order", e);
        throw new Error("Could not create order in the database.");
    }
}

export async function toggleFavorite(retailerId: string, produceId: string) {
    const favoriteRef = ref(db, `favorites/${retailerId}/${produceId}`);
    try {
        const snapshot = await get(favoriteRef);
        if (snapshot.exists()) {
            await remove(favoriteRef);
        } else {
            await set(favoriteRef, true);
        }
    } catch (e) {
        console.error("Failed to toggle favorite", e);
        throw new Error("Could not update favorite status.");
    }
}
