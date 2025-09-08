import { getCurrentUser } from '@/lib/actions/user-actions';
import { getProduceListings } from './actions';
import { MyProduceListingsContent } from './content';
import type { Produce } from '@/lib/types';
import { getTranslations } from '@/hooks/use-language';

export default async function MyProduceListingsPage() {
  const { t } = await getTranslations();
  const user = await getCurrentUser();

  let produceList: Produce[] = [];
  let error: string | null = null;

  if (!user) {
    error = "You must be logged in to view your listings.";
  } else {
    try {
      const result = await getProduceListings(user.uid);
      produceList = result.produce;
    } catch (err: any) {
      error = `Failed to fetch produce listings: ${err.message}`;
      console.error(err);
    }
  }

  return <MyProduceListingsContent produceList={produceList} error={error} t={t} />;
}
