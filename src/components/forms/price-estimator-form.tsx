
'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { estimatePriceAction, type PriceEstimatorState } from '@/app/(main)/price-estimator/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CircleDollarSign, Sparkles } from 'lucide-react';
import { PRODUCE_TYPES } from '@/lib/placeholder-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Estimating...' : 'Estimate Fair Price'}
    </Button>
  );
}

export function PriceEstimatorForm() {
  const initialState: PriceEstimatorState = {};
  const [state, dispatch] = useFormState(estimatePriceAction, initialState);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <form action={dispatch}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Product Details</CardTitle>
            <CardDescription>
              Enter the details of your produce to get a fair price recommendation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="produceType">Produce Type</Label>
              <Select name="produceType" required>
                <SelectTrigger id="produceType">
                  <SelectValue placeholder="Select a produce type" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCE_TYPES.map((type) => (
                    <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.fieldErrors?.produceType && <p className="text-sm text-destructive">{state.fieldErrors.produceType}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (in kg)</Label>
              <Input id="quantity" name="quantity" type="number" step="0.1" placeholder="e.g., 100" required />
              {state.fieldErrors?.quantity && <p className="text-sm text-destructive">{state.fieldErrors.quantity}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualityDescription">Quality Description</Label>
              <Textarea id="qualityDescription" name="qualityDescription" placeholder="e.g., Organic, fresh, slightly bruised" required />
              {state.fieldErrors?.qualityDescription && <p className="text-sm text-destructive">{state.fieldErrors.qualityDescription}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g., Valley Farm, CA" required />
              {state.fieldErrors?.location && <p className="text-sm text-destructive">{state.fieldErrors.location}</p>}
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
              AI Recommendation
            </CardTitle>
            <CardDescription>The suggested price and reasoning will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {state.result ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Recommended Price</p>
                  <p className="text-5xl font-bold text-primary">
                    INR {state.result.recommendedPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">per unit/kg</p>
                </div>
                <div>
                  <h3 className="font-semibold">Reasoning</h3>
                  <p className="text-sm text-muted-foreground">{state.result.priceReasoning}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-64">
                <CircleDollarSign className="w-12 h-12 mb-4" />
                <p>Your price estimation will be shown here once you submit the form.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
