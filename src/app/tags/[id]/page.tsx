/**
 * Tag page
 */
'use client';

import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import type { Recipe, Tag } from '@/types/types';
import { getOneTag, getAllRecipes } from '@/lib/fetchData';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';

function getRecipesByTag(recipes: Recipe[], tag: string) {
  // const filteredRecipes: Recipe[] | undefined = recipes.filter((recipe) => recipe.tags.includes(tag));
  // if (!filteredRecipes) return null;
  // return recipes;
  return recipes.filter((recipe) => recipe.tags.includes(tag));
}
  
export default function Tag() {
  const params = useParams();
  const uid = params.id as string;
  const [tag, setTag] = useState<Tag | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    getOneTag(uid)
      .then(setTag)
      .catch(() => setTag(null))
      .finally(() => setLoading(false));
  }, [uid]);

  useEffect(() => {
    if (!tag) return;
    getAllRecipes()
      .then(setRecipes)
      .catch(() => setRecipes([]));
  }, [tag]);

  if (loading) return <p>Loading...</p>;
  if (!tag) return notFound();

  const filteredRecipes = getRecipesByTag(recipes, uid);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{tag.title}</h1>
      <div className="mt-4">
        <Markdown>{tag.description}</Markdown>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">{tag.title} recipes</h2>
        <div>{filteredRecipes && filteredRecipes.map((recipe) => (
          <Link key={recipe.id} className="bg-gray-800 text-white space-x-4 m-1 p-1" href={`/recipes/${recipe.uid}`}>{recipe.uid}</Link>
        ))}</div>
      </div>
    </div>
  );
}
