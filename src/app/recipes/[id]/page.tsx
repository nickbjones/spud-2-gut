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
import { getTitleByUid } from '@/lib/utils/helpers';

export default function Recipe() {
  const params = useParams();
  const uid = params.id as string;
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error('Failed to fetch recipe.');
      const recipeData: RecipeType = await res.json();
      setRecipe(recipeData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
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
    }
  }, []);

  useEffect(() => {
    fetchRecipe();
    fetchTags();
  }, [uid, fetchRecipe, fetchTags]);

  if (loading) return <LoadingMessage />;
  if (!recipe) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-0 sm:p-6">
      <div className="flex justify-between items-center my-3 px-3 sm:px-0">
        <SharedHeading text={recipe.title} styles="!my-0" />
        <SharedLink href={`${recipe.uid}/edit`} text="[Edit]" styles="text-sm" />
      </div>
      {recipe.tags.length > 0 &&
        <div className="tags h-8 sm:h-10 mt-0 sm:mt-2 px-3 sm:px-0 pt-0 sm:pt-2 overflow-x-auto whitespace-nowrap no-scrollbar">
          {recipe.tags.map((uid: string) => (
            <Tag key={uid} uid={uid} text={getTitleByUid(uid, tags)} className={selectedTagStyles} />
          ))}
        </div>
      }
      {(recipe.ingredients || recipe.instructions) && (
        <div className={recipe.ingredients && recipe.instructions && `grid grid-cols-2 gap-3 sm:gap-4`}>
          {recipe.ingredients && (
            <div className="ingredients my-2 sm:my-4 mx-0">
              <Md className="px-3 py-1 bg-gray-100">{recipe.ingredients}</Md>
            </div>
          )}
          {recipe.instructions && (
            <div className={`instructions my-2 sm:my-4 ${!recipe.ingredients ? 'ml-3' : 'ml-0'} mr-1 sm:mx-0`}>
              <Md className="py-0">{recipe.instructions}</Md>
            </div>
          )}
        </div>
      )}
      {recipe.description && (
        <div className="description mt-4 px-3 sm:px-0">
          <Md className="max-w-full">{recipe.description}</Md>
        </div>
      )}
      {recipe.reference && (
        <div className="reference mt-4 px-3 sm:px-0">
          <SharedLink href={recipe.reference} text={recipe.reference} />
        </div>
      )}
      {(!recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference) && (
        <SharedLink href={`${recipe.uid}/edit`} text="Add content →" styles="mx-3 sm:mx-0" />
      )}
    </div>
  );
}
