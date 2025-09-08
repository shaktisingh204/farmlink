import { getCurrentUser } from '@/lib/actions/user-actions';
import { getProduceListings } from './actions';
import { MyProduceListingsContent } from './content';
import type { Produce } from '@/lib/types';
import { getTranslations } from '@/lib/i18n';

export default async function MyProduceListingsPage() {
  // This server component is now only responsible for fetching data.
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

  // The data is passed to the client component.
  // The client component will handle translations using the useLanguage hook.
  return <MyProduceListingsContent produceList={produceList} error={error} />;
}
