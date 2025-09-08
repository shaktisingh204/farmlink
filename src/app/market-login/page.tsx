import { LoginForm } from '@/components/forms/login-form';
import { Building } from 'lucide-react';

export default function MarketLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LoginForm
        title="Market Portal"
        description="Login to oversee market operations and logistics."
        icon={<Building className="w-12 h-12 text-primary" />}
        loginPath="/local-market-dashboard"
      />
    </div>
  );
}
