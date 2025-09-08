
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { List, Tags, Receipt, Wallet, Bell, Database, Microscope, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';

export default function FarmerDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const features = [
        { href: '/farmer-dashboard/my-produce-listings', label: "myProduceListings", icon: List },
        { href: '/farmer-dashboard/ai-price-advisor', label: "aiPriceAdvisor", icon: Microscope },
        { href: '/farmer-dashboard/market-price-suggestions', label: "marketPriceSuggestions", icon: Tags },
        { href: '/farmer-dashboard/agri-assist', label: "agriAssistant", icon: Bot },
        { href: '/farmer-dashboard/market-prices', label: "dailyMarketPrices", icon: Database },
        { href: '/farmer-dashboard/orders-received', label: "ordersReceived", icon: Receipt },
        { href: '/farmer-dashboard/payments-earnings', label: "paymentsEarnings", icon: Wallet },
        { href: '/farmer-dashboard/alerts', label: "alerts", icon: Bell },
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
        title={t('farmerDashboard')}
        description={t('farmerDashboardDesc')}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.label} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <feature.icon className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="font-headline">{t(feature.label)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Link href={feature.href} passHref>
                <Button variant="outline" className="w-full">
                  {t('goToPage')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
