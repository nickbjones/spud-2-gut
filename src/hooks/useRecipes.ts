import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export function useRecipes() {
  return useQuery({
    queryKey: queryKeys.recipes,
    queryFn: () => fetchJSON<RecipeType[]>('/api/recipes'),
  });
}
