
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Search, Receipt, Tags, Wallet, Heart, Loader2, ArrowRight, DollarSign, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRetailerDashboardStats, type RetailerStats } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function RetailerDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<RetailerStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const features = [
        { href: '/retailer-dashboard/browse-produce', label: 'Browse Produce', icon: Search },
        { href: '/retailer-dashboard/my-orders', label: 'My Orders', icon: Receipt },
        { href: '/retailer-dashboard/recommended-deals', label: 'Recommended Deals', icon: Tags },
        { href: '/retailer-dashboard/payments', label: 'Payments', icon: Wallet },
        { href: '/retailer-dashboard/favorites', label: 'Favorites', icon: Heart },
    ];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/retailer-login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setStatsLoading(true);
            try {
                const result = await getRetailerDashboardStats(user.uid);
                if (!result.error) {
                    setStats(result.stats || null);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setStatsLoading(false);
            }
        };

        if (user && !loading) {
            fetchStats();
        }
    }, [user, loading]);

    if (loading || !user || !userProfile) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    if (userProfile.role !== 'retailer') {
         router.push('/retailer-login');
         return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Retailer Dashboard"
        description={`Welcome, ${userProfile.name}! Find the freshest produce from local farmers.`}
      />
      <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-3/4" /> :
                        <>
                            <div className="text-2xl font-bold">INR {stats?.totalSpent.toFixed(2) || '0.00'}</div>
                        </>
                    }
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Favorite Items</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.favoriteItems || 0}</div>}
                </CardContent>
            </Card>
        </div>

       <Card className="bg-secondary/50 border-primary/20 border-2">
        <CardHeader>
          <CardTitle className='flex items-center gap-2'><Tags className="text-primary"/> AI Recommended Deals For You</CardTitle>
          <CardDescription>Discover personalized deals based on your recent activity and favorites. Find the best value from local farmers.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href="/retailer-dashboard/recommended-deals">
                    View Your Deals <ArrowRight />
                </Link>
            </Button>
        </CardContent>
       </Card>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.slice(0,2).map((feature) => ( // Browse and Orders
          <Card key={feature.label} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">{feature.label}</CardTitle>
                <feature.icon className="w-8 h-8 text-primary" />
            </CardHeader>
            <CardContent className="mt-auto">
              <Link href={feature.href} passHref>
                <Button variant="outline" className="w-full">
                  Go to page <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
         <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">Your Favorites</CardTitle>
                <Heart className="w-8 h-8 text-primary" />
            </CardHeader>
            <CardContent className="mt-auto">
              <Link href="/retailer-dashboard/favorites" passHref>
                <Button variant="outline" className="w-full">
                  Go to page <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
