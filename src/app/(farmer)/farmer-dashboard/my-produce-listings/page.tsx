
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRODUCE_TYPES, produce as initialProduce } from '@/lib/placeholder-data';
import { useState } from 'react';
import type { Produce } from '@/lib/types';
import Image from 'next/image';
import { ImageIcon, PlusCircle } from 'lucide-react';

export default function MyProduceListingsPage() {
  const [produceList, setProduceList] = useState<Produce[]>(initialProduce);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image') as File;

    const newProduce: Produce = {
      id: `p${produceList.length + 1}`,
      name: formData.get('name') as string,
      variety: formData.get('variety') as string,
      quantity: `${formData.get('quantity') as string} kg available`,
      price: `$${formData.get('price') as string}/kg`,
      description: formData.get('description') as string,
      // In a real app, you'd upload the image to a service like Firebase Storage
      // and get a URL. Here, we'll use a placeholder or local object URL for demonstration.
      imageUrl: imageFile && imageFile.size > 0 ? URL.createObjectURL(imageFile) : 'https://picsum.photos/400/300?random=' + Math.random(),
      icon: PRODUCE_TYPES.find(p => p.name === formData.get('name'))?.icon || PRODUCE_TYPES[0].icon,
    };

    setProduceList(prev => [newProduce, ...prev]);
    form.reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Produce Listings"
          description="Manage your produce listings."
        />
        <Button onClick={() => setShowForm(!showForm)}>
            <PlusCircle className="mr-2"/>
            {showForm ? 'Cancel' : 'Add New Listing'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Add New Produce Listing</CardTitle>
              <CardDescription>Fill out the details below to add a new item to your listings.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Produce Name</Label>
                <Select name="name" required>
                  <SelectTrigger id="name"><SelectValue placeholder="Select produce" /></SelectTrigger>
                  <SelectContent>
                    {PRODUCE_TYPES.map(type => <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variety">Variety</Label>
                <Input id="variety" name="variety" placeholder="e.g., Roma, Gala" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" name="quantity" type="number" placeholder="100" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($ per kg)</Label>
                <Input id="price" name="price" type="number" step="0.01" placeholder="3.50" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe your produce..." required />
              </div>
               <div className="md:col-span-2 space-y-2">
                <Label htmlFor="image">Produce Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground">Upload an image of your produce. This will be shown to buyers.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Add Listing</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produceList.length > 0 ? (
          produceList.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="p-0">
                 {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="rounded-t-lg object-cover aspect-[4/3]"
                      data-ai-hint="fresh produce"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-secondary rounded-t-lg aspect-[4/3]">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="font-headline text-xl mb-2">{item.name}</CardTitle>
                <p className="font-semibold text-lg text-primary mb-2">{item.price}</p>
                <p className="text-sm text-muted-foreground mb-1">{item.quantity}</p>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
              <CardFooter>
                  <Button variant="outline" className="w-full">Edit Listing</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">You haven&apos;t listed any produce yet.</p>
             <Button onClick={() => setShowForm(true)} className="mt-4">
                <PlusCircle className="mr-2"/>
                Add Your First Listing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
