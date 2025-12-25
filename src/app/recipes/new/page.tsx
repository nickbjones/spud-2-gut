/**
 * New Recipe page
 */
'use client';

import { useCreateRecipe } from '@/hooks/useCreateRecipe';

export default function NewRecipePage() {
  const { createRecipe, isCreating } = useCreateRecipe();

  const id = '0840';
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createRecipe(mockData);
  }

  return (
    <div className="max-w-5xl mx-auto py-4 px-3 sm:px-6">
      <p>Data to save:</p>
      <pre className="mb-5">{JSON.stringify(mockData, null, 2)}</pre>
      <button
        className="bg-blue-500 text-white py-1 px-2 rounded"
        onClick={handleSubmit}
        disabled={isCreating}
      >
        {isCreating ? 'Creating…' : 'Create'}
      </button>
    </div>
  );
}
