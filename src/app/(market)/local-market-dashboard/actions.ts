
'use server';

import { db } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import type { Order, Produce, UserProfile } from '@/lib/types';
import { format, subDays, startOfDay } from 'date-fns';

export interface OverviewStats {
    totalFarmers: number;
    totalRetailers: number;
    totalListings: number;
    totalOrders: number;
    totalRevenue: number;
    salesData: { date: string; totalSales: number }[];
}

export async function getMarketOverviewStats(): Promise<{ stats?: OverviewStats, error?: string }> {
    try {
        const usersRef = ref(db, 'users');
        const produceRef = ref(db, 'produce');
        const ordersRef = ref(db, 'orders');

        const [usersSnapshot, produceSnapshot, ordersSnapshot] = await Promise.all([
            get(usersRef),
            get(produceRef),
            get(ordersRef),
        ]);

        let totalFarmers = 0;
        let totalRetailers = 0;
        if (usersSnapshot.exists()) {
            const users = usersSnapshot.val();
            Object.values(users).forEach((user: any) => {
                if (user.role === 'farmer') totalFarmers++;
                if (user.role === 'retailer') totalRetailers++;
            });
        }

        const totalListings = produceSnapshot.exists() ? Object.keys(produceSnapshot.val()).length : 0;
        
        let totalOrders = 0;
        let totalRevenue = 0;
        const salesByDay: { [key: string]: number } = {};

        if (ordersSnapshot.exists()) {
            const orders = ordersSnapshot.val();
            totalOrders = Object.keys(orders).length;
            Object.values(orders).forEach((order: any) => {
                totalRevenue += order.totalPrice;
                // For sales chart
                 const orderDate = startOfDay(new Date(order.orderDate));
                 const dateString = format(orderDate, 'MMM d');
                 if (salesByDay[dateString]) {
                    salesByDay[dateString] += order.totalPrice;
                 } else {
                    salesByDay[dateString] = order.totalPrice;
                 }
            });
        }
        
        const salesData = Object.entries(salesByDay).map(([date, totalSales]) => ({ date, totalSales })).slice(-30); // Last 30 days

        return { 
            stats: { 
                totalFarmers, 
                totalRetailers, 
                totalListings, 
                totalOrders, 
                totalRevenue,
                salesData,
            } 
        };

    } catch (error) {
        console.error("Error fetching market overview stats:", error);
        return { error: "Failed to fetch overview statistics." };
    }
}


export interface FarmerParticipationInfo extends UserProfile {
    listingCount: number;
}

export async function getFarmerParticipation(): Promise<{ farmers?: FarmerParticipationInfo[], error?: string }> {
    try {
        const usersRef = ref(db, 'users');
        const produceRef = ref(db, 'produce');

        const [usersSnapshot, produceSnapshot] = await Promise.all([
            get(query(usersRef, orderByChild('role'), equalTo('farmer'))),
            get(produceRef),
        ]);

        if (!usersSnapshot.exists()) return { farmers: [] };

        const users = usersSnapshot.val();
        const produce = produceSnapshot.exists() ? produceSnapshot.val() : {};

        const produceCountByFarmer: { [key: string]: number } = {};
        Object.values(produce).forEach((p: any) => {
            produceCountByFarmer[p.farmerId] = (produceCountByFarmer[p.farmerId] || 0) + 1;
        });

        const farmers = Object.keys(users).map(uid => ({
            uid,
            ...users[uid],
            listingCount: produceCountByFarmer[uid] || 0,
        }));

        return { farmers };

    } catch (error) {
        console.error("Error fetching farmer participation:", error);
        return { error: "Failed to fetch farmer data." };
    }
}


export interface RetailerActivityInfo extends UserProfile {
    orderCount: number;
}

export async function getRetailerActivity(): Promise<{ retailers?: RetailerActivityInfo[], error?: string }> {
    try {
        const usersRef = ref(db, 'users');
        const ordersRef = ref(db, 'orders');

        const [usersSnapshot, ordersSnapshot] = await Promise.all([
            get(query(usersRef, orderByChild('role'), equalTo('retailer'))),
            get(ordersRef),
        ]);

        if (!usersSnapshot.exists()) return { retailers: [] };

        const users = usersSnapshot.val();
        const orders = ordersSnapshot.exists() ? ordersSnapshot.val() : {};

        const orderCountByRetailer: { [key: string]: number } = {};
        Object.values(orders).forEach((o: any) => {
            orderCountByRetailer[o.retailerId] = (orderCountByRetailer[o.retailerId] || 0) + 1;
        });

        const retailers = Object.keys(users).map(uid => ({
            uid,
            ...users[uid],
            orderCount: orderCountByRetailer[uid] || 0,
        }));

        return { retailers };

    } catch (error) {
        console.error("Error fetching retailer activity:", error);
        return { error: "Failed to fetch retailer data." };
    }
}

export interface FullOrderDetails extends Order {
    id: string;
    produceName: string;
    farmerName: string;
    retailerName: string;
}

export async function getAllOrders(): Promise<{ orders?: FullOrderDetails[], error?: string }> {
    try {
        const ordersRef = ref(db, 'orders');
        const usersRef = ref(db, 'users');
        const produceRef = ref(db, 'produce');

        const [ordersSnapshot, usersSnapshot, produceSnapshot] = await Promise.all([
            get(ordersRef),
            get(usersRef),
            get(produceRef),
        ]);

        if (!ordersSnapshot.exists()) return { orders: [] };

        const orders = ordersSnapshot.val();
        const users = usersSnapshot.exists() ? usersSnapshot.val() : {};
        const produce = produceSnapshot.exists() ? produceSnapshot.val() : {};

        const allOrders = Object.keys(orders).map(id => {
            const order = orders[id];
            return {
                id,
                ...order,
                produceName: produce[order.produceId]?.name || 'N/A',
                farmerName: users[order.farmerId]?.name || 'N/A',
                retailerName: users[order.retailerId]?.name || 'N/A',
            }
        }).sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

        return { orders: allOrders };

    } catch (error) {
        console.error("Error fetching all orders:", error);
        return { error: "Failed to fetch order data." };
    }
}
