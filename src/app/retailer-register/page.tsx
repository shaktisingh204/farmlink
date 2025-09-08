import { RegistrationForm } from '@/components/forms/registration-form';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RetailerRegisterPage() {
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
          <h2 className="text-4xl font-bold font-headline">Source the Best</h2>
          <p className="text-lg mt-2 max-w-md">Discover the freshest local produce, connect with farmers, and place orders with ease.</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <RegistrationForm
          title="Retailer Registration"
          description="Create an account to browse produce and place orders."
          icon={<ShoppingBag className="w-12 h-12 text-primary" />}
          loginPath="/retailer-login"
          dashboardPath="/retailer-dashboard"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link href="/retailer-login" className="font-semibold text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
