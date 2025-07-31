/**
 * Recipe page
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { RecipeType } from '@/types/recipe';
import Md from '@/components/Markdown';
import { useParams, notFound } from 'next/navigation';
import Tag, { selectedTagStyles } from '@/components/Tag';
import type { TagType } from '@/types/tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import SharedLink from '@/components/SharedLink';
import { getRecipesByTag, getTitleByUid } from '@/lib/utils/helpers';

export default function Recipe() {
  const params = useParams();
  const uid = params.id as string;

  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loadingRecipe, setLoadingRecipe] = useState<boolean>(true);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(true);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
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

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error('Failed to fetch recipe.');
      const recipeData: RecipeType = await res.json();
      setRecipe(recipeData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingRecipe(false);
    }
  }, [uid]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`/api/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const tagData: TagType[] = await res.json();
      setTags(tagData);
    } catch (err) {
      setTags([]);
      setError((err as Error).message);
    } finally {
      setLoadingTags(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipe();
    fetchRecipes();
    fetchTags();
  }, [uid, fetchRecipe, fetchRecipes, fetchTags]);

  if (loadingRecipe || loadingRecipes || loadingTags) return <LoadingMessage />;
  if (!recipe) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-3 sm:p-6">
      <div className="flex justify-between items-center my-3">
        <SharedHeading text={recipe.title} styles="!my-0" />
        <SharedLink href={`${recipe.uid}/edit`} text="[Edit]" styles="text-sm" />
      </div>
      {/* tags list */}
      {recipe.tags.length > 0 &&
        <div className="flex flex-wrap mt-3 gap-1 sm:gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
          {recipe.tags.map((uid: string) => {
            const recipesWithThisTag = getRecipesByTag(recipes, uid).length;
            return (
              <Tag key={uid} uid={uid} className={`${selectedTagStyles} !mr-0`}>
                <span className="block">{getTitleByUid(uid, tags)}</span>
                <span className="block text-[8px]/[8px]">({recipesWithThisTag} receipes)</span>
              </Tag>
            )
          })}
        </div>
      }
      {(recipe.ingredients || recipe.instructions) && (
        <div className={recipe.ingredients && recipe.instructions && `sm:grid grid-cols-2 gap-6 mt-0 sm:mt-2`}>
          {recipe.ingredients && (
            <div className="ingredients mt-4 sm:mt-0 -mx-3 sm:mx-0">
              <div className="mt-2 sm:mt-4 px-3 py-1 bg-gray-100">
                <Md>{recipe.ingredients}</Md>
              </div>
            </div>
          )}
          {recipe.instructions && (
            <div className={`instructions mt-6 sm:mt-1 mb-2 sm:mb-4 mr-1 sm:mx-0`}>
              <Md>{recipe.instructions}</Md>
            </div>
          )}
        </div>
      )}
      {recipe.description && (
        <div className="description mt-6">
          <Md className="max-w-full">{recipe.description}</Md>
        </div>
      )}
      {recipe.reference && (
        <div className="reference mt-6 break-all">
          <SharedLink href={recipe.reference} text={recipe.reference} />
        </div>
      )}
      {(!recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference) && (
        <SharedLink href={`${recipe.uid}/edit`} text="Add content →" styles="block mt-8" />
      )}
    </div>
  );
}
