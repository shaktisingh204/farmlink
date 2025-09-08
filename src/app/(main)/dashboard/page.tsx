import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LineChart, Users, Store, CircleDollarSign, Truck } from 'lucide-react';

const features = [
  {
    title: 'Real-time Price Tracking',
    description: 'View current market prices for various agricultural products.',
    href: '/market-prices',
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Farmer Profiles',
    description: 'Browse profiles of local farmers and their available produce.',
    href: '/farmers',
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Local Market Directory',
    description: 'Discover local markets, their locations, and contact information.',
    href: '/markets',
    icon: <Store className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Fair Price Estimator',
    description: 'Get AI-powered recommendations for fair produce pricing.',
    href: '/price-estimator',
    icon: <CircleDollarSign className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Supply Chain Optimizer',
    description: 'Optimize your distribution strategy with AI-driven insights.',
    href: '/distribution-optimizer',
    icon: <Truck className="w-8 h-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome to FarmLink"
        description="Your all-in-one platform to connect with local markets and optimize your farming business."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              {feature.icon}
              <div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Link href={feature.href} passHref>
                <Button variant="outline" className="w-full">
                  Go to feature <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
