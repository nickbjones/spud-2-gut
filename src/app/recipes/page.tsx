/**
 * Recipes page
 */
'use client';

import { useEffect, useState } from 'react';
import type { RecipeType } from '@/types/recipe';
import { TagType } from '@/types/tag';
import { getTitleByUid } from '@/lib/utils/helpers';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import { miniTagStyles } from '@/components/Tag';

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
      {/* search... */}
      {recipes.length > 0 &&
        <ul>
          {recipes.map((recipe: RecipeType) => (
            <li key={recipe.id} className="mb-2 sm:mb-3 border rounded-lg shadow-lg">
              <a href={`/recipes/${recipe.uid}`} className="block py-2 pl-3 pr-10 relative">
                <span className="text-base font-semibold">{recipe.title}</span>
                {recipe.tags.length > 0 &&
                  <div className="flex gap-1 flex-wrap mt-1">
                    {recipe.tags.map((uid: string) => (
                      <span key={uid} className={miniTagStyles}>{getTitleByUid(uid, tags)}</span>
                    ))}
                  </div>
                }
                <span className="absolute top-0 right-0 h-full w-10 bg-white rounded-r-lg">
                  <span className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">＞</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
