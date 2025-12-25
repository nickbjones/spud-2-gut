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
    if (confirm('Delete this recipe?')) {
      deleteRecipe();
    }
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
