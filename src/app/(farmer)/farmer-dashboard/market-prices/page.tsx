
'use client';

import { PageHeader } from '@/components/page-header';
import { getMarketData, type MarketRecord } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { Loader2, Calendar as CalendarIcon, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INDIAN_STATES, PRODUCE_TYPES } from '@/lib/placeholder-data';
import { ScrollArea } from '@/components/ui/scroll-area';

const DEBOUNCE_DELAY = 500;
const RECORDS_PER_PAGE = 10;

function MarketPricesTable() {
  const [data, setData] = useState<MarketRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({ State: '', District: '', Commodity: '' });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [offset, setOffset] = useState(0);

  const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY);
  
  useEffect(() => {
    // Set yesterday's date on initial render for client-side
    if(date === undefined) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setDate(yesterday);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!date) return; // Don't fetch until date is set
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMarketData({
          limit: RECORDS_PER_PAGE,
          offset,
          filters: {
            State: debouncedFilters.State || undefined,
            District: debouncedFilters.District || undefined,
            Commodity: debouncedFilters.Commodity || undefined,
            Arrival_Date: date ? date.toISOString() : undefined,
          }
        });
        setData(result);
      } catch (err: any) {
        setError('Failed to load market data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [debouncedFilters, offset, date]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setOffset(0); // Reset to first page on filter change
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setOffset(0); // Reset to first page on filter change
  };

  const handleNextPage = () => {
    setOffset(prev => prev + RECORDS_PER_PAGE);
  };

  const handlePrevPage = () => {
    setOffset(prev => Math.max(0, prev - RECORDS_PER_PAGE));
  };
  
  const resetFilters = () => {
    setFilters({ State: '', District: '', Commodity: ''});
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate(yesterday);
    setOffset(0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Market Prices</CardTitle>
        <CardDescription>Filter and browse daily market prices from data.gov.in.</CardDescription>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className='space-y-2'>
            <Label htmlFor="State">State</Label>
            <Select value={filters.State} onValueChange={(value) => handleFilterChange('State', value)}>
                <SelectTrigger id="State">
                    <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                     <ScrollArea className="h-72">
                        {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                    </ScrollArea>
                </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor="District">District</Label>
            <Input id="District" name="District" placeholder="e.g. Nashik" value={filters.District} onChange={handleInputChange} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor="Commodity">Commodity</Label>
            <Select value={filters.Commodity} onValueChange={(value) => handleFilterChange('Commodity', value)}>
                <SelectTrigger id="Commodity">
                    <SelectValue placeholder="Select a commodity" />
                </SelectTrigger>
                <SelectContent>
                     <ScrollArea className="h-72">
                        {PRODUCE_TYPES.map((type) => (
                            <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                        ))}
                    </ScrollArea>
                </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="date">Arrival Date</Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setOffset(0); }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={resetFilters}><X className="mr-2 h-4 w-4" /> Reset Filters</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                   <TableRow>
                    <TableCell colSpan={7} className="text-center text-destructive">{error}</TableCell>
                  </TableRow>
                ) : data.length > 0 ? (
                  data.map((record: MarketRecord, index: number) => (
                    <TableRow key={`${record.Commodity_Code}-${record.Market}-${record.Arrival_Date}-${index}`}>
                      <TableCell className="font-medium">{record.Commodity}</TableCell>
                      <TableCell>{record.Market}, {record.District}, {record.State}</TableCell>
                      <TableCell>{record.Variety}</TableCell>
                      <TableCell>{record.Arrival_Date}</TableCell>
                      <TableCell className="text-right">{record.Min_Price}</TableCell>
                      <TableCell className="text-right">{record.Max_Price}</TableCell>
                      <TableCell className="text-right font-semibold">{record.Modal_Price}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">No results found for the current filters.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
         <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={offset === 0 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={data.length < RECORDS_PER_PAGE || isLoading}
          >
            Next
          </Button>
        </div>
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
