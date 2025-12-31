/**
 * Edit Tag server page
 */
import EditTagClientPage from './EditTagClientPage';

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EditTagClientPage uid={id} />;
}
