
'use client';

import { RegistrationForm } from '@/components/forms/registration-form';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function FarmerRegisterPage() {
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
          <h2 className="text-4xl font-bold font-headline">Farmer Portal</h2>
          <p className="text-lg mt-2 max-w-md">Join our network of local farmers, manage your produce, and reach more buyers.</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <RegistrationForm
            title="Farmer Registration"
            description="Create an account to manage your produce and earnings."
            icon={<User className="w-12 h-12 text-primary" />}
            loginPath="/farmer-login"
            dashboardPath="/farmer-dashboard"
          />
          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/farmer-login" className="font-semibold text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
