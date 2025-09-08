import Image from 'next/image';
import type { Market } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, MapPin } from 'lucide-react';

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  return (
    <Card>
      <CardHeader className="p-0">
        <Image
          src={market.imageUrl}
          alt={market.name}
          width={600}
          height={400}
          className="rounded-t-lg object-cover aspect-[3/2]"
          data-ai-hint="farmers market"
        />
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1">
          <CardTitle className="font-headline">{market.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {market.location}
          </CardDescription>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{market.operatingHours}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${market.contact}`} className="hover:underline">
              {market.contact}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
