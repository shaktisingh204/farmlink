import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { List, Tags, Receipt, Wallet, Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const features = [
    { href: '/farmer-dashboard/my-produce-listings', label: 'My Produce Listings', icon: List },
    { href: '/farmer-dashboard/market-price-suggestions', label: 'Market Price Suggestions', icon: Tags },
    { href: '/farmer-dashboard/orders-received', label: 'Orders Received', icon: Receipt },
    { href: '/farmer-dashboard/payments-earnings', label: 'Payments & Earnings', icon: Wallet },
    { href: '/farmer-dashboard/alerts', label: 'Alerts', icon: Bell },
]

export default function FarmerDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Farmer Dashboard"
        description="Welcome back! Here's an overview of your farming activities."
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
