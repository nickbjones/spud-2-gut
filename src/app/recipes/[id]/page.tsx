/**
 * Recipe page
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import Md from '@/components/Markdown';
import { useParams, notFound } from 'next/navigation';
import Tag, { selectedTagStyles } from '@/components/Tag';
import type { Tag as TagType } from '@/types/tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import SharedLink from '@/components/SharedLink';

export default function Recipe() {
  const params = useParams();
  const uid = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [tags, setTags] = useState<TagType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error('Failed to fetch recipe.');
      const recipeData: Recipe = await res.json();
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

  const getTitleByUid = (uid: string | null | undefined): string => {
    if (!tags || !uid) return '';
    return tags.find(tag => tag.uid === uid)?.title || uid;
  };

  useEffect(() => {
    fetchRecipe();
    fetchTags();
  }, [uid, fetchRecipe, fetchTags]);

  if (loading) return <LoadingMessage />;
  if (!recipe) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-0 sm:p-6">
      <SharedHeading text={recipe.title} styles="inline-block mt-4 px-3 sm:px-0" />
      <SharedLink href={`${recipe.uid}/edit`} text="[Edit]" styles="float-right mt-6 mr-3 text-sm" />
      {recipe.tags.length > 0 &&
        <div className="h-8 sm:h-10 mt-0 sm:mt-2 px-3 sm:px-0 pt-0 sm:pt-2 overflow-x-auto whitespace-nowrap no-scrollbar">
          {recipe.tags.map((uid: string) => (
            <Tag key={uid} uid={uid} text={getTitleByUid(uid)} className={selectedTagStyles} />
          ))}
        </div>
      }
      <div className={recipe.ingredients && recipe.instructions && `grid grid-cols-2 gap-3 sm:gap-4`}>
        {!recipe.ingredients && !recipe.instructions ? (
          <SharedLink href={`${recipe.uid}/edit`} text="Add content →" styles="mx-3 sm:mx-0" />
        ) : (
          <>
            <div className="my-2 sm:my-4 mx-0">
              {recipe.ingredients ? (
                <Md className="px-3 py-1 bg-gray-100">{recipe.ingredients}</Md>
              ) : (
                <SharedLink href={`${recipe.uid}/edit?focus=ingredients`} text="Add ingredients →" styles="mx-3 sm:mx-0" />
              )}
            </div>
            <div className={`my-2 sm:my-4 ${!recipe.ingredients ? 'ml-3' : 'ml-0'} mr-1 sm:mx-0`}>
              {recipe.instructions ? (
                <Md className="py-0">{recipe.instructions}</Md>
              ) : (
                <SharedLink href={`${recipe.uid}/edit?focus=instructions`} text="Add instructions →" styles="mx-3 sm:mx-0" />
              )}
            </div>
          </>
        )}
      </div>
      {recipe.description && (
        <div className="mt-4 px-3 sm:px-0">
          <SharedHeading type="h3" text="More info" />
          <Md className="max-w-full">{recipe.description}</Md>
        </div>
      )}
      {recipe.reference && (
        <div className="mt-4 px-3 sm:px-0">
          <SharedHeading type="h3" text="Reference" />
          <SharedLink href={recipe.reference} text={recipe.reference} />
        </div>
      )}
    </div>
  );
}
