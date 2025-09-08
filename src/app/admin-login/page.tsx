import { LoginForm } from '@/components/forms/login-form';
import { Shield } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LoginForm
        title="Admin Portal"
        description="Login to manage the FarmLink platform."
        icon={<Shield className="w-12 h-12 text-primary" />}
        loginPath="/admin-dashboard"
      />
    </div>
  );
}
