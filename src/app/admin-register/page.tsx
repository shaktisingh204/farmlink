import { RegistrationForm } from '@/components/forms/registration-form';
import { Shield } from 'lucide-react';

export default function AdminRegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <RegistrationForm
        title="Admin Registration"
        description="Create an account to manage the FarmLink platform."
        icon={<Shield className="w-12 h-12 text-primary" />}
        loginPath="/admin-login"
        dashboardPath="/admin-dashboard"
      />
    </div>
  );
}
