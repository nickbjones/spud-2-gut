import { RecipeType } from "@/types/recipe";
import { TagType } from "@/types/tag";
import { getTagByUid, getTagColor, getTitleByUid } from '@/lib/utils/helpers';
import { miniTagStyles } from '@/components/Tag';
import Link from "next/link";
import CookCounter from "./CookCounter";

type RecipeCardProps = {
  recipe: RecipeType;
  tags: TagType[];
  search?: string;
  matchSources?: string[];
}

export default function RecipeCard({ recipe, tags, search, matchSources }: RecipeCardProps) {
  const noContent = !recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference && recipe.tags.length === 0;

  const sortedTags = [...recipe.tags].sort((a, b) => a.localeCompare(b));
  let matchedSourcesToDisplay = '';

  if (search && matchSources && matchSources.length > 0) {
    matchedSourcesToDisplay = matchSources.filter(item => item !== 'title').join(', ');
  }

  return (
    <li className="border rounded-lg shadow-lg bg-white">
      <Link href={`/recipes/${recipe.uid}`} className="block py-2 px-3">
        {noContent && <p className="text-red-300 italic">No content!</p>}
        <div className="flex justify-between items-start">
          <span className="text-base font-semibold">{recipe.title}</span>
          <CookCounter cookCount={recipe.cookCount || '0'} />
        </div>
        <div className="flex justify-between items-end">
          {sortedTags.length > 0 &&
            <div className="flex gap-1 flex-wrap mt-1">
              {sortedTags.map((uid: string) => (
                <span
                  key={uid}
                  style={getTagColor(getTagByUid(uid, tags).color || '')}
                  className={miniTagStyles}
                >
                  {getTitleByUid(uid, tags)}
                </span>
              ))}
            </div>
          }
          <span className="mt-1 text-xs sm:text-sm text-nowrap text-slate-400">{recipe.date}</span>
        </div>
        {matchedSourcesToDisplay && (
          <div className="mt-2 text-xs text-gray-400">
            &quot;{search}&quot; found in: <span className="text-gray-600">{matchedSourcesToDisplay}</span>
          </div>
        )}
      </Link>
    </li>
  );
}
