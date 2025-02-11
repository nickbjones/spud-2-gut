import type { Recipe } from '@/types/recipe';
import { recipes } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import Tag from '@/components/Tag';

// async function getRecipe(uid: string) {
function getRecipe(uid: string) {
  // const res = await fetch(`https://example.com/api/blog/${uid}`, { cache: 'no-store' });
  // if (!res.ok) return null;
  // return res.json();
  const recipe: Recipe | undefined = recipes.find((p) => p.uid === uid);
  console.log(recipe);
  if (!recipe) return null;
  return recipe;
}

export default async function Recipe({ params }: { params: { id: string } }) {
  if (!params.id) return notFound();
  const recipe = getRecipe(params.id);
  if (!recipe) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <div className="mt-4">
        {recipe.tags.map((tag: string) => <Tag tag={tag} />)}
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
