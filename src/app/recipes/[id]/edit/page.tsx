/**
 * Edit Recipe server page
 */
import EditRecipeClient from './EditRecipeClient';

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EditRecipeClient uid={id} />;
}
