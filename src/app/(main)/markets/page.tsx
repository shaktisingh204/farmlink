import { PageHeader } from '@/components/page-header';
import { markets } from '@/lib/placeholder-data';
import { MarketCard } from '@/components/cards/market-card';

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Local Market Directory"
        description="Find local markets to sell your produce and connect with buyers."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
}
