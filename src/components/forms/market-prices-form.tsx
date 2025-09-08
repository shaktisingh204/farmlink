'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { summarizePricesAction, type MarketPricesState } from '@/app/(main)/market-prices/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Sparkles, LineChart } from 'lucide-react';
import { PRODUCE_TYPES } from '@/lib/placeholder-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Summarizing...' : 'Get Price Summary'}
    </Button>
  );
}

export function MarketPricesForm() {
  const initialState: MarketPricesState = {};
  const [state, dispatch] = useFormState(summarizePricesAction, initialState);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <form action={dispatch}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Market Query</CardTitle>
            <CardDescription>
              Select a product and data sources to get a real-time price summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select name="product" required>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCE_TYPES.map((type) => (
                    <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.fieldErrors?.product && <p className="text-sm text-destructive">{state.fieldErrors.product}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sources">Data Sources (comma-separated)</Label>
              <Input id="sources" name="sources" defaultValue="USDA, Local Coop, AgriData" required />
              <p className="text-xs text-muted-foreground">The AI will use these source names when calling the `getMarketPrice` tool.</p>
              {state.fieldErrors?.sources && <p className="text-sm text-destructive">{state.fieldErrors.sources}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            {state.error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      <div className="lg:sticky top-8">
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="text-accent" />
              AI Market Summary
            </CardTitle>
            <CardDescription>The summarized market prices will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {state.result ? (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>Price Analysis</AlertTitle>
                  <AlertDescription className="prose prose-sm text-muted-foreground">
                    <p>{state.result.summary}</p>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-64">
                <LineChart className="w-12 h-12 mb-4" />
                <p>Your price summary will be shown here once you submit the form.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
