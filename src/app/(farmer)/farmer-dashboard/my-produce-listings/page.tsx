import { getCurrentUser } from '@/lib/actions/user-actions';
import { getProduceListings } from './actions';
import { MyProduceListingsContent } from './content';
import type { Produce } from '@/lib/types';
import { getTranslations } from '@/lib/i18n';

export default async function MyProduceListingsPage() {
  const user = await getCurrentUser();

  // Determine if the logged-in user is a farmer
  const isFarmer = user?.role === 'farmer';

  let produceList: Produce[] = [];
  let error: string | null = null;
  
  try {
    // If user is a farmer, fetch their listings. Otherwise, fetch all listings.
    const result = await getProduceListings(isFarmer ? user.uid : null);
    produceList = result.produce;
  } catch (err: any) {
    error = `Failed to fetch produce listings: ${err.message}`;
    console.error(err);
  }

  // The data is passed to the client component.
  // The client component will handle translations using the useLanguage hook.
  return <MyProduceListingsContent produceList={produceList} error={error} isFarmer={isFarmer} />;
}
