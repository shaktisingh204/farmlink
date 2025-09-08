import { farmers } from '@/lib/placeholder-data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, MessageSquare } from 'lucide-react';

export default function FarmerDetailPage({ params }: { params: { id: string } }) {
  const farmer = farmers.find((f) => f.id === params.id);

  if (!farmer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <Avatar className="w-32 h-32 border-4 border-card">
          <AvatarImage src={farmer.avatarUrl} alt={farmer.name} data-ai-hint="farmer portrait"/>
          <AvatarFallback className="text-4xl">{farmer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-bold font-headline">{farmer.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{farmer.location}</span>
          </div>
          <p className="text-lg text-foreground/80">{farmer.bio}</p>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Farmer
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <h2 className="text-3xl font-bold font-headline mb-6">Available Produce</h2>
        {farmer.produce.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmer.produce.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <item.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="font-headline">{item.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold text-accent">{item.price}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity}</p>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">This farmer has no produce listed at the moment.</p>
        )}
      </div>
    </div>
  );
}
