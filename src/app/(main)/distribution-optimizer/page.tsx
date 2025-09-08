import { PageHeader } from '@/components/page-header';
import { DistributionOptimizerForm } from '@/components/forms/distribution-optimizer-form';

export default function DistributionOptimizerPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Supply Chain Optimizer"
        description="Get AI-driven recommendations to efficiently distribute your produce to local markets, minimizing waste and maximizing profit."
      />
      <DistributionOptimizerForm />
    </div>
  );
}
