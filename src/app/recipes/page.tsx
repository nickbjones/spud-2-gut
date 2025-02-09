import type { Recipe } from '@/types/recipe';
import { recipes } from '@/lib/mockData';
import Link from 'next/link';

export default function Recipes() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Recipes</h1>
      <ul>
        {recipes.map((recipe: Recipe) => (
          <li key={recipe.uid}>
            <Link href={`recipes/${recipe.uid}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
