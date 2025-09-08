import { LoginForm } from '@/components/forms/login-form';
import { Building } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MarketLoginPage() {
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
          <h2 className="text-4xl font-bold font-headline">Empower Your Market</h2>
          <p className="text-lg mt-2 max-w-md">Manage operations, track farmer participation, and streamline logistics.</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <LoginForm
          title="Market Portal"
          description="Login to oversee market operations and logistics."
          icon={<Building className="w-12 h-12 text-primary" />}
          loginPath="/local-market-dashboard"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/market-register" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
