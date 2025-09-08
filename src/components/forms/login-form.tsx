'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LoginFormProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  loginPath: string;
}

export function LoginForm({ title, description, icon, loginPath }: LoginFormProps) {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd have authentication logic here.
    // For this prototype, we'll just navigate to the dashboard.
    router.push(loginPath);
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
            Login
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
