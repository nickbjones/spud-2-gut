/**
 * Edit Tag server page
 */
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import EditTagClientPage from './EditTagClientPage';

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tag(id),
    queryFn: () => fetchJSON(`/api/tags/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditTagClientPage uid={id} />
    </HydrationBoundary>
  );
}
