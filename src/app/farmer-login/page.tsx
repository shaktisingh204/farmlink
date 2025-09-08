import { LoginForm } from '@/components/forms/login-form';
import { User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FarmerLoginPage() {
  return (
     <div className="grid md:grid-cols-2 min-h-screen bg-background">
      <div className="hidden md:block relative">
        <Image
          src="https://picsum.photos/1200/1600?random=11"
          alt="A farmer in a field"
          fill
          className="object-cover"
          data-ai-hint="farmer field"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-4xl font-bold font-headline">Connect Your Farm</h2>
          <p className="text-lg mt-2 max-w-md">Join our network of local farmers, manage your produce, and reach more buyers.</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
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
    </div>
  );
}
