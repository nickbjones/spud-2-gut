/**
 * Recipes page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import SharedButton from '@/components/SharedButton';
import SharedLink from '@/components/SharedLink';
import SharedHeading from '@/components/SharedHeading';
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
      <SharedHeading text="Recipes" />
      <ul>
        {recipes.map((recipe: Recipe) => (
          <li key={recipe.id} className="flex my-2">
            <SharedLink href={`recipes/${recipe.uid}`} text={recipe.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
