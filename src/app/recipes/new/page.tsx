/**
 * New Recipe server page
 */
import NewRecipeClientPage from './NewRecipeClientPage';

export default async function NewRecipePage() {
  // recipes and tags are prefetched in layout.tsx
  // no page-level prefetch needed
  // render the client page directly
  return <NewRecipeClientPage />;
}
