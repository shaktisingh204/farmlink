
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Receipt, Tags, Wallet, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';


export default function RetailerDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const features = [
        { href: '/retailer-dashboard/browse-produce', label: t('retailerDashboard_browseProduce'), icon: Search },
        { href: '/retailer-dashboard/my-orders', label: t('retailerDashboard_myOrders'), icon: Receipt },
        { href: '/retailer-dashboard/recommended-deals', label: t('retailerDashboard_recommendedDeals'), icon: Tags },
        { href: '/retailer-dashboard/payments', label: t('retailerDashboard_payments'), icon: Wallet },
        { href: '/retailer-dashboard/favorites', label: t('retailerDashboard_favorites'), icon: Heart },
    ];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/retailer-login');
        }
    }, [user, loading, router]);

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
        title={t('retailerDashboard_title')}
        description={t('retailerDashboard_description')}
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
                  {t('dashboard_goToPage')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
