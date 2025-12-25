/**
 * New Recipe page
 */
'use client';
import { useCreateRecipe } from '@/hooks/useCreateRecipe';
import { useRouter } from 'next/navigation';

export default function NewRecipePage() {
  const router = useRouter();
  const createRecipe = useCreateRecipe();

  const id = '0839';
  const mockData = {
    id: `RECIPE#${id}`,
    title: `new ${id}`,
    uid: `new-${id}`,
    tags: [],
    date: '2025-12-24',
    description: '',
    ingredients: '',
    instructions: '',
    reference: '',
    isPinned: false,
    cookCount: ''
  };

  async function handleSubmit() {
    try {
      const recipe = await createRecipe.mutateAsync(mockData);
      router.push(`/recipes/${recipe.uid}`); // cache is primed; navigate immediately
    } catch {
      alert('Failed to create recipe'); // handle error appropriately
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-4 px-3 sm:px-6">
      <p>Data to save:</p>
      <pre className="mb-5">{JSON.stringify(mockData, null, 2)}</pre>
      <button
        className="bg-blue-500 text-white py-1 px-2 rounded"
        onClick={handleSubmit}
        disabled={createRecipe.isPending}
      >
        {createRecipe.isPending ? 'Creating…' : 'Create'}
      </button>
    </div>
  );
}
