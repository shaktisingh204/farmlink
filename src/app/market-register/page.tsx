
'use client';

import { RegistrationForm } from '@/components/forms/registration-form';
import { Building } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';

export default function MarketRegisterPage() {
  const { t } = useLanguage();

  return (
    <div className="grid md:grid-cols-2 min-h-screen bg-background">
      <div className="hidden md:block relative">
        <Image
          src="https://picsum.photos/1200/1600?random=12"
          alt="A bustling local market"
          fill
          className="object-cover"
          data-ai-hint="farmers market"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-4xl font-bold font-headline">{t('portals.market.title')}</h2>
          <p className="text-lg mt-2 max-w-md">{t('register.marketHero')}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <RegistrationForm
            title={t('register.marketTitle')}
            description={t('register.marketDescription')}
            icon={<Building className="w-12 h-12 text-primary" />}
            loginPath="/market-login"
            dashboardPath="/local-market-dashboard"
          />
          <p className="text-sm text-center text-muted-foreground mt-6">
            {t('register.haveAccount')}{' '}
            <Link href="/market-login" className="font-semibold text-primary hover:underline">
              {t('register.loginHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
