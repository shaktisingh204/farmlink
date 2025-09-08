
'use client';

import { PageHeader } from '@/components/page-header';
import { getFavoriteProduce, type ProduceWithFarmer } from './actions';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Heart, User, ImageIcon, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<ProduceWithFarmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
        setIsLoading(false);
        setError("You must be logged in to view your favorites.");
        return;
    }

    const fetchFavorites = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getFavoriteProduce(user.uid);
            if(result.error) {
                setError(result.error);
            } else {
                setFavorites(result.produce || []);
            }
        } catch(err) {
            setError("An unexpected error occurred while fetching favorites.");
        } finally {
            setIsLoading(false);
        }
    }

    fetchFavorites();
  }, [user, authLoading]);


  return (
    <div className="space-y-8">
      <PageHeader title="Favorites" description="View your favorite items." />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.length > 0 ? (
              favorites.map((item) => (
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
                    <CardDescription className="mb-4">{item.description}</CardDescription>
                    
                    <div className="flex items-center gap-2 pt-4 border-t">
                        <Avatar className="h-8 w-8">
                           <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold">{item.farmer?.name || 'Unknown Farmer'}</p>
                            <p className="text-xs text-muted-foreground">{item.farmer?.location || 'Unknown Location'}</p>
                        </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                      <Button className="w-full" asChild>
                         <Link href="/retailer-dashboard/browse-produce">
                           <ShoppingCart className="mr-2"/> View Product
                         </Link>
                      </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
             <div className="col-span-full text-center py-12 flex flex-col items-center">
                <Heart className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">You haven&apos;t favorited any items yet.</p>
                <Button asChild className="mt-4">
                    <Link href="/retailer-dashboard/browse-produce">
                        Browse Produce
                    </Link>
                </Button>
             </div>
            )}
          </div>
        )}
    </div>
  );
}
