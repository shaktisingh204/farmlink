import { PageHeader } from '@/components/page-header';
import { farmers } from '@/lib/placeholder-data';
import { FarmerCard } from '@/components/cards/farmer-card';

export default function FarmersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Meet the Farmers"
        description="Browse our community of dedicated local farmers."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
}
