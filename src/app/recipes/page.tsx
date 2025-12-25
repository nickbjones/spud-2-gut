/**
 * Recipes server page
 */
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import RecipesClientPage from './RecipesClientPage';

export default async function RecipesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.recipes,
    queryFn: () => fetchJSON('/api/recipes'),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipesClientPage />
    </HydrationBoundary>
  );
}
