
import { getProduceListingById } from '../../actions';
import { notFound } from 'next/navigation';
import { EditProduceForm } from './form';

export default async function EditProducePage({ params }: { params: { id: string } }) {
  const produce = await getProduceListingById(params.id);

  if (!produce) {
    notFound();
  }

  return <EditProduceForm produce={produce} />;
}
