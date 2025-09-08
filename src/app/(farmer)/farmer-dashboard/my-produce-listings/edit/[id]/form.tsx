
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
import { updateProduceAction, type AddProduceState } from '../../actions';
import { useEffect, useState, useActionState } from 'react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import type { Produce } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving Changes...' : 'Save Changes'}
    </Button>
  );
}

export function EditProduceForm({ produce }: { produce: Produce }) {
  const initialState: AddProduceState = {};
  const updateProduceWithId = updateProduceAction.bind(null, produce.id);
  const [state, dispatch] = useActionState(updateProduceWithId, initialState);
  
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const [imagePreview, setImagePreview] = useState<string | null>(produce.imageUrl || null);
  const [imageData, setImageData] = useState<string>(produce.imageUrl || '');

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: 'Your listing has been updated.',
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
        title="Edit Produce Listing"
        description="Update the details for your produce listing below."
      />
      <form action={dispatch}>
        <input type="hidden" name="farmerId" value={user?.uid || ''} />
        <input type="hidden" name="createdAt" value={produce.createdAt || ''} />

        <Card>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Produce Name</Label>
              <Select name="name" required defaultValue={produce.name}>
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
              <Input id="variety" name="variety" placeholder="e.g., Roma, Gala" required defaultValue={produce.variety} />
              {state.fieldErrors?.variety && <p className="text-sm text-destructive">{state.fieldErrors.variety}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg)</Label>
              <Input id="quantity" name="quantity" type="number" placeholder="100" required defaultValue={produce.quantity} />
              {state.fieldErrors?.quantity && <p className="text-sm text-destructive">{state.fieldErrors.quantity}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR per kg)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="250.00" required defaultValue={produce.price} />
              {state.fieldErrors?.price && <p className="text-sm text-destructive">{state.fieldErrors.price}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe your produce..." required defaultValue={produce.description} />
              {state.fieldErrors?.description && <p className="text-sm text-destructive">{state.fieldErrors.description}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="image">Produce Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              <input type="hidden" name="imageUrl" value={imageData} />
              <p className="text-xs text-muted-foreground">Upload a new image to replace the old one, or leave it blank to keep the current image.</p>
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
