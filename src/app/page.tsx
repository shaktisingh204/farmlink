import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Building, Shield, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const portals = [
  {
    title: 'Farmer Portal',
    description: 'Manage your produce, track earnings, and connect with markets.',
    href: '/farmer-login',
    icon: <User className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Retailer Portal',
    description: 'Browse produce, place orders, and discover new local suppliers.',
    href: '/retailer-login',
    icon: <ShoppingBag className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Market Portal',
    description: 'Oversee market operations, participation, and logistics.',
    href: '/market-login',
    icon: <Building className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Admin Portal',
    description: 'System administration, user management, and analytics.',
    href: '/admin-login',
    icon: <Shield className="w-12 h-12 text-primary" />,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
       <div className="text-center max-w-2xl mx-auto">
        <PageHeader
            title="Welcome to FarmLink"
            description="The all-in-one platform connecting farmers, retailers, and local markets. Please select your portal to log in."
        />
       </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12 w-full max-w-6xl">
        {portals.map((portal) => (
          <Card key={portal.title} className="flex flex-col text-center items-center">
            <CardHeader className="items-center gap-4">
              {portal.icon}
              <div className='space-y-1'>
                <CardTitle className="font-headline">{portal.title}</CardTitle>
                <CardDescription>{portal.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-auto w-full">
              <Link href={portal.href} passHref>
                <Button className="w-full">
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
