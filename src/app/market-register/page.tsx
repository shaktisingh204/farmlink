import { RegistrationForm } from '@/components/forms/registration-form';
import { Building } from 'lucide-react';

export default function MarketRegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <RegistrationForm
        title="Market Registration"
        description="Create an account to oversee market operations and logistics."
        icon={<Building className="w-12 h-12 text-primary" />}
        loginPath="/market-login"
        dashboardPath="/local-market-dashboard"
      />
    </div>
  );
}
