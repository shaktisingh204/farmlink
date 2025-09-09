
'use client';
import { useFormStatus } from 'react-dom';
import { getPlantHealthAction, type PlantHealthState } from './actions';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Sparkles, UploadCloud, HeartPulse, Microscope, ListOrdered, Percent, BadgeHelp, CheckCircle, AlertTriangle, ShieldAlert, Badge } from 'lucide-react';
import { useState, useActionState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Analyzing...' : 'Diagnose Plant Health'}
    </Button>
  );
}

const statusConfig = {
    'Healthy': { icon: CheckCircle, color: 'text-green-500', badge: 'default' },
    'At Risk': { icon: AlertTriangle, color: 'text-yellow-500', badge: 'secondary' },
    'Sick': { icon: ShieldAlert, color: 'text-destructive', badge: 'destructive' }
};

export default function PlantHealthPage() {
  const initialState: PlantHealthState = {};
  const [state, dispatch] = useActionState(getPlantHealthAction, initialState);
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
        title="Plant Health Diagnosis"
        description="Upload a photo of a plant to get an AI-powered health analysis and treatment recommendations."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <form action={dispatch}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Upload Plant Image</CardTitle>
              <CardDescription>
                Provide an image and optional details for an accurate diagnosis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="image">Plant Image</Label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent">
                        {imagePreview ? (
                             <Image src={imagePreview} alt="Plant preview" width={256} height={256} className="object-contain h-64 w-full rounded-md"/>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or HEIC</p>
                            </div>
                        )}
                        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} required/>
                    </label>
                </div>
                <input type="hidden" name="photoDataUri" value={imageData} />
                {state.fieldErrors?.photoDataUri && <p className="text-sm text-destructive">{state.fieldErrors.photoDataUri}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Plant Name/Type (Optional)</Label>
                <Input id="description" name="description" placeholder="e.g., Tomato Plant, lower leaves" />
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
                AI Analysis Report
              </CardTitle>
              <CardDescription>The AI's diagnosis will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {useFormStatus().pending ? (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-[24rem]">
                    <Microscope className="w-12 h-12 mb-4 animate-pulse" />
                    <p>AI is analyzing your plant's health...</p>
                 </div>
              ) : state.result ? (
                <div className="space-y-4">
                    <Card className="bg-background">
                        <CardHeader>
                             <CardTitle className="text-lg">Diagnosis for: {state.result.plantType}</CardTitle>
                             <div className="flex items-center justify-between pt-2">
                                <Badge variant={statusConfig[state.result.status].badge} className="text-base">
                                    <const IconComponent = statusConfig[state.result.status].icon; />
                                    <IconComponent className={cn("mr-2 h-4 w-4", statusConfig[state.result.status].color)} />
                                    {state.result.status}
                                </Badge>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Percent className="h-4 w-4" />
                                    <span>{state.result.confidence}% confidence</span>
                                </div>
                             </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-1"><BadgeHelp className="w-4 h-4"/> Detected Issue</h4>
                                <p className="text-muted-foreground text-sm">{state.result.detectedIssue}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><ListOrdered className="w-4 h-4"/> Recommendations</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                    {state.result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                </ol>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-background">
                        <CardHeader>
                            <CardTitle className="text-base">Uploaded Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Image src={state.result.uploadedImage} alt="Uploaded plant for diagnosis" width={400} height={400} className="rounded-md object-contain w-full" />
                        </CardContent>
                    </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-[24rem]">
                  <HeartPulse className="w-12 h-12 mb-4" />
                  <p>Your plant health report will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
