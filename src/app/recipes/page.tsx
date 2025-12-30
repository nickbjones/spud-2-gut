/**
 * Recipes server page
 */
import RecipesClientPage from './RecipesClientPage';

export default async function RecipesPage() {
  // recipes and tags are prefetched in layout.tsx
  // no page-level prefetch needed
  // render the client page directly
  return <RecipesClientPage />;
}
