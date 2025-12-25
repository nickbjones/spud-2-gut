/**
 * Recipes client page
 */
'use client';

import { useRecipes } from '@/hooks/useRecipes';

export default function RecipesClientPage() {
  const { data } = useRecipes();

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
