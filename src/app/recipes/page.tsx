import type { Recipe } from '@/types/types';
import { recipes } from '@/lib/mockData';
import Link from 'next/link';

export default function Recipes() {
  return (
    <div>
      <Link href="/recipes/new" className="float-right px-3 py-2 text-white rounded-md transition bg-blue-500 hover:bg-blue-400">+ New Recipe</Link>
      <h1 className="text-3xl font-bold">Recipes</h1>
      <ul>
        {recipes.map((recipe: Recipe) => (
          <li key={recipe.uid} className="my-2">
            <Link
              href={`recipes/${recipe.uid}`}
              className="py-1 px-3 transition bg-green-400 hover:bg-green-300"
            >{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
