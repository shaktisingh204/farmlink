'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { getPriceAdviceAction, type PriceAdvisorState } from './actions';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Sparkles, UploadCloud, CircleDollarSign, Microscope, CheckCircle, XCircle } from 'lucide-react';
import { PRODUCE_TYPES } from '@/lib/placeholder-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Analyzing...' : 'Get Price Advice'}
    </Button>
  );
}

export default function AiPriceAdvisorPage() {
  const initialState: PriceAdvisorState = {};
  const [state, dispatch] = useFormState(getPriceAdviceAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageData(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Price Advisor"
        description="Upload a photo of your produce to get an AI-powered quality assessment and price recommendation."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <form action={dispatch}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Produce Details</CardTitle>
              <CardDescription>
                Provide an image and some details to get your price suggestion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="image">Produce Image</Label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent">
                        {imagePreview ? (
                             <Image src={imagePreview} alt="Produce preview" width={192} height={192} className="object-cover h-48 w-full rounded-md"/>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                            </div>
                        )}
                        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} required/>
                    </label>
                </div>
                <input type="hidden" name="photoDataUri" value={imageData} />
                {state.fieldErrors?.photoDataUri && <p className="text-sm text-destructive">{state.fieldErrors.photoDataUri}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="commodity">Commodity</Label>
                    <Select name="commodity" required>
                        <SelectTrigger id="commodity"><SelectValue placeholder="Select commodity" /></SelectTrigger>
                        <SelectContent>
                        {PRODUCE_TYPES.map(type => <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {state.fieldErrors?.commodity && <p className="text-sm text-destructive">{state.fieldErrors.commodity}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="variety">Variety</Label>
                    <Input id="variety" name="variety" placeholder="e.g., Roma, Gala" required />
                    {state.fieldErrors?.variety && <p className="text-sm text-destructive">{state.fieldErrors.variety}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Your Location (for market data)</Label>
                <Input id="location" name="location" placeholder="e.g., Nashik, Maharashtra" required />
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
                AI Analysis & Recommendation
              </CardTitle>
              <CardDescription>The AI's findings and price suggestion will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {useFormStatus().pending ? (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-[24rem]">
                    <Microscope className="w-12 h-12 mb-4 animate-pulse" />
                    <p>AI is analyzing your produce...</p>
                 </div>
              ) : state.result ? (
                <div className="space-y-4">
                   <div className="text-center p-6 bg-background rounded-lg border">
                        <p className="text-sm text-muted-foreground">Recommended Price</p>
                        <p className="text-5xl font-bold text-primary">
                            ${state.result.recommendedPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">per kg</p>
                    </div>

                  <Card className="bg-background">
                    <CardHeader>
                        <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                            Identification
                             {state.result.isMatch ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-destructive" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className='text-sm'>AI identified: <span className='font-semibold'>{state.result.identification}</span></p>
                        {!state.result.isMatch && <p className="text-sm text-destructive mt-1">This does not match your selection.</p>}
                    </CardContent>
                  </Card>

                   <Card className="bg-background">
                    <CardHeader><CardTitle className='text-lg font-semibold'>Quality Assessment</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{state.result.quality}</p></CardContent>
                  </Card>
                  
                   <Card className="bg-background">
                    <CardHeader><CardTitle className='text-lg font-semibold'>Price Reasoning</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{state.result.priceReasoning}</p></CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-[24rem]">
                  <CircleDollarSign className="w-12 h-12 mb-4" />
                  <p>Your price analysis will be shown here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
