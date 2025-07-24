/**
 * Recipe page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import Md from '@/components/Markdown';
import { useParams, notFound } from 'next/navigation';
import Tag from '@/components/Tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import SharedLink from '@/components/SharedLink';
import SharedButton from '@/components/SharedButton';

export default function Recipe() {
  const params = useParams();
  const uid = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // TODO: clean up
    const fetchRecipe = async () => {
      try {
        // TODO: use a custom hook for fetching data
        // TODO: use id instead of uid
        const res = await fetch(`/api/recipes/${encodeURIComponent(uid)}`);
        if (!res.ok) throw new Error('Failed to fetch recipe');
        const recipeData: Recipe = await res.json();
        setRecipe(recipeData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [uid]);

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
        <div className="overflow-x-auto whitespace-nowrap h-10 mt-4 pt-2">
          {recipe.tags.map((uid: string) => (
            <Tag key={uid} uid={uid} text={uid} />
          ))}
        </div>
      }
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="mt-4 mb-4">
          <SharedHeading type="h3" text="Ingredients" />
          {recipe.ingredients ? (
            <Md>{recipe.ingredients}</Md>
          ) : (
            <>
              <p className="mb-2">No ingredients yet!</p>
              <SharedButton href={`${recipe.uid}/edit`} text="Add ingredients" styles="text-sm" />
            </>
          )}
        </div>
        <div className="mt-4 mb-4">
          <SharedHeading type="h3" text="Instructions" />
          {recipe.instructions ? (
            <Md>{recipe.instructions}</Md>
          ) : (
            <>
              <p className="mb-2">No instructions yet!</p>
              <SharedButton href={`${recipe.uid}/edit`} text="Add instructions" styles="text-sm" />
            </>
          )}
        </div>
      </div>
      {recipe.description && (
        <div className="mt-4">
          <SharedHeading type="h3" text="Description" />
          <Md className="max-w-full">{recipe.description}</Md>
        </div>
      )}
      {recipe.reference && (
        <div className="mt-4">
          <SharedHeading type="h3" text="Reference" />
          <SharedLink href={recipe.reference} text={recipe.reference} />
        </div>
      )}
      <div className="mt-8">
        <SharedLink href={`${recipe.uid}/edit`} text="Edit" styles="text-sm" />
        &nbsp;|&nbsp;
        <SharedLink text="Delete" styles="text-sm text-red-800 hover:text-red-400" onClick={confirmDeletion} />
      </div>
    </div>
  );
}
