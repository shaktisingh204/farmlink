
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { getAllOrders, type FullOrderDetails } from '../actions';
import { Loader2, Wallet } from 'lucide-react';
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

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Revenue & Payments"
        description="Track all revenue and transactions across the platform."
      />
       <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Platform Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">INR {totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From {orders.length} total orders</p>
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Log</CardTitle>
          <CardDescription>A log of all payments for orders.</CardDescription>
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
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Retailer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{format(new Date(order.orderDate), "PPP")}</TableCell>
                      <TableCell>{order.farmerName}</TableCell>
                      <TableCell>{order.retailerName}</TableCell>
                      <TableCell className="text-right">INR {order.totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="col-span-full text-center py-12 flex flex-col items-center">
              <Wallet className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No transactions have occurred yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
