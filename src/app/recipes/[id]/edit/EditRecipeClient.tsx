/**
 * Edit Recipe client page
 */
'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export default function EditRecipeClient({ uid }: { uid: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  console.log('EditRecipeClient uid:', uid);
  // return <>EditRecipeClient</>;

  const { data: recipe } = useQuery<RecipeType>({
    queryKey: queryKeys.recipe(uid),
    queryFn: () => fetchJSON(`/api/recipes/${uid}`),
  });

  const updateRecipe = useMutation({
    mutationFn: (updates: Partial<RecipeType>) =>
      fetchJSON(`/api/recipes/${uid}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    onSuccess: (updatedRecipe) => {
      // update recipe cache
      queryClient.setQueryData(
        queryKeys.recipe(uid),
        updatedRecipe
      );

      // update list cache if it exists
      queryClient.setQueryData(
        queryKeys.recipes,
        (old: RecipeType[] | undefined) =>
          old?.map((r) => (r.uid === uid ? updatedRecipe : r))
      );

      router.push(`/recipes/${uid}`);
    },
  });

  if (!recipe) return null; // should almost never happen due to SSR

  const mockData = { ...recipe, title: 'some new title beeotch!!!' };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateRecipe.mutate(mockData);
      }}
    >
      <h1>Edit Recipe</h1>
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
      <button type="submit">Save</button>
    </form>
  );
}
