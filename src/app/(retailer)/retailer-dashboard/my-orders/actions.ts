
'use server';

import { db } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import type { Order, Produce, Farmer } from '@/lib/types';

export interface OrderWithDetails extends Order {
    produce: Produce | null;
    farmer: { name: string } | null;
}

export async function getMyOrders(retailerId: string): Promise<{ orders?: OrderWithDetails[], error?: string }> {
    if (!retailerId) {
        return { error: 'User not authenticated.' };
    }

    try {
        const ordersRef = ref(db, 'orders');
        const retailerOrdersQuery = query(ordersRef, orderByChild('retailerId'), equalTo(retailerId));

        const ordersSnapshot = await get(retailerOrdersQuery);
        
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
                farmer: allUsers[order.farmerId] ? { name: allUsers[order.farmerId].name } : null,
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
