
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { ProduceWithFarmer } from './actions';
import Image from 'next/image';
import { ImageIcon, ShoppingCart, Loader2, User, Heart } from 'lucide-react';
import { getBrowseableProduce, createOrder, toggleFavorite } from './actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function BrowseProducePage() {
  const [produceList, setProduceList] = useState<ProduceWithFarmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduce();
  }, []);

  const fetchProduce = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { produce, error } = await getBrowseableProduce();
        if (error) {
          setError(error);
        } else {
          setProduceList(produce || []);
        }
      } catch (err) {
        setError('Failed to fetch produce listings.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

  const handleAddToCart = async (produceItem: ProduceWithFarmer) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to place an order.' });
        return;
    }
    try {
        await createOrder({
            retailerId: user.uid,
            produceId: produceItem.id,
            farmerId: produceItem.farmerId!,
            quantity: 1, // Placeholder quantity
            totalPrice: produceItem.price,
        });
        toast({
            title: 'Order Placed!',
            description: `An order for ${produceItem.name} has been placed.`,
        });
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to place order.' });
    }
  };

  const handleToggleFavorite = async (produceId: string, isFavorited: boolean) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to manage favorites.' });
        return;
    }
     try {
        await toggleFavorite(user.uid, produceId);
        toast({
            title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
        });
        // Refetch to update favorite status
        fetchProduce();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update favorites.' });
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Browse All Produce"
        description="Discover the freshest produce from our network of local farmers."
      />

       {isLoading ? (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produceList.length > 0 ? (
              produceList.map((item) => (
                <Card key={item.id} className="flex flex-col relative">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 z-10 rounded-full h-8 w-8 bg-black/30 hover:bg-black/50 text-white hover:text-white"
                    onClick={() => handleToggleFavorite(item.id, !!item.isFavorited)}
                   >
                    <Heart className={cn("h-4 w-4", item.isFavorited ? 'fill-red-500 text-red-500' : 'text-white')} />
                  </Button>
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
                      <Button className="w-full" onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="mr-2"/>
                        Add to Cart
                      </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No produce is currently listed by any farmer.</p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
