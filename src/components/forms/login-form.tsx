
'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

interface LoginFormProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  loginPath: string;
  role: UserProfile['role'];
}

export function LoginForm({ title, description, icon, loginPath, role }: LoginFormProps) {
  const { loginAndRedirect } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      await loginAndRedirect(email, password, role, loginPath);
      // The redirect is now handled by the useAuth hook after profile is loaded.
    } catch (err: any) {
       if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            setError(t('loginForm_error_invalidCredentials'));
       } else {
            setError(err.message || t('loginForm_error_unexpected'));
       }
       setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full border-none shadow-none">
        <CardHeader className="text-center items-center gap-2">
          {icon}
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('loginForm_emailLabel')}</Label>
            <Input id="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('loginForm_passwordLabel')}</Label>
            <Input id="password" type="password" required disabled={isLoading}/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>{t('loginForm_error_title')}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? t('loginForm_loggingIn') : t('loginForm_loginButton')}
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            <Link href="/" className="underline hover:text-primary">
              {t('loginForm_backToPortalSelection')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
