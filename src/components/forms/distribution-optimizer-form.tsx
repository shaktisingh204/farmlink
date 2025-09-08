'use client';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { optimizeDistributionAction, type DistributionOptimizerState } from '@/app/(main)/distribution-optimizer/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, X, PlusCircle, Sparkles, Lightbulb, BarChart, Route } from 'lucide-react';
import { PRODUCE_TYPES, markets } from '@/lib/placeholder-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const marketDemandSchema = z.object({
  marketName: z.string().min(1, 'Required'),
  demand: z.coerce.number().min(1, 'Must be > 0'),
  location: z.string().min(1, 'Required'),
});

const formSchema = z.object({
  produceType: z.string().min(1, 'Produce type is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be > 0'),
  location: z.string().min(1, 'Your location is required'),
  quality: z.string().min(1, 'Produce quality is required'),
  marketDemands: z.array(marketDemandSchema).min(1, 'At least one market is required'),
});

type FormData = z.infer<typeof formSchema>;

export function DistributionOptimizerForm() {
  const [state, setState] = useState<DistributionOptimizerState>({});
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketDemands: [
        { marketName: markets[0].name, demand: 50, location: markets[0].location },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "marketDemands",
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    setState({});
    const formData = new FormData();
    formData.append('produceType', data.produceType);
    formData.append('quantity', String(data.quantity));
    formData.append('location', data.location);
    formData.append('quality', data.quality);
    formData.append('marketDemands', JSON.stringify(data.marketDemands));

    const result = await optimizeDistributionAction(state, formData);
    setState(result);
    setIsPending(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Supply & Demand Details</CardTitle>
            <CardDescription>Enter your produce information and local market demands to get an optimal distribution plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Your Supply</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="produceType">Produce</Label>
                   <Controller
                    control={control}
                    name="produceType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="produceType"><SelectValue placeholder="Select produce" /></SelectTrigger>
                        <SelectContent>
                          {PRODUCE_TYPES.map(type => <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.produceType && <p className="text-sm text-destructive">{errors.produceType.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input id="quantity" {...register('quantity')} type="number" placeholder="100" />
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <Input id="location" {...register('location')} placeholder="e.g., Valley Farm, CA" />
                  {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                   <Controller
                    control={control}
                    name="quality"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="quality"><SelectValue placeholder="Select quality" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Average">Average</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.quality && <p className="text-sm text-destructive">{errors.quality.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Market Demands</Label>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 border rounded-lg relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)}><X className="h-4 w-4"/></Button>
                    <div className="space-y-2">
                       <Label htmlFor={`marketDemands.${index}.marketName`}>Market Name</Label>
                       <Input {...register(`marketDemands.${index}.marketName`)} placeholder="e.g. City Center Market" />
                       {errors.marketDemands?.[index]?.marketName && <p className="text-sm text-destructive">{errors.marketDemands[index]?.marketName?.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor={`marketDemands.${index}.demand`}>Demand (kg)</Label>
                       <Input {...register(`marketDemands.${index}.demand`)} type="number" placeholder="50" />
                       {errors.marketDemands?.[index]?.demand && <p className="text-sm text-destructive">{errors.marketDemands[index]?.demand?.message}</p>}
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor={`marketDemands.${index}.location`}>Location</Label>
                       <Input {...register(`marketDemands.${index}.location`)} placeholder="e.g. Downtown" />
                       {errors.marketDemands?.[index]?.location && <p className="text-sm text-destructive">{errors.marketDemands[index]?.location?.message}</p>}
                    </div>
                  </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => append({ marketName: '', demand: 0, location: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Market
                 </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
             {state.error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Optimizing...' : 'Optimize Distribution'}
            </Button>
          </CardFooter>
        </Card>
      </form>
       <div className="lg:sticky top-8">
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="text-accent" /> AI-Powered Distribution Plan</CardTitle>
            <CardDescription>Recommendations for efficient distribution will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && <div className="flex items-center justify-center p-8"><Route className="w-12 h-12 animate-pulse" /></div>}
            {state.result ? (
              <div className="space-y-6">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Strategy Summary</AlertTitle>
                  <AlertDescription>{state.result.summary}</AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <h3 className="font-semibold">Market Recommendations</h3>
                  {state.result.recommendations.map(rec => (
                    <Card key={rec.marketName} className="bg-background">
                      <CardHeader>
                        <CardTitle className="text-base font-headline flex items-center justify-between">
                          {rec.marketName}
                          <span className="text-primary font-bold text-lg">{rec.quantity} kg</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : !isPending && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-[24rem]">
                <BarChart className="w-12 h-12 mb-4" />
                <p>Your distribution plan will be shown here once you submit the form.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
