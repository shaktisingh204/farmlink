import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Receipt, Tags, Wallet, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const features = [
    { href: '/retailer-dashboard/browse-produce', label: 'Browse Produce', icon: Search },
    { href: '/retailer-dashboard/my-orders', label: 'My Orders', icon: Receipt },
    { href: '/retailer-dashboard/recommended-deals', label: 'Recommended Deals', icon: Tags },
    { href: '/retailer-dashboard/payments', label: 'Payments', icon: Wallet },
    { href: '/retailer-dashboard/favorites', label: 'Favorites', icon: Heart },
];

export default function RetailerDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Retailer Dashboard"
        description="Welcome! Find the freshest produce from local farmers."
      />
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.label} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <feature.icon className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="font-headline">{feature.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Link href={feature.href} passHref>
                <Button variant="outline" className="w-full">
                  Go to page <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
