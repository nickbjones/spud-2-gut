/**
 * Tag server page
 */
import TagClientPage from './TagClientPage';

export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <TagClientPage id={id} />;
}
