/**
 * Tag page
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import { useParams, notFound } from 'next/navigation';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import RecipeCard from '@/components/RecipeCard';
import { getRecipesByTag } from '@/lib/utils/helpers';

const tagTitleStyles = `
  !my-0
  py-2
  px-4
  text-white
  bg-blue-400
  rounded-xl
`;

// TODO: rename all other page components to have "Page" in the name
export default function TagPage() {
  const params = useParams();
  const uid = params.id as string;
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [tag, setTag] = useState<TagType | null>(null);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRecipes = useCallback(async () => {
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
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`/api/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const tagData: TagType[] = await res.json();
      setTags(tagData);
    } catch (err) {
      setTags([]);
      setError((err as Error).message);
    }
  }, []);

  const fetchTag = useCallback(async () => {
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
  }, [uid]);

  useEffect(() => {
    fetchRecipes();
    fetchTags();
    fetchTag();
  }, [uid, fetchRecipes, fetchTags, fetchTag]);

  if (loadingTags || loadingRecipes) return <LoadingMessage />;
  if (!tag) return notFound();
  if (error) return <ErrorMessage text={error} />;

  const recipesWithThisTag = getRecipesByTag(recipes, uid);

  return (
    <div className="p-3 sm:p-6">
      <div className="flex justify-between items-center my-3">
        <SharedHeading text={tag.title} styles={tagTitleStyles} />
        <SharedLink href={`${tag.uid}/edit`} text="[Edit]" styles="text-sm" />
      </div>
      <p>{tag.description}</p>
      <div className="mt-4">
        <p className="mb-2">{recipesWithThisTag.length > 0 ? 'Recipes with this tag:' : 'No recipes with this tag'}</p>
        {recipesWithThisTag.length > 0 &&
          <ul>
            {recipesWithThisTag.map((recipe: RecipeType) => (
              <RecipeCard key={recipe.id} recipe={recipe} tags={tags} />
            ))}
          </ul>
        }
      </div>
    </div>
  );
}
