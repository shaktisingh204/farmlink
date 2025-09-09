
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AreaChart, Users2, Activity, TruckIcon, Wallet, Bell, Loader2, ArrowRight, DollarSign, Users, ShoppingBag, List, BarChart as BarChartIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMarketOverviewStats, type OverviewStats } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  totalSales: {
    label: 'Sales',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function MarketDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const features = [
        { href: '/local-market-dashboard/market-overview', label: 'Market Overview', icon: AreaChart },
        { href: '/local-market-dashboard/farmer-participation', label: 'Farmer Participation', icon: Users2 },
        { href: '/local-market-dashboard/retailer-activity', label: 'Retailer Activity', icon: Activity },
        { href: '/local-market-dashboard/logistics-snapshot', label: 'Logistics Snapshot', icon: TruckIcon },
    ];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/market-login');
        }
    }, [user, loading, router]);

     useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                const result = await getMarketOverviewStats();
                if (!result.error) {
                    setStats(result.stats || null);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setStatsLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading || !user || !userProfile) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
  
    if (userProfile.role !== 'market') {
         router.push('/market-login');
         return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
  return (
    <div className="space-y-8">
      <PageHeader
        title="Local Market Dashboard"
        description="Welcome! Here's an overview of your market's performance."
      />
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-3/4" /> :
                        <>
                            <div className="text-2xl font-bold">INR {stats?.totalRevenue.toFixed(2) || '0.00'}</div>
                            <p className="text-xs text-muted-foreground">From {stats?.totalOrders || 0} orders</p>
                        </>
                    }
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalFarmers || 0}</div>}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Retailers</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalRetailers || 0}</div>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <List className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalListings || 0}</div>}
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>A summary of sales revenue over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    {statsLoading ? <Skeleton className="h-[200px] w-full" /> : (
                        <ResponsiveContainer width="100%" height={200}>
                            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                <BarChart accessibilityLayer data={stats?.salesData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="totalSales" fill="var(--color-totalSales)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Platform Tools</CardTitle>
                    <CardDescription>Navigate to key management areas.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {features.map((feature) => (
                      <Link href={feature.href} passHref key={feature.label}>
                        <Button variant="outline" className="w-full justify-start h-12 text-base">
                          <feature.icon className="w-5 h-5 mr-3" />
                          {feature.label}
                        </Button>
                      </Link>
                    ))}
                </CardContent>
            </Card>
      </div>
    </div>
  );
}
