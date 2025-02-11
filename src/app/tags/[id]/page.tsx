import type { Recipe, Tag } from '@/types/types';
import { tags, recipes } from '@/lib/mock';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import Link from 'next/link';

// async function getTag(uid: string) {
function getTag(uid: string) {
  // const res = await fetch(`https://example.com/api/blog/${uid}`, { cache: 'no-store' });
  // if (!res.ok) return null;
  // return res.json();
  const tag: Tag | undefined = tags.find((tag) => tag.uid === uid);
  console.log(tag);
  if (!tag) return null;
  return tag;
}

function getRecipes(tag: string) {
  // const recipe: Tag | undefined = recipes.find((recipe) => recipe.tags === uid);
  const filteredRecipes: Recipe[] | undefined = recipes.filter((recipe) => recipe.tags.includes(tag));
  if (!filteredRecipes) return null;
  return filteredRecipes;
}
  
export default async function Tag({ params }: { params: { id: string } }) {
  if (!params.id) return notFound();
  const tag = getTag(params.id);
  if (!tag) return notFound();

  const recipes = getRecipes(params.id);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{tag.title}</h1>
      <div className="mt-4">
        <Markdown>{tag.description}</Markdown>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">{tag.title} recipes</h2>
        <div>{recipes && recipes.map((recipe) => (
          <Link key={recipe.id} className="bg-gray-800 text-white space-x-4 m-1 p-1" href={`/recipes/${recipe.uid}`}>{recipe.uid}</Link>
        ))}</div>
      </div>
    </div>
  );
}
