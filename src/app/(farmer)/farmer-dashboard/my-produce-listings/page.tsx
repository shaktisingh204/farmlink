
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Produce } from '@/lib/types';
import Image from 'next/image';
import { ImageIcon, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getProduceListings } from './actions';

export default function MyProduceListingsPage() {
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduce = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const listings = await getProduceListings();
        setProduceList(listings.reverse()); // Show newest first
      } catch (err) {
        setError('Failed to fetch produce listings.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduce();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Produce Listings"
          description="Manage your produce listings."
        />
        <Button asChild>
            <Link href="/farmer-dashboard/my-produce-listings/add">
                <PlusCircle className="mr-2"/>
                Add New Listing
            </Link>
        </Button>
      </div>

       {isLoading ? (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produceList.length > 0 ? (
              produceList.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="p-0">
                    {item.imageUrl ? (
                        <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={400}
                        height={300}
                        className="rounded-t-lg object-cover aspect-[4/3]"
                        data-ai-hint="fresh produce"
                        />
                    ) : (
                        <div className="flex items-center justify-center bg-secondary rounded-t-lg aspect-[4/3]">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <CardTitle className="font-headline text-xl mb-2">{item.name}</CardTitle>
                    <p className="font-semibold text-lg text-primary mb-2">${item.price}/kg</p>
                    <p className="text-sm text-muted-foreground mb-1">{item.quantity} kg available</p>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                      <Button variant="outline" className="w-full">Edit Listing</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">You haven&apos;t listed any produce yet.</p>
                <Button asChild className="mt-4">
                    <Link href="/farmer-dashboard/my-produce-listings/add">
                        <PlusCircle className="mr-2"/>
                        Add Your First Listing
                    </Link>
                </Button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
