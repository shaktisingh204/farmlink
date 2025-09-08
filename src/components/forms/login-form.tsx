
'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface LoginFormProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  loginPath: string;
  role: UserProfile['role'];
}

export function LoginForm({ title, description, icon, loginPath, role }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user role from database
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists() && snapshot.val().role === role) {
        toast({
          title: 'Success!',
          description: 'You have successfully logged in.',
        });
        router.push(loginPath);
      } else {
        await signOut(auth); // Sign out the user
        setError(`This account is not registered as a '${role}'. Please use the correct portal or register a new account.`);
        setIsLoading(false);
      }
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else {
         console.error(error);
      }
      setError(errorMessage);
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required disabled={isLoading}/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Login Failed</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            <Link href="/" className="underline hover:text-primary">
              Back to portal selection
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
