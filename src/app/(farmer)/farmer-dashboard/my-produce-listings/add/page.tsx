
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRODUCE_TYPES } from '@/lib/placeholder-data';
import { useFormStatus } from 'react-dom';
import { addProduceAction, type AddProduceState } from '../actions';
import { useEffect, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adding Listing...' : 'Add Listing'}
    </Button>
  );
}

export default function AddProducePage() {
  const initialState: AddProduceState = {};
  const [state, dispatch] = useActionState(addProduceAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: 'Your new produce has been listed.',
      });
      router.push('/farmer-dashboard/my-produce-listings');
    }
  }, [state.success, toast, router]);

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
        title="Add New Produce Listing"
        description="Fill out the details below to add a new item to your listings."
      />
      <form action={dispatch}>
        {/* Add hidden input for farmerId */}
        <input type="hidden" name="farmerId" value={user?.uid || ''} />

        <Card>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Produce Name</Label>
              <Select name="name" required>
                <SelectTrigger id="name"><SelectValue placeholder="Select produce" /></SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-72">
                    {PRODUCE_TYPES.map(type => <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>)}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">Variety</Label>
              <Input id="variety" name="variety" placeholder="e.g., Roma, Gala" required />
              {state.fieldErrors?.variety && <p className="text-sm text-destructive">{state.fieldErrors.variety}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg)</Label>
              <Input id="quantity" name="quantity" type="number" placeholder="100" required />
              {state.fieldErrors?.quantity && <p className="text-sm text-destructive">{state.fieldErrors.quantity}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR per kg)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="250.00" required />
              {state.fieldErrors?.price && <p className="text-sm text-destructive">{state.fieldErrors.price}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe your produce..." required />
              {state.fieldErrors?.description && <p className="text-sm text-destructive">{state.fieldErrors.description}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="image">Produce Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              <input type="hidden" name="imageUrl" value={imageData} />
              <p className="text-xs text-muted-foreground">Upload an image of your produce. This will be shown to buyers.</p>
              {imagePreview && (
                  <img src={imagePreview} alt="Produce preview" className="mt-4 rounded-md object-cover h-48 w-48"/>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-y-4">
             {state.error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
