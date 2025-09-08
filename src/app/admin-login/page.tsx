
import { LoginForm } from '@/components/forms/login-form';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  return (
    <div className="grid md:grid-cols-2 min-h-screen bg-background">
      <div className="hidden md:block relative">
        <Image
          src="https://picsum.photos/1200/1600?random=10"
          alt="Admin management dashboard"
          fill
          className="object-cover"
          data-ai-hint="abstract technology"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-4xl font-bold font-headline">FarmLink Admin</h2>
          <p className="text-lg mt-2 max-w-md">Oversee the entire platform, manage users, and ensure everything runs smoothly.</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <LoginForm
            title="Admin Portal"
            description="Login to manage the FarmLink platform."
            icon={<Shield className="w-12 h-12 text-primary" />}
            loginPath="/admin-dashboard"
          />
          <p className="text-sm text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/admin-register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
