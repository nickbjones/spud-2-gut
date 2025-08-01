import { RecipeType } from "@/types/recipe";
import { TagType } from "@/types/tag";
import { getTagByUid, getTagColor, getTitleByUid } from '@/lib/utils/helpers';
import { miniTagStyles } from '@/components/Tag';

type RecipeCardProps = {
  recipe: RecipeType;
  tags: TagType[];
  search?: string;
  matchSources?: string[];
}

export default function RecipeCard({ recipe, tags, search, matchSources }: RecipeCardProps) {
  const noContent = !recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference && recipe.tags.length === 0;

  return (
    <li className="mb-2 sm:mb-3 border rounded-lg shadow-lg bg-white">
      <a href={`/recipes/${recipe.uid}`} className="block py-2 pl-3 pr-10 relative">
        <span className="text-base font-semibold">{recipe.title}</span>
        {noContent && <p className="text-red-300 italic">No content!</p>}
        {recipe.tags.length > 0 &&
          <div className="flex gap-1 flex-wrap mt-1">
            {recipe.tags.map((uid: string) => (
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
        {search && matchSources && matchSources.length > 0 && (
          <div className="mt-2 text-xs text-gray-400">
            {matchSources.length > 1 ? 'Matches' : 'Match'} found in: <span className="text-gray-600">{matchSources.join(', ')}</span>
          </div>
        )}
        <span className="absolute top-0 right-0 h-full w-10 bg-white rounded-r-lg">
          <span className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">＞</span>
        </span>
      </a>
    </li>
  );
}
