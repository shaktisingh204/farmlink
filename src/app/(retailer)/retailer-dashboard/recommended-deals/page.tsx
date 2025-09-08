
'use client';

import { PageHeader } from '@/components/page-header';
import { getDealRecommendations, type RecommendedDeal } from './actions';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, User, ImageIcon, ShoppingCart, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RecommendedDealsPage() {
  const { user, loading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendedDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
        setIsLoading(false);
        setError("You must be logged in to get recommendations.");
        return;
    }

    const fetchRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getDealRecommendations(user.uid);
             if(result.error) {
                setError(result.error);
            } else {
                setRecommendations(result.deals || []);
            }
        } catch(err: any) {
            setError(err.message || "An unexpected error occurred while fetching recommendations.");
        } finally {
            setIsLoading(false);
        }
    }

    fetchRecommendations();
  }, [user, authLoading]);


  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Recommended Deals"
        description="Personalized deals and recommendations based on your activity, powered by AI."
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          <div className="space-y-8">
            {recommendations.length > 0 ? (
                recommendations.map((deal, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="w-6 h-6 text-accent" /> AI Deal Spotlight</CardTitle>
                            <Alert className="mt-2">
                                <Tags className="h-4 w-4" />
                                <AlertTitle className="font-semibold">Why you're seeing this:</AlertTitle>
                                <AlertDescription>{deal.reason}</AlertDescription>
                            </Alert>
                        </CardHeader>
                        <CardContent>
                             <Card className="flex flex-col md:flex-row items-start gap-6 p-4">
                                <div className="w-full md:w-1/3">
                                    {deal.produce.imageUrl ? (
                                        <Image
                                        src={deal.produce.imageUrl}
                                        alt={deal.produce.name}
                                        width={400}
                                        height={300}
                                        className="rounded-lg object-cover aspect-[4/3]"
                                        data-ai-hint="fresh produce"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center bg-secondary rounded-lg aspect-[4/3]">
                                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="font-headline text-2xl mb-2">{deal.produce.name}</CardTitle>
                                    <p className="font-semibold text-xl text-primary mb-2">INR {deal.produce.price}/kg</p>
                                    <p className="text-sm text-muted-foreground mb-1">{deal.produce.quantity} kg available</p>
                                    <CardDescription className="mb-4">{deal.produce.description}</CardDescription>
                                    
                                    <div className="flex items-center gap-2 pt-4 border-t">
                                        <Avatar className="h-8 w-8">
                                        <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{deal.farmer?.name || 'Unknown Farmer'}</p>
                                            <p className="text-xs text-muted-foreground">{deal.farmer?.location || 'Unknown Location'}</p>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4" asChild>
                                        <Link href="/retailer-dashboard/browse-produce">
                                            <ShoppingCart className="mr-2"/> View Product
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        </CardContent>
                    </Card>
                ))
            ) : (
             <div className="col-span-full text-center py-12 flex flex-col items-center">
                <Tags className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No recommendations available right now. Place some orders to get started!</p>
             </div>
            )}
          </div>
        )}
    </div>
  );
}
