import { LoginForm } from '@/components/forms/login-form';
import { Building } from 'lucide-react';
import Link from 'next/link';

export default function MarketLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
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
  );
}
