/**
 * Tags server page
 */

import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import TagsClientPage from './TagsClientPage';

export default async function TagsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tags,
    queryFn: () => fetchJSON('/api/tags'),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagsClientPage />
    </HydrationBoundary>
  );
}
