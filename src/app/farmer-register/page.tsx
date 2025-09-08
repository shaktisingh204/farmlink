import { RegistrationForm } from '@/components/forms/registration-form';
import { User } from 'lucide-react';

export default function FarmerRegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <RegistrationForm
        title="Farmer Registration"
        description="Create an account to manage your produce and earnings."
        icon={<User className="w-12 h-12 text-primary" />}
        loginPath="/farmer-login"
        dashboardPath="/farmer-dashboard"
      />
    </div>
  );
}
