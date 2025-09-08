'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Produce } from '@/lib/types';
import Image from 'next/image';
import { ImageIcon, PlusCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/use-language';

interface MyProduceListingsContentProps {
  produceList: Produce[];
  error: string | null;
  isFarmer: boolean;
}

export function MyProduceListingsContent({ produceList, error, isFarmer }: MyProduceListingsContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title={t('farmerDashboard_myProduceListings')}
          description="Manage your produce listings."
        />
        {isFarmer && (
            <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/farmer-dashboard/my-produce-listings/add">
                <PlusCircle className="mr-2" />
                Add New Listing
                </Link>
            </Button>
            </div>
        )}
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Listings</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
                  <p className="font-semibold text-lg text-primary mb-2">INR {item.price}/kg</p>
                  <p className="text-sm text-muted-foreground mb-1">{item.quantity} kg available</p>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
                {isFarmer && (
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                        <Link href={`/farmer-dashboard/my-produce-listings/edit/${item.id}`}>Edit Listing</Link>
                        </Button>
                    </CardFooter>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">You haven&apos;t listed any produce yet.</p>
              {isFarmer && (
                 <Button asChild className="mt-4">
                    <Link href="/farmer-dashboard/my-produce-listings/add">
                    <PlusCircle className="mr-2" />
                    Add Your First Listing
                    </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
