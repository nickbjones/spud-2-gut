/**
 * New Recipe page
 */
'use client';
import { useCreateRecipe } from '@/hooks/useCreateRecipe';
import { useRouter } from 'next/navigation';

export default function NewRecipePage() {
  const router = useRouter();
  const create = useCreateRecipe();

  async function submit() {
    const recipe = await create.mutateAsync({ title: 'New Recipe' });
    router.push(`/recipes/${recipe.id}`);
  }

  return <button onClick={submit}>Create</button>;
}
