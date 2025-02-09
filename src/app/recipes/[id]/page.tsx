import type { Recipe } from '@/types/recipe';
import { recipes } from '@/lib/mockData';
import { notFound } from 'next/navigation';

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
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <div className="mt-4">{recipe.description}</div>
        <div className="mt-4">{recipe.ingredients}</div>
        <div className="mt-4">{recipe.instructions}</div>
      </div>
    </>
  );
}
