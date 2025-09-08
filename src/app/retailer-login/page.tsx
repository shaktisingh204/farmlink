import { LoginForm } from '@/components/forms/login-form';
import { ShoppingBag } from 'lucide-react';

export default function RetailerLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LoginForm
        title="Retailer Portal"
        description="Login to browse produce and place orders."
        icon={<ShoppingBag className="w-12 h-12 text-primary" />}
        loginPath="/retailer-dashboard"
      />
    </div>
  );
}
