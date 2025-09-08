import { LoginForm } from '@/components/forms/login-form';
import { User } from 'lucide-react';

export default function FarmerLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LoginForm
        title="Farmer Portal"
        description="Login to manage your produce and earnings."
        icon={<User className="w-12 h-12 text-primary" />}
        loginPath="/farmer-dashboard"
      />
    </div>
  );
}
