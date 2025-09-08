
'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RegistrationFormProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  loginPath: string;
  dashboardPath: string;
}

export function RegistrationForm({ title, description, icon, loginPath, dashboardPath }: RegistrationFormProps) {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd have registration logic here.
    // For this prototype, we'll just navigate to the dashboard.
    router.push(dashboardPath);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <Card>
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
          <Button type="submit" className="w-full">
            Create Account
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            <Link href={loginPath} className="underline hover:text-primary">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
