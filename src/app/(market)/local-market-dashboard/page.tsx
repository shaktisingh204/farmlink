
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AreaChart, Users2, Activity, TruckIcon, Wallet, Bell, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const features = [
    { href: '/local-market-dashboard/market-overview', label: 'Market Overview', icon: AreaChart },
    { href: '/local-market-dashboard/farmer-participation', label: 'Farmer Participation', icon: Users2 },
    { href: '/local-market-dashboard/retailer-activity', label: 'Retailer Activity', icon: Activity },
    { href: '/local-market-dashboard/logistics-snapshot', label: 'Logistics Snapshot', icon: TruckIcon },
    { href: '/local-market-dashboard/revenue-payments', label: 'Revenue & Payments', icon: Wallet },
    { href: '/local-market-dashboard/alerts', label: 'Alerts', icon: Bell },
];

export default function MarketDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/market-login');
        }
    }, [user, loading, router]);

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
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.label} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <feature.icon className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="font-headline">{feature.label}</CardTitle>
              </div>
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
      </div>
    </div>
  );
}
