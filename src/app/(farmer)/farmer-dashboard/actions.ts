
'use server';

import { db } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo, limitToLast } from 'firebase/database';

export interface FarmerStats {
    activeListings: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
}

export async function getFarmerDashboardStats(farmerId: string): Promise<{ stats?: FarmerStats, error?: string }> {
    if (!farmerId) {
        return { error: 'User not authenticated.' };
    }

    try {
        const produceRef = ref(db, 'produce');
        const ordersRef = ref(db, 'orders');

        const produceQuery = query(produceRef, orderByChild('farmerId'), equalTo(farmerId));
        const ordersQuery = query(ordersRef, orderByChild('farmerId'), equalTo(farmerId));
        const recentOrdersQuery = query(ordersRef, orderByChild('farmerId'), equalTo(farmerId), limitToLast(5));

        const [produceSnapshot, ordersSnapshot, recentOrdersSnapshot] = await Promise.all([
            get(produceQuery),
            get(ordersQuery),
            get(recentOrdersQuery),
        ]);

        const activeListings = produceSnapshot.exists() ? Object.keys(produceSnapshot.val()).length : 0;
        
        let totalOrders = 0;
        let totalRevenue = 0;
        if (ordersSnapshot.exists()) {
            const orders = ordersSnapshot.val();
            totalOrders = Object.keys(orders).length;
            Object.values(orders).forEach((order: any) => {
                totalRevenue += order.totalPrice;
            });
        }
        
        const recentOrdersList: any[] = [];
        if (recentOrdersSnapshot.exists()) {
            const produceData = produceSnapshot.exists() ? produceSnapshot.val() : {};
            const allProduceIds = Object.keys(produceData);
            
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);
            const allUsers = usersSnapshot.exists() ? usersSnapshot.val() : {};

            const recentOrdersData = recentOrdersSnapshot.val();
            for (const orderId in recentOrdersData) {
                const order = recentOrdersData[orderId];
                const produceId = order.produceId;
                
                // Fetch produce details if not already fetched
                let produceDetails = produceData[produceId];
                if (!produceDetails) {
                    const singleProduceRef = ref(db, `produce/${produceId}`);
                    const singleProduceSnap = await get(singleProduceRef);
                    if(singleProduceSnap.exists()) {
                        produceDetails = singleProduceSnap.val();
                    }
                }
                
                recentOrdersList.push({
                    id: orderId,
                    ...order,
                    produceName: produceDetails?.name || 'N/A',
                    retailerName: allUsers[order.retailerId]?.name || 'Unknown Retailer',
                });
            }
        }
        
        return {
            stats: {
                activeListings,
                totalOrders,
                totalRevenue,
                recentOrders: recentOrdersList.reverse(),
            }
        };

    } catch (error) {
        console.error("Error fetching farmer dashboard stats:", error);
        return { error: "Failed to fetch dashboard statistics." };
    }
}
