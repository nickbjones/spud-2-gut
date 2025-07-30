/**
 * Recipes page
 */
'use client';

import { useEffect, useState } from 'react';
import type { RecipeType } from '@/types/recipe';
import { TagType } from '@/types/tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import RecipeCard from '@/components/RecipeCard';

export default function Recipes() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      if (!res.ok) throw new Error('Failed to fetch recipes.');
      const recipeData: RecipeType[] = await res.json();
      setRecipes(recipeData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`/api/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const tagData: TagType[] = await res.json();
      setTags(tagData);
    } catch (err) {
      setTags([]);
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchTags();
  }, []);

  if (loading) return <LoadingMessage />;
  if (recipes.length < 1) return <ErrorMessage text="No recipes!" />;
  if (error) return <ErrorMessage text={error} />;

  recipes.sort((a, b) => a.title.localeCompare(b.uid));

  return (
    <div className="p-3 sm:p-6">
      {/* add search here... */}
      {recipes.length > 0 &&
        <ul>
          {recipes.map((recipe: RecipeType) => (
            <RecipeCard key={recipe.id} recipe={recipe} tags={tags} />
          ))}
        </ul>
      }
    </div>
  );
}
