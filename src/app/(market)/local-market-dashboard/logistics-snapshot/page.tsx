
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { getAllOrders, type FullOrderDetails } from '../actions';
import { Loader2, TruckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Page() {
    const [orders, setOrders] = useState<FullOrderDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getAllOrders();
                if (result.error) {
                    setError(result.error);
                } else {
                    setOrders(result.orders || []);
                }
            } catch (err) {
                setError("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Logistics Snapshot"
        description="A real-time overview of all orders and deliveries."
      />
      <Card>
        <CardHeader>
          <CardTitle>All System Orders</CardTitle>
          <CardDescription>This is a log of all orders placed across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : orders.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Retailer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.produceName}</TableCell>
                      <TableCell>{order.farmerName}</TableCell>
                      <TableCell>{order.retailerName}</TableCell>
                      <TableCell>{format(new Date(order.orderDate), "PPP")}</TableCell>
                      <TableCell><Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                      <TableCell className="text-right">INR {order.totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="col-span-full text-center py-12 flex flex-col items-center">
              <TruckIcon className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No orders have been placed yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
