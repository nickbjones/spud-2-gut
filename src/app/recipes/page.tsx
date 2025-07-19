/**
 * Recipes page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import Link from 'next/link';
import CustomLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      if (!res.ok) throw new Error('Failed to fetch recipes');
      const recipeData: Recipe[] = await res.json();
      setRecipes(recipeData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) return <LoadingMessage />;
  if (recipes.length < 1) return <p>No recipes!</p>;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-6">
      {/* change to shared button */}
      <Link href="/recipes/new" className="float-right px-3 py-2 text-white rounded-md transition bg-blue-500 hover:bg-blue-400">+ New Recipe</Link>
      <h1 className="text-3xl font-bold">Recipes</h1>
      <ul>
        {recipes.map((recipe: Recipe) => (
          <li key={recipe.id} className="my-2">
            <CustomLink href={`recipes/${recipe.uid}`} text={recipe.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
