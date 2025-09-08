
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { List, Tags, Receipt, Wallet, Bell, Database, Microscope, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FarmerDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();

    const features = [
        { href: '/farmer-dashboard/my-produce-listings', label: "My Produce Listings", icon: List },
        { href: '/farmer-dashboard/ai-price-advisor', label: "AI Price Advisor", icon: Microscope },
        { href: '/farmer-dashboard/market-price-suggestions', label: "Market Price Suggestions", icon: Tags },
        { href: '/farmer-dashboard/agri-assist', label: "Agri-Assistant", icon: Bot },
        { href: '/farmer-dashboard/market-prices', label: "Daily Market Prices", icon: Database },
        { href: '/farmer-dashboard/orders-received', label: "Orders Received", icon: Receipt },
        { href: '/farmer-dashboard/payments-earnings', label: "Payments & Earnings", icon: Wallet },
        { href: '/farmer-dashboard/alerts', label: "Alerts", icon: Bell },
    ]

    useEffect(() => {
        if (!loading && !user) {
            router.push('/farmer-login');
        }
    }, [user, loading, router]);

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
        title="Farmer Dashboard"
        description="Welcome back! Here's an overview of your farming activities."
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
