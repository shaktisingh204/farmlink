import { PageHeader } from '@/components/page-header';
import { PriceEstimatorForm } from '@/components/forms/price-estimator-form';

export default function PriceEstimatorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Fair Price Estimator"
        description="Leverage AI to determine a fair price for your produce based on market data, quality, and location."
      />
      <PriceEstimatorForm />
    </div>
  );
}
