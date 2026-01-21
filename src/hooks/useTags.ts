'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { TagType, CreateTagInput, UpdateTagInput } from '@/types/tag';

// Generic API helper
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API request failed');
  }

  return res.json() as Promise<T>;
}

// Query Keys
const keys = {
  all: ['tags'] as const,
  one: (id: string) => ['tags', id] as const,
};

export function useTags() {
  return useQuery<TagType[]>({
    queryKey: keys.all,
    queryFn: () => api<TagType[]>('/api/tags'),
    staleTime: 1000 * 5,
  });
}

export function useTag(id?: string) {
  return useQuery<TagType>({
    queryKey: id ? keys.one(id) : ['tags', 'empty'],
    queryFn: () => api<TagType>(`/api/tags/${id}`),
    enabled: !!id,
    staleTime: 1000 * 5,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTagInput) =>
      api<TagType>('/api/tags', {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    onSuccess: (created) => {
      // Update list cache immediately
      queryClient.setQueryData<TagType[]>(keys.all, (old) =>
        old ? [...old, created] : [created]
      );

      // Revalidate list
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useUpdateTag(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateTagInput) =>
      api<TagType>(`/api/tags/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: keys.all });
      await queryClient.cancelQueries({ queryKey: keys.one(id) });

      const prevList = queryClient.getQueryData<TagType[]>(keys.all);
      const prevOne = queryClient.getQueryData<TagType>(keys.one(id));

      // Optimistically update list
      if (prevList) {
        queryClient.setQueryData<TagType[]>(keys.all, (old) =>
          old
            ? old.map((m) => (m.id === id ? { ...m, ...updates } : m))
            : old
        );
      }

      // Optimistically update single
      if (prevOne) {
        queryClient.setQueryData<TagType>(keys.one(id), {
          ...prevOne,
          ...updates,
        });
      }

      return { prevList, prevOne };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevList) {
        queryClient.setQueryData(keys.all, ctx.prevList);
      }
      if (ctx?.prevOne) {
        queryClient.setQueryData(keys.one(id), ctx.prevOne);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      queryClient.invalidateQueries({ queryKey: keys.one(id) });
    },
  });
}

export function useDeleteTag(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api(`/api/tags/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: keys.all });

      const previousList = queryClient.getQueryData<TagType[]>(keys.all);

      // Optimistic remove
      if (previousList) {
        queryClient.setQueryData<TagType[]>(keys.all, (old) =>
          old ? old.filter((m) => m.id !== id) : old
        );
      }

      return { previousList };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousList) {
        queryClient.setQueryData(keys.all, ctx.previousList);
      }
    },

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: keys.one(id) });
    },

    onSettled: () => {
      queryClient.refetchQueries({ queryKey: keys.all });
    },
  });
}
