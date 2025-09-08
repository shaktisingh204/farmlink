
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { getFarmerParticipation, type FarmerParticipationInfo } from '../actions';
import { Loader2, Users2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Page() {
  const [farmers, setFarmers] = useState<FarmerParticipationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getFarmerParticipation();
        if (result.error) {
          setError(result.error);
        } else {
          setFarmers(result.farmers || []);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Farmer Participation"
        description="View all registered farmers and their listing activity."
      />
      <Card>
        <CardHeader>
          <CardTitle>Registered Farmers</CardTitle>
          <CardDescription>A list of all farmers on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : farmers.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Produce Listings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmers.map(farmer => (
                    <TableRow key={farmer.uid}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <span className="font-semibold">{farmer.name}</span>
                            <span className="text-xs text-muted-foreground">{farmer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{farmer.location || 'N/A'}</TableCell>
                      <TableCell className="text-right">{farmer.listingCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="col-span-full text-center py-12 flex flex-col items-center">
              <Users2 className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No farmers have registered yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
