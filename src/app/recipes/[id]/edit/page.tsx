/**
 * Edit Recipe page
 */
'use client';
import { useParams } from 'next/navigation';
import { useRecipe } from '@/hooks/useRecipe';
import { useUpdateRecipe } from '@/hooks/useUpdateRecipe';

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useRecipe(id);
  const update = useUpdateRecipe(id);

  if (!data) return null;

  return <button onClick={() => update.mutate({ title: 'Updated' })}>Save</button>;
}
