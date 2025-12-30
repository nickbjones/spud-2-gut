/**
 * Recipe server page
 */
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import RecipeClientPage from './RecipeClientPage';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // recipes and tags are prefetched in layout.tsx
  // still need to prefetch individual recipe
  await queryClient.prefetchQuery({
    queryKey: queryKeys.recipe(id),
    queryFn: () => fetchJSON(`/api/recipes/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeClientPage id={id} />
    </HydrationBoundary>
  );
}
