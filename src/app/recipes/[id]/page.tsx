/**
 * Recipe page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import Markdown from 'react-markdown';
import { useParams, notFound } from 'next/navigation';
import Tag from '@/components/Tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';

export default function Recipe() {
  const params = useParams();
  const uid = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    // TODO: clean up
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${uid}`);
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

  if (loading) return <LoadingMessage />;
  if (!recipe) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-6">
      <Link
        href="/recipes"
        className="text-blue-800 hover:text-blue-400"
      >⇽ Recipes</Link>
      <h1 className="text-3xl mt-4 font-bold">{recipe.title}</h1>
      <div className="mt-4">
        {recipe.tags.map((tag: string) => <Tag tag={tag} key={tag} />)}
      </div>
      <div className="mt-4">
        <h2>Description</h2>
        <Markdown>{recipe.description}</Markdown>
      </div>
      <div className="mt-4">
        <h2>Ingredients</h2>
        <Markdown>{recipe.ingredients}</Markdown>
      </div>
      <div className="mt-4">
        <h2>Instructions</h2>
        <Markdown>{recipe.instructions}</Markdown>
      </div>
      <div className="mt-4">
        <span>Reference: </span><a href={recipe.reference}>{recipe.reference}</a>
      </div>
    </div>
  );
}
