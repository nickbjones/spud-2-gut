/*
'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/fetchJSON';
import { queryKeys } from '@/lib/queryKeys';
import { RecipeType } from '@/types/recipe';

export default function EditRecipeClient({ uid }: { uid: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await fetchJSON(`/api/recipes/${uid}`, {
        method: 'DELETE',
      });
    },

    onSuccess: () => {
      // 1️⃣ Remove single-recipe cache
      queryClient.removeQueries({
        queryKey: queryKeys.recipe(uid),
      });

      // 2️⃣ Remove from list cache if present
      queryClient.setQueryData(
        queryKeys.recipes,
        (old: RecipeType[] | undefined) =>
          old?.filter((r) => r.uid !== uid)
      );

      // 3️⃣ Navigate away (important!)
      router.push('/recipes');
    },
  });
}
*/

/**
 * Edit Recipe client page
 */
'use client';

import { useEditRecipe } from '@/hooks/useEditRecipe';

export default function EditRecipeClientPage({ uid }: { uid: string }) {
  const {
    recipe,
    updateRecipe,
    deleteRecipe,
    isSaving,
    isDeleting,
  } = useEditRecipe(uid);

  if (!recipe) return null;

  const mockData = { ...recipe, title: 'some new title beeotch!!!' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecipe(mockData);
  };

  const handleDelete = () => {
    // if (confirm('Delete this recipe?')) {
      deleteRecipe();
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Recipe</h1>
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
      <button type="submit" disabled={isSaving}>Save</button>
      <button type="button" onClick={handleDelete} disabled={isDeleting}>Delete</button>
    </form>
  );
}
