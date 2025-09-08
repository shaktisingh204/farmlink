
'use server';

import { getDealRecommenderFlow } from '@/ai/flows/deal-recommender-flow';
import { db } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo, limitToLast } from 'firebase/database';
import type { Order, Produce, Farmer } from '@/lib/types';
import type { ProduceWithFarmer } from '../browse-produce/actions';

export interface RecommendedDeal {
    produce: Produce;
    farmer: { name: string, location?: string } | null;
    reason: string;
}

export async function getDealRecommendations(retailerId: string): Promise<{ deals?: RecommendedDeal[], error?: string }> {
    if (!retailerId) {
        return { error: 'User not authenticated.' };
    }

    try {
        // Fetch recent orders and favorites to provide context to the AI
        const ordersRef = ref(db, 'orders');
        const retailerOrdersQuery = query(ordersRef, orderByChild('retailerId'), equalTo(retailerId), limitToLast(5));
        const favoritesRef = ref(db, `favorites/${retailerId}`);

        const [ordersSnapshot, favoritesSnapshot] = await Promise.all([
            get(retailerOrdersQuery),
            get(favoritesRef),
        ]);

        const recentOrders: any[] = [];
        if (ordersSnapshot.exists()) {
            recentOrders.push(...Object.values(ordersSnapshot.val()));
        }
        
        const favoriteProduceIds: string[] = favoritesSnapshot.exists() ? Object.keys(favoritesSnapshot.val()) : [];

        if (recentOrders.length === 0 && favoriteProduceIds.length === 0) {
            return { deals: [] }; // Not enough data for recommendations
        }
        
        const recommendations = await getDealRecommenderFlow({ retailerId, recentOrders, favoriteProduceIds });

        // Fetch full details for the recommended produce and their farmers
        const produceRef = ref(db, 'produce');
        const usersRef = ref(db, 'users');

        const [produceSnapshot, usersSnapshot] = await Promise.all([
            get(produceRef),
            get(usersRef),
        ]);

        const allProduce = produceSnapshot.exists() ? produceSnapshot.val() : {};
        const allUsers = usersSnapshot.exists() ? usersSnapshot.val() : {};

        const detailedDeals: RecommendedDeal[] = recommendations.deals.map(deal => {
            const produceItem = allProduce[deal.produceId];
            if (!produceItem) return null;
            
            const farmerInfo = allUsers[produceItem.farmerId] || null;
            return {
                produce: { id: deal.produceId, ...produceItem },
                farmer: farmerInfo ? { name: farmerInfo.name, location: farmerInfo.location } : null,
                reason: deal.reason,
            }
        }).filter((deal): deal is RecommendedDeal => deal !== null);


        return { deals: detailedDeals };

    } catch (error: any) {
        console.error("Error fetching deal recommendations:", error);
        return { error: error.message || "Failed to fetch recommendations from the AI service." };
    }
}
