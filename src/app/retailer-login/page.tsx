
'use client';

import { LoginForm } from '@/components/forms/login-form';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';

export default function RetailerLoginPage() {
  const { t } = useLanguage();
  return (
    <div className="grid md:grid-cols-2 min-h-screen bg-background">
       <div className="hidden md:block relative">
        <Image
          src="https://picsum.photos/1200/1600?random=13"
          alt="Fresh produce at a retailer"
          fill
          className="object-cover"
          data-ai-hint="fresh produce"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-4xl font-bold font-headline">{t('loginPage_retailer_title')}</h2>
          <p className="text-lg mt-2 max-w-md">{t('loginPage_retailer_description')}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <LoginForm
            title={t('loginForm_retailer_title')}
            description={t('loginForm_retailer_description')}
            icon={<ShoppingBag className="w-12 h-12 text-primary" />}
            loginPath="/retailer-dashboard"
            role="retailer"
          />
         <p className="text-sm text-center text-muted-foreground mt-6">
          {t('loginForm_noAccount')}{' '}
          <Link href="/retailer-register" className="font-semibold text-primary hover:underline">
            {t('loginForm_registerHere')}
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
