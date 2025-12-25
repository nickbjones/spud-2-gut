'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export function useEditRecipe(uid: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: recipe } = useQuery<RecipeType>({
    queryKey: queryKeys.recipe(uid),
    queryFn: () => fetchJSON<RecipeType>(`/api/recipes/${uid}`),
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<RecipeType>) =>
      fetchJSON(`/api/recipes/${uid}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    onMutate: async (updates) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.recipe(uid),
      });

      const previousRecipe = queryClient.getQueryData<RecipeType>(
        queryKeys.recipe(uid)
      );

      queryClient.setQueryData(
        queryKeys.recipe(uid),
        (old: RecipeType | undefined) =>
          old ? { ...old, ...updates } : old
      );

      queryClient.setQueryData(
        queryKeys.recipes,
        (old: RecipeType[] | undefined) =>
          old?.map((r) =>
            r.uid === uid ? { ...r, ...updates } : r
          )
      );

      return { previousRecipe };
    },

    onError: (_err, _updates, context) => {
      if (context?.previousRecipe) {
        queryClient.setQueryData(
          queryKeys.recipe(uid),
          context.previousRecipe
        );
      }
    },

    onSuccess: (updatedRecipe) => {
      queryClient.setQueryData(
        queryKeys.recipe(uid),
        updatedRecipe
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await fetchJSON(`/api/recipes/${recipe?.id}`, {
        method: 'DELETE',
      });
    },

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: queryKeys.recipe(uid),
      });

      queryClient.setQueryData(
        queryKeys.recipes,
        (old: RecipeType[] | undefined) =>
          old?.filter((r) => r.uid !== uid)
      );

      router.push('/recipes');
    },
  });

  return {
    recipe,
    updateRecipe: updateMutation.mutate,
    deleteRecipe: deleteMutation.mutate,
    isSaving: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
