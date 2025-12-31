'use client';

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { TagType } from '@/types/tag';

export function useTags() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const tagsQuery = useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => fetchJSON<TagType[]>('/api/tags'),
  });

  const create = useMutation({
    mutationFn: (tag: TagType) =>
      fetchJSON<TagType>('/api/tags', {
        method: 'POST',
        body: JSON.stringify(tag),
      }),
    onSuccess: (createdTag: TagType) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
      router.push(`/tags/${createdTag.uid}`);
    },
  });

  const update = useMutation({
    mutationFn: (tag: TagType) =>
      fetchJSON<TagType>(`/api/tags/${tag.id}`, {
        method: 'PUT',
        body: JSON.stringify(tag),
      }),
    onSuccess: (updatedTag: TagType) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
      router.push(`/tags/${updatedTag.uid}`);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      fetchJSON<TagType>(`/api/tags/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }),
    onSuccess: (_data, id) => {
      // remove the deleted tag from the cached list
      queryClient.setQueryData<TagType[]>(queryKeys.tags, (old) =>
        old?.filter((r) => r.uid !== id) ?? []
      );
      router.push('/tags');
    },
  });

  return {
    tags: tagsQuery.data ?? [],
    createTag: create.mutateAsync,
    updateTag: update.mutateAsync,
    deleteTag: remove.mutateAsync,
    isLoadingTags: tagsQuery.isLoading,
    isCreatingTag: create.isPending,
    isUpdatingTag: update.isPending,
    isDeletingTag: remove.isPending,
  };
}
