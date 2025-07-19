/**
 * Tag page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import type { Tag } from '@/types/tag';
import Markdown from 'react-markdown';
import { useParams, notFound } from 'next/navigation';
import CustomLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';

function getRecipesByTag(recipes: Recipe[], tag: string) {
  return recipes.filter((recipe) => recipe.tags.includes(tag));
}
  
export default function Tag() {
  const params = useParams();
  const uid = params.id as string;
  const [tag, setTag] = useState<Tag | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const res = await fetch(`/api/tags/${uid}`);
        if (!res.ok) throw new Error('Failed to fetch recipe');
        const tagData: Tag = await res.json();
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
        if (!res.ok) throw new Error('Failed to fetch recipes');
        const recipeData: Recipe[] = await res.json();
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
      <h1 className="text-3xl font-bold">{tag.title}</h1>
      <div className="mt-4">
        <Markdown>{tag.description}</Markdown>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">{tag.title} recipes</h2>
        <div>
          {filteredRecipes && filteredRecipes.map((recipe) => (
            <p>
              <CustomLink key={recipe.id} href={`/recipes/${recipe.uid}`} text={recipe.uid} />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
