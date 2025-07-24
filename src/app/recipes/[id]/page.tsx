/**
 * Recipe page
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import Md from '@/components/Markdown';
import { useParams, notFound } from 'next/navigation';
import Tag, { selectedTagStyles } from '@/components/Tag';
// TODO: globally rename type Tag to TagType
import type { Tag as TagType } from '@/types/tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import SharedLink from '@/components/SharedLink';
import SharedButton from '@/components/SharedButton';

export default function Recipe() {
  const params = useParams();
  const uid = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [tags, setTags] = useState<TagType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRecipe = useCallback(async () => {
    // TODO: use a custom hook for fetching data
    // TODO: use id instead of uid
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error('Failed to fetch recipe');
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
      setError(`Failed to load tags. ${(err as Error).message}`);
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

  const confirmDeletion = () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe();
    }
  };

  const deleteRecipe = async () => {
    try {
      if (!recipe) throw new Error('Recipe not found');

      const res = await fetch(`/api/recipes/${encodeURIComponent(recipe.id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete recipe');
      };

      // Redirect to recipes list after deletion
      window.location.href = '/recipes';
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <LoadingMessage />;
  if (!recipe) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-3 sm:p-6">
      <SharedHeading text={recipe.title} styles="mt-4" />
      {recipe.tags.length > 0 &&
        <div className="overflow-x-auto whitespace-nowrap h-8 mt-0 pt-0 sm:h-10 sm:mt-2 sm:pt-2">
          {recipe.tags.map((uid: string) => (
            <Tag key={uid} uid={uid} text={getTitleByUid(uid)} className={selectedTagStyles} />
          ))}
        </div>
      }
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="mt-4 mb-4">
          {/* <SharedHeading type="h3" text="Ingredients" /> */}
          {recipe.ingredients ? (
            <Md>{recipe.ingredients}</Md>
          ) : (
            <>
              <p className="mb-2">No ingredients yet!</p>
              <SharedButton href={`${recipe.uid}/edit?focus=ingredients`} text="Add ingredients" styles="text-sm" />
            </>
          )}
        </div>
        <div className="mt-4 mb-4">
          {/* <SharedHeading type="h3" text="Instructions" /> */}
          {recipe.instructions ? (
            <Md>{recipe.instructions}</Md>
          ) : (
            <>
              <p className="mb-2">No instructions yet!</p>
              <SharedButton href={`${recipe.uid}/edit?focus=instructions`} text="Add instructions" styles="text-sm" />
            </>
          )}
        </div>
      </div>
      {recipe.description && (
        <div className="mt-4">
          <SharedHeading type="h3" text="More info" />
          <Md className="max-w-full">{recipe.description}</Md>
        </div>
      )}
      {recipe.reference && (
        <div className="mt-4">
          <SharedHeading type="h3" text="Reference" />
          <SharedLink href={recipe.reference} text={recipe.reference} />
        </div>
      )}
      <div className="flex flex-col justify-center items-center mt-10">
        <SharedButton href={`${recipe.uid}/edit`} text="Edit recipe" />
        <SharedLink text="Delete recipe" styles="mt-3 text-red-800 hover:text-red-400" onClick={confirmDeletion} />
      </div>
    </div>
  );
}
