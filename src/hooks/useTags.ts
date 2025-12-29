'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
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

export function useTags() {
  const tagsQuery = useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => fetchJSON<TagType[]>('/api/tags'),
  });

  const create = useMutation({
    mutationFn: (tag: { name: string }) => fetchJSON<TagType>('/api/tags', { method: 'POST', body: JSON.stringify(tag) }),
    onSuccess: () => tagsQuery.refetch(),
  });

  const update = useMutation({
    mutationFn: (tag: { id: string; name: string }) => fetchJSON(`/api/tags/${tag.id}`, { method: 'PUT', body: JSON.stringify(tag) }),
    onSuccess: () => tagsQuery.refetch(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => fetchJSON<TagType>(`/api/tags/${id}`, { method: 'DELETE' }),
    onSuccess: () => tagsQuery.refetch(),
  });

  return {
    tags: tagsQuery.data ?? [],
    isLoading: tagsQuery.isLoading,
    createTag: create.mutateAsync,
    updateTag: update.mutateAsync,
    deleteTag: remove.mutateAsync,
  };
}
