import { RegistrationForm } from '@/components/forms/registration-form';
import { ShoppingBag } from 'lucide-react';

export default function RetailerRegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <RegistrationForm
        title="Retailer Registration"
        description="Create an account to browse produce and place orders."
        icon={<ShoppingBag className="w-12 h-12 text-primary" />}
        loginPath="/retailer-login"
        dashboardPath="/retailer-dashboard"
      />
    </div>
  );
}
