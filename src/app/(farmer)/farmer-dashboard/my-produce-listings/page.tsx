
'use client';

import { useEffect, useState } from 'react';
import { getProduceListings } from './actions';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { MyProduceListingsContent } from './content';
import type { Produce } from '@/lib/types';

export default function MyProduceListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      setError('You must be logged in to view your listings.');
      return;
    }

    const fetchProduce = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { produce, error } = await getProduceListings(user.uid);
        if (error) {
          setError(error);
        } else {
          setProduceList(produce || []);
        }
      } catch (err) {
        setError('Failed to fetch produce listings.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduce();
  }, [user, authLoading]);

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <MyProduceListingsContent produceList={produceList} error={error} />;
}
