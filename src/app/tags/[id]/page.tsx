/**
 * Tag page
 */
'use client';

import { useEffect, useState } from 'react';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import { useParams, notFound } from 'next/navigation';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';

function getRecipesByTag(recipes: RecipeType[], tag: string) {
  return recipes.filter((recipe) => recipe.tags.includes(tag));
}
  
export default function Tag() {
  const params = useParams();
  const uid = params.id as string;
  const [tag, setTag] = useState<TagType | null>(null);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const res = await fetch(`/api/tags/${encodeURIComponent(uid)}`);
        if (!res.ok) throw new Error('Failed to fetch tag');
        const tagData: TagType = await res.json();
        setTag(tagData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoadingTags(false);
      }
    };
  
    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/recipes');
        if (!res.ok) throw new Error('Failed to fetch recipes.');
        const recipeData: RecipeType[] = await res.json();
        setRecipes(recipeData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchTag();
    fetchRecipes();
  }, [uid]);

  if (loadingTags || loadingRecipes) return <LoadingMessage />;
  if (!tag) return notFound();
  if (error) return <ErrorMessage text={error} />;

  const filteredRecipes = getRecipesByTag(recipes, uid);

  return (
    <div className="p-6">
      <SharedHeading text={tag.title} />
      <div className="mt-4">
        <p className="mb-3">Recipes with the tag &quot;{tag.title}&quot;:</p>
        <ul>
          {filteredRecipes && filteredRecipes.map((recipe) => (
            <li key={recipe.id} className="flex my-2">
              <SharedLink key={recipe.id} href={`/recipes/${recipe.uid}`} text={recipe.title} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
