
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { List, Tags, Receipt, Wallet, Bell, Database, Microscope, Bot, ArrowRight, Loader2, DollarSign, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { getFarmerDashboardStats, type FarmerStats } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function FarmerDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();
    const [stats, setStats] = useState<FarmerStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const features = [
        { href: '/farmer-dashboard/my-produce-listings', label: "myProduceListings", icon: List },
        { href: '/farmer-dashboard/ai-price-advisor', label: "aiPriceAdvisor", icon: Microscope },
        { href: '/farmer-dashboard/market-price-suggestions', label: "marketPriceSuggestions", icon: Tags },
        { href: '/farmer-dashboard/agri-assist', label: "agriAssistant", icon: Bot },
        { href: '/farmer-dashboard/market-prices', label: "dailyMarketPrices", icon: Database },
        { href: '/farmer-dashboard/payments-earnings', label: "paymentsEarnings", icon: Wallet },
    ];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/farmer-login');
        }
    }, [user, loading, router]);
    
     useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setStatsLoading(true);
            try {
                const result = await getFarmerDashboardStats(user.uid);
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

    if (userProfile.role !== 'farmer') {
         router.push('/farmer-login');
         return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('farmerDashboard')}
        description={t('farmerDashboardDesc')}
      />
       <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-3/4" /> :
                        <>
                            <div className="text-2xl font-bold">INR {stats?.totalRevenue.toFixed(2) || '0.00'}</div>
                        </>
                    }
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders Received</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <List className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.activeListings || 0}</div>}
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>A list of your most recent orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? <Skeleton className="h-[200px] w-full" /> : (
                            stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Retailer</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats.recentOrders.map((order: any) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.produceName}</TableCell>
                                                <TableCell>{order.retailerName}</TableCell>
                                                <TableCell><Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                                                <TableCell className="text-right">INR {order.totalPrice.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <Package className="mx-auto h-12 w-12" />
                                    <h3 className="mt-4 text-lg font-semibold">No Recent Orders</h3>
                                    <p className="mt-2 text-sm">You have not received any orders recently.</p>
                                </div>
                            )
                        )}
                    </CardContent>
                    <CardFooter>
                         <Button variant="outline" asChild><Link href="/farmer-dashboard/orders-received">View All Orders <ArrowRight/></Link></Button>
                    </CardFooter>
                </Card>
            </div>
             <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Links</CardTitle>
                        <CardDescription>Quickly navigate to key features.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-2">
                         {features.map((feature) => (
                            <Link href={feature.href} passHref key={feature.label}>
                                <Button variant="ghost" className="w-full justify-start h-11 text-base">
                                <feature.icon className="w-5 h-5 mr-3 text-primary" />
                                {t(feature.label)}
                                </Button>
                            </Link>
                            ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
