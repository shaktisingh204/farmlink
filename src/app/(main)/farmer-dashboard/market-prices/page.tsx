import { PageHeader } from '@/components/page-header';
import { getMarketData, type MarketRecord } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function MarketPricesTable() {
  const data = await getMarketData();

  if (!data || data.length === 0) {
    return <p>Could not load market data.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Market Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commodity</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Variety</TableHead>
              <TableHead>Arrival Date</TableHead>
              <TableHead className="text-right">Min Price</TableHead>
              <TableHead className="text-right">Max Price</TableHead>
              <TableHead className="text-right">Modal Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record: MarketRecord, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{record.Commodity}</TableCell>
                <TableCell>{record.Market}, {record.District}</TableCell>
                <TableCell>{record.Variety}</TableCell>
                <TableCell>{record.Arrival_Date}</TableCell>
                <TableCell className="text-right">{record.Min_Price}</TableCell>
                <TableCell className="text-right">{record.Max_Price}</TableCell>
                <TableCell className="text-right font-semibold">{record.Modal_Price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function Page() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Daily Market Prices"
        description="View daily market prices from data.gov.in."
      />
      <MarketPricesTable />
    </div>
  );
}
