/**
 * Recipe page
 */
'use client';

import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import type { Recipe } from '@/types/recipe';
import { getOneRecipe } from '@/lib/api/recipes';
import { useParams, notFound } from 'next/navigation';
import Tag from '@/components/Tag';

export default function Recipe() {
  const params = useParams();
  const uid = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof uid !== 'string') return;
    getOneRecipe(uid)
      .then(setRecipe)
      .catch(() => setRecipe(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
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
