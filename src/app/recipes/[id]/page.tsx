/**
 * Recipe server page
 */
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import RecipeClientPage from './RecipeClientPage';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.recipe(params.id),
    queryFn: () => fetchJSON(`/api/recipes/${params.id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeClientPage id={params.id} />
    </HydrationBoundary>
  );
}
