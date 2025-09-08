import { PageHeader } from '@/components/page-header';
import { MarketPricesForm } from '@/components/forms/market-prices-form';

export default function MarketPricesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Real-time Price Tracking"
        description="Get AI-powered summaries of current market prices for various agricultural products."
      />
      <MarketPricesForm />
    </div>
  );
}
