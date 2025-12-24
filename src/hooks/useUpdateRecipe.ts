import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export function useUpdateRecipe(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RecipeType>) =>
      fetchJSON<RecipeType>(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.recipe(id) });
      qc.invalidateQueries({ queryKey: queryKeys.recipes });
    },
  });
}
