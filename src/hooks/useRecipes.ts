'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { RecipeType, CreateRecipeInput, UpdateRecipeInput } from '@/types/recipe';

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
  all: ['recipes'] as const,
  one: (id: string) => ['recipes', id] as const,
};

export function useRecipes() {
  return useQuery<RecipeType[]>({
    queryKey: keys.all,
    queryFn: () => api<RecipeType[]>('/api/recipes'),
    staleTime: 1000 * 5,
  });
}

export function useRecipe(id?: string) {
  return useQuery<RecipeType>({
    queryKey: id ? keys.one(id) : ['recipes', 'empty'],
    queryFn: () => api<RecipeType>(`/api/recipes/${id}`),
    enabled: !!id,
    staleTime: 1000 * 5,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRecipeInput) =>
      api<RecipeType>('/api/recipes', {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    onSuccess: (created) => {
      // Update list cache immediately
      queryClient.setQueryData<RecipeType[]>(keys.all, (old) =>
        old ? [...old, created] : [created]
      );

      // Revalidate list
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useUpdateRecipe(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateRecipeInput) =>
      api<RecipeType>(`/api/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: keys.all });
      await queryClient.cancelQueries({ queryKey: keys.one(id) });

      const prevList = queryClient.getQueryData<RecipeType[]>(keys.all);
      const prevOne = queryClient.getQueryData<RecipeType>(keys.one(id));

      // Optimistically update list
      if (prevList) {
        queryClient.setQueryData<RecipeType[]>(keys.all, (old) =>
          old
            ? old.map((m) => (m.id === id ? { ...m, ...updates } : m))
            : old
        );
      }

      // Optimistically update single
      if (prevOne) {
        queryClient.setQueryData<RecipeType>(keys.one(id), {
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

export function useDeleteRecipe(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api(`/api/recipes/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: keys.all });

      const previousList = queryClient.getQueryData<RecipeType[]>(keys.all);

      // Optimistic remove
      if (previousList) {
        queryClient.setQueryData<RecipeType[]>(keys.all, (old) =>
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
