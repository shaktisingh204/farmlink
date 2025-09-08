
import { getCurrentUser } from '@/lib/actions/user-actions';
import { getProduceListings } from './actions';
import { MyProduceListingsContent } from './content';
import type { Produce } from '@/lib/types';
import { getTranslations } from '@/lib/i18n';

export default async function MyProduceListingsPage() {
  const user = await getCurrentUser();

  let produceList: Produce[] = [];
  let error: string | null = null;
  
  if (!user || user.role !== 'farmer') {
    error = 'You must be logged in as a farmer to view your listings.';
  } else {
    try {
      const result = await getProduceListings(user.uid);
      if (result.error) {
        error = result.error;
      } else {
        produceList = result.produce;
      }
    } catch (err: any) {
      error = `Failed to fetch produce listings: ${err.message}`;
      console.error(err);
    }
  }

  return <MyProduceListingsContent produceList={produceList} error={error} />;
}
