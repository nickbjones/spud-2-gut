'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export function useRecipe(id: string) {
  const query = useQuery({
    queryKey: queryKeys.recipe(id),
    queryFn: () => fetchJSON<RecipeType>(`/api/recipes/${id}`),
    enabled: !!id,
  });

  return {
    recipe: query.data,
    isLoadingRecipe: query.isLoading,
    ...query,
  };
}
