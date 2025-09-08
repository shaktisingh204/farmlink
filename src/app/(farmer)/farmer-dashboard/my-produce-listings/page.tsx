
'use client';

import { useEffect, useState } from 'react';
import { getProduceListings } from './actions';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { MyProduceListingsContent } from './content';
import type { Produce } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

export default function MyProduceListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      setError(t('errorMustBeLoggedIn'));
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
        setError(t('errorFailedToFetchListings'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduce();
  }, [user, authLoading, t]);

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <MyProduceListingsContent produceList={produceList} error={error} />;
}
