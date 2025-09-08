'use client';

import { useFormState, useFormStatus } from 'react-dom';
import {
  getMarketSuggestionAction,
  type MarketSuggestionState,
} from './actions';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRODUCE_TYPES } from '@/lib/placeholder-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Terminal,
  Sparkles,
  Lightbulb,
  Tags,
  Loader2,
  ListChecks,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing Markets...
        </>
      ) : (
        'Get Suggestions'
      )}
    </Button>
  );
}

export default function Page() {
  const initialState: MarketSuggestionState = {};
  const [state, dispatch] = useFormState(getMarketSuggestionAction, initialState);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Market Price Suggestions"
        description="Select your produce to get AI-powered insights and suggestions based on the latest market data."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <form action={dispatch}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Select Produce</CardTitle>
              <CardDescription>
                Choose the commodity you want to get market suggestions for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="commodity">Commodity</Label>
                <Select name="commodity" required>
                  <SelectTrigger id="commodity">
                    <SelectValue placeholder="Select a commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72">
                      {PRODUCE_TYPES.map((type) => (
                        <SelectItem key={type.name} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                {state.fieldErrors?.commodity && (
                  <p className="text-sm text-destructive">
                    {state.fieldErrors.commodity}
                  </p>
                )}
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
                AI-Generated Suggestions
              </CardTitle>
              <CardDescription>
                Actionable insights from our AI will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {useFormStatus().pending ? (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-[24rem]">
                  <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                  <p>Our AI is analyzing the latest market data...</p>
                </div>
              ) : state.result ? (
                <div className="space-y-6">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle className="font-semibold">
                      Market Summary
                    </AlertTitle>
                    <AlertDescription>{state.result.summary}</AlertDescription>
                  </Alert>
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ListChecks />
                      Top Suggestions
                    </h3>
                    <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                      {state.result.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-[24rem]">
                  <Tags className="w-12 h-12 mb-4" />
                  <p>Your market suggestions will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
