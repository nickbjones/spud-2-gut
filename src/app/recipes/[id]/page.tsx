/**
 * Recipe server page
 */
import RecipeClientPage from './RecipeClientPage';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <RecipeClientPage id={id} />;
}
