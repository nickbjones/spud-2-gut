/**
 * Tag server page
 */
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import TagClientPage from './TagClientPage';

export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // recipes and tags are prefetched in layout.tsx
  // still need to prefetch individual tag
  await queryClient.prefetchQuery({
    queryKey: queryKeys.tag(id),
    queryFn: () => fetchJSON(`/api/tags/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagClientPage id={id} />
    </HydrationBoundary>
  );
}
