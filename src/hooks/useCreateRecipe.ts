import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RecipeType>) =>
      fetchJSON<RecipeType>('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    onSuccess: (recipe) => {
      // Seed the cache for the detail page
      queryClient.setQueryData(
        queryKeys.recipe(recipe.id),
        recipe,
      );

      // Refresh the list page eventually
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes,
      });
    },
  });
}
