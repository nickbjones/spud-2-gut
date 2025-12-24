/**
 * Recipes page
 */
'use client';
import { useRecipes } from '@/hooks/useRecipes';

export default function RecipesPage() {
  const { data, isLoading } = useRecipes();
  if (isLoading) return null;
  return (
    <ul>
      {data?.map(r => (
        <li key={r.id}>
          <a href={`/recipes/${r.uid}`}>{r.title}</a>
        </li>
      ))}
    </ul>
  );
}
