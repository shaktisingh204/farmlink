
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { getRetailerActivity, type RetailerActivityInfo } from '../actions';
import { Loader2, Activity } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Page() {
  const [retailers, setRetailers] = useState<RetailerActivityInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetailers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getRetailerActivity();
        if (result.error) {
          setError(result.error);
        } else {
          setRetailers(result.retailers || []);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRetailers();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Retailer Activity"
        description="View all registered retailers and their order activity."
      />
      <Card>
        <CardHeader>
          <CardTitle>Registered Retailers</CardTitle>
          <CardDescription>A list of all retailers on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : retailers.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Retailer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Total Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retailers.map(retailer => (
                    <TableRow key={retailer.uid}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{retailer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <span className="font-semibold">{retailer.name}</span>
                            <span className="text-xs text-muted-foreground">{retailer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{retailer.location || 'N/A'}</TableCell>
                      <TableCell className="text-right">{retailer.orderCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="col-span-full text-center py-12 flex flex-col items-center">
              <Activity className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No retailers have registered yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
