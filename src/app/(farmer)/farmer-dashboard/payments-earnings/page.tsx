
'use client';

import { PageHeader } from '@/components/page-header';
import { getFarmerOrders, type OrderWithDetails } from '../orders-received/actions';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, ShoppingBag, BarChart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PaymentsEarningsPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setIsLoading(false);
            setError("You must be logged in to view your earnings.");
            return;
        }

        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getFarmerOrders(user.uid);
                if (result.error) {
                    setError(result.error);
                } else {
                    setOrders(result.orders || []);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching orders.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user, authLoading]);

    const { totalRevenue, totalOrders, averageOrderValue } = useMemo(() => {
        if (!orders || orders.length === 0) {
            return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
        }
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalRevenue / totalOrders;
        return { totalRevenue, totalOrders, averageOrderValue };
    }, [orders]);


  return (
    <div className="space-y-8">
        <PageHeader title="Payments & Earnings" description="Review your transaction history and earnings." />

        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">INR {totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">From {totalOrders} orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">INR {averageOrderValue.toFixed(2)}</div>
                </CardContent>
            </Card>
        </div>


        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>A record of all your completed orders.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error || orders.length === 0 ? (
                    <div className="col-span-full text-center py-12 flex flex-col items-center">
                        <DollarSign className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">You have no payment history yet.</p>
                    </div>
                ) : (
                   <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell className="font-medium">{order.produce?.name || 'N/A'}</TableCell>
                                    <TableCell>{format(new Date(order.orderDate), "PPP")}</TableCell>
                                    <TableCell><Badge>{order.status}</Badge></TableCell>
                                    <TableCell className="text-right">INR {order.totalPrice.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                   </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
