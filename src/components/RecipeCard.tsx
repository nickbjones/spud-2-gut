import { RecipeType } from "@/types/recipe";
import { TagType } from "@/types/tag";
import { getTagByUid, getTagColor, getTitleByUid } from '@/lib/utils/helpers';
import { miniTagStyles } from '@/components/Tag';

type RecipeCardProps = {
  recipe: RecipeType;
  tags: TagType[];
}

export default function RecipeCard({ recipe, tags }: RecipeCardProps) {
  const noContent = !recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference && recipe.tags.length === 0;

  return (
    <li className="mb-2 sm:mb-3 border rounded-lg shadow-lg">
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
        <span className="absolute top-0 right-0 h-full w-10 bg-white rounded-r-lg">
          <span className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">＞</span>
        </span>
      </a>
    </li>
  );
}
