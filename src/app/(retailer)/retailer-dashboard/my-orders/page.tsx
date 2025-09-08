
'use client';

import { PageHeader } from '@/components/page-header';
import { getMyOrders, type OrderWithDetails } from './actions';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, ShoppingBag } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setIsLoading(false);
            setError("You must be logged in to view your orders.");
            return;
        }

        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getMyOrders(user.uid);
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

  return (
    <div className="space-y-8">
        <PageHeader title="My Orders" description="View your order history." />

        <Card>
            <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>A list of all the produce you have ordered.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error || orders.length === 0 ? (
                    <div className="col-span-full text-center py-12 flex flex-col items-center">
                        <ShoppingBag className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
                    </div>
                ) : (
                   <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Farmer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.produce?.name || 'Unknown Produce'}</TableCell>
                                    <TableCell>{order.farmer?.name || 'Unknown Farmer'}</TableCell>
                                    <TableCell>{format(new Date(order.orderDate), "PPP")}</TableCell>
                                    <TableCell><Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
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
