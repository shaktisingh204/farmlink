
'use server';

import { db } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import type { Order, Produce, UserProfile } from '@/lib/types';

export interface OrderWithDetails extends Omit<Order, 'produce' | 'farmer'> {
    produce: Produce | null;
    retailer: { name: string } | null;
}

export async function getFarmerOrders(farmerId: string): Promise<{ orders?: OrderWithDetails[], error?: string }> {
    if (!farmerId) {
        return { error: 'User not authenticated.' };
    }

    try {
        const ordersRef = ref(db, 'orders');
        const farmerOrdersQuery = query(ordersRef, orderByChild('farmerId'), equalTo(farmerId));

        const ordersSnapshot = await get(farmerOrdersQuery);
        
        if (!ordersSnapshot.exists()) {
            return { orders: [] };
        }

        const ordersData = ordersSnapshot.val();

        // Fetch all produce and users once to avoid multiple lookups
        const produceRef = ref(db, 'produce');
        const usersRef = ref(db, 'users');
        
        const [produceSnapshot, usersSnapshot] = await Promise.all([
            get(produceRef),
            get(usersRef),
        ]);

        const allProduce = produceSnapshot.exists() ? produceSnapshot.val() : {};
        const allUsers = usersSnapshot.exists() ? usersSnapshot.val() : {};

        const detailedOrders: OrderWithDetails[] = Object.keys(ordersData).map(key => {
            const order = ordersData[key];
            return {
                id: key,
                ...order,
                produce: allProduce[order.produceId] || null,
                retailer: allUsers[order.retailerId] ? { name: allUsers[order.retailerId].name } : null,
            };
        });

        // Sort by date, newest first
        detailedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

        return { orders: detailedOrders };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { error: "Failed to fetch orders from the database." };
    }
}
