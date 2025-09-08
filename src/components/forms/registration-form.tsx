
'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

interface RegistrationFormProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  loginPath: string;
  dashboardPath: string;
}

export function RegistrationForm({ title, description, icon, loginPath, dashboardPath }: RegistrationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const name = event.currentTarget.name.value;
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Realtime Database
      await set(ref(db, 'users/' + user.uid), {
        name: name,
        email: email,
        role: title.split(' ')[0].toLowerCase(), // e.g., 'farmer', 'admin'
      });
      
      toast({
        title: 'Account Created!',
        description: 'You have been successfully registered.',
      });

      router.push(dashboardPath);
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please choose a stronger password.';
      }
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Card className="border-none shadow-none">
        <CardHeader className="text-center items-center">
          {icon}
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Registration Failed</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          <Button type="submit" className="w-full">
            Create Account
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            <Link href="/" className="underline hover:text-primary">
              Back to portal selection
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
