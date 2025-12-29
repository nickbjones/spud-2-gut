import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { TagType } from '@/types/tag';

export function useTag(id: string) {
  return useQuery({
    queryKey: queryKeys.tag(id),
    queryFn: () => fetchJSON<TagType>(`/api/tags/${id}`),
    enabled: !!id,
  });
}
