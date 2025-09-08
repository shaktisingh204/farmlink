import { LoginForm } from '@/components/forms/login-form';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function RetailerLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <LoginForm
        title="Retailer Portal"
        description="Login to browse produce and place orders."
        icon={<ShoppingBag className="w-12 h-12 text-primary" />}
        loginPath="/retailer-dashboard"
      />
       <p className="text-sm text-muted-foreground mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/retailer-register" className="font-semibold text-primary hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
