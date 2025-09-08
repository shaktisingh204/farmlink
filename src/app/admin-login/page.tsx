import { LoginForm } from '@/components/forms/login-form';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <LoginForm
        title="Admin Portal"
        description="Login to manage the FarmLink platform."
        icon={<Shield className="w-12 h-12 text-primary" />}
        loginPath="/admin-dashboard"
      />
      <p className="text-sm text-muted-foreground mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/admin-register" className="font-semibold text-primary hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
