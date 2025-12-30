'use client';

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export function useRecipes() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const recipesQuery = useQuery({
    queryKey: queryKeys.recipes,
    queryFn: () => fetchJSON<RecipeType[]>('/api/recipes'),
  });

  const create = useMutation({
    mutationFn: (recipe: RecipeType) =>
      fetchJSON<RecipeType>('/api/recipes', {
        method: 'POST',
        body: JSON.stringify(recipe),
      }),
    onSuccess: (createdRecipe: RecipeType) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes });
      router.push(`/recipes/${createdRecipe.uid}`);
    },
  });

  const update = useMutation({
    mutationFn: (recipe: RecipeType) =>
      fetchJSON<RecipeType>(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        body: JSON.stringify(recipe),
      }),
    onSuccess: (updatedRecipe: RecipeType) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes });
      router.push(`/recipes/${updatedRecipe.uid}`);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      fetchJSON<RecipeType>(`/api/recipes/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }),
    onSuccess: (_data, id) => {
      // remove the deleted recipe from the cached list
      queryClient.setQueryData<RecipeType[]>(queryKeys.recipes, (old) =>
        old?.filter((r) => r.uid !== id) ?? []
      );
      router.push('/recipes');
    },
  });

  return {
    recipes: recipesQuery.data ?? [],
    createRecipe: create.mutateAsync,
    updateRecipe: update.mutateAsync,
    deleteRecipe: remove.mutateAsync,
    isLoadingRecipes: recipesQuery.isLoading,
    isCreatingRecipe: create.isPending,
    isUpdatingRecipe: update.isPending,
    isDeletingRecipe: remove.isPending,
  };
}
