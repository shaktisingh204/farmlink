
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, BarChart, AreaChart, FileWarning, Server, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function AdminDashboardPage() {
    const { user, loading, userProfile } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const features = [
        { href: '/admin-dashboard/user-management', label: t('adminDashboard_userManagement'), icon: Users },
        { href: '/admin-dashboard/transactions', label: t('adminDashboard_transactions'), icon: BarChart },
        { href: '/admin-dashboard/analytics', label: t('adminDashboard_analytics'), icon: AreaChart },
        { href: '/admin-dashboard/complaints', label: t('adminDashboard_complaints'), icon: FileWarning },
        { href: '/admin-dashboard/contact-messages', label: t('adminDashboard_contactMessages'), icon: Mail },
        { href: '/admin-dashboard/system-health', label: t('adminDashboard_systemHealth'), icon: Server },
    ];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin-login');
        }
    }, [user, loading, router]);

    if (loading || !user || !userProfile) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
  
    if (userProfile.role !== 'admin') {
         router.push('/admin-login');
         return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('adminDashboard_title')}
        description={t('adminDashboard_description')}
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
