import Link from 'next/link';
import Image from 'next/image';
import type { Farmer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface FarmerCardProps {
  farmer: Farmer;
}

export function FarmerCard({ farmer }: FarmerCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row gap-4 items-center">
        <Avatar className="w-16 h-16 border">
          <AvatarImage src={farmer.avatarUrl} alt={farmer.name} data-ai-hint="farmer portrait"/>
          <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline">{farmer.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {farmer.location}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{farmer.bio}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/farmers/${farmer.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
