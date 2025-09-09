
'use server';

import { db } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

export interface RetailerStats {
    totalOrders: number;
    totalSpent: number;
    favoriteItems: number;
}

export async function getRetailerDashboardStats(retailerId: string): Promise<{ stats?: RetailerStats, error?: string }> {
    if (!retailerId) {
        return { error: 'User not authenticated.' };
    }

    try {
        const ordersRef = ref(db, 'orders');
        const favoritesRef = ref(db, `favorites/${retailerId}`);

        const ordersQuery = query(ordersRef, orderByChild('retailerId'), equalTo(retailerId));
        
        const [ordersSnapshot, favoritesSnapshot] = await Promise.all([
            get(ordersQuery),
            get(favoritesRef),
        ]);

        let totalOrders = 0;
        let totalSpent = 0;
        if (ordersSnapshot.exists()) {
            const orders = ordersSnapshot.val();
            totalOrders = Object.keys(orders).length;
            Object.values(orders).forEach((order: any) => {
                totalSpent += order.totalPrice;
            });
        }
        
        const favoriteItems = favoritesSnapshot.exists() ? Object.keys(favoritesSnapshot.val()).length : 0;
        
        return {
            stats: {
                totalOrders,
                totalSpent,
                favoriteItems,
            }
        };

    } catch (error) {
        console.error("Error fetching retailer dashboard stats:", error);
        return { error: "Failed to fetch dashboard statistics." };
    }
}
