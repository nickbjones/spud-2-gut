'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export function useCreateRecipe() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Partial<RecipeType>) =>
      fetchJSON<RecipeType>('/api/recipes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    // optimistic insert
    onMutate: async (newRecipe) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.recipes,
      });

      const previousRecipes =
        queryClient.getQueryData<RecipeType[]>(
          queryKeys.recipes
        );

      const tempId = `temp-${crypto.randomUUID()}`;

      const optimisticRecipe: RecipeType = {
        ...(newRecipe as RecipeType),
        uid: tempId,
      };

      queryClient.setQueryData(
        queryKeys.recipes,
        (old: RecipeType[] | undefined) =>
          old ? [optimisticRecipe, ...old] : [optimisticRecipe]
      );

      return { previousRecipes, tempId };
    },

    // rollback
    onError: (_err, _vars, context) => {
      if (context?.previousRecipes) {
        queryClient.setQueryData(
          queryKeys.recipes,
          context.previousRecipes
        );
      }
    },

    // replace temp with real
    onSuccess: (createdRecipe: RecipeType, _vars, context) => {
      queryClient.setQueryData(
        queryKeys.recipes,
        (old: RecipeType[] | undefined) =>
          old?.map((r) =>
            r.uid === context?.tempId ? createdRecipe : r
          )
      );

      // seed single-recipe cache
      queryClient.setQueryData(
        queryKeys.recipe(createdRecipe.uid),
        createdRecipe
      );

      router.push(`/recipes/${createdRecipe.uid}`);
    },
  });

  return {
    createRecipe: mutation.mutate,
    isCreating: mutation.isPending,
  };
}
