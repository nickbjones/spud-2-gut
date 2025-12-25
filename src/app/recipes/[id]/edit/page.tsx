/**
 * Edit Recipe server page
 */
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import EditRecipeClient from './EditRecipeClient';

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.recipe(id),
    queryFn: () => fetchJSON(`/api/recipes/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditRecipeClient uid={id} />
    </HydrationBoundary>
  );
}
