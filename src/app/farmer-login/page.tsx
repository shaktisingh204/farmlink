import { LoginForm } from '@/components/forms/login-form';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function FarmerLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <LoginForm
        title="Farmer Portal"
        description="Login to manage your produce and earnings."
        icon={<User className="w-12 h-12 text-primary" />}
        loginPath="/farmer-dashboard"
      />
      <p className="text-sm text-muted-foreground mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/farmer-register" className="font-semibold text-primary hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
