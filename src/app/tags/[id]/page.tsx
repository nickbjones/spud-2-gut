/**
 * Tag page
 */
'use client';

import { useParams, notFound } from 'next/navigation';
import { useTag, useTags } from '@/hooks/useTags';
import { useRecipes } from '@/hooks/useRecipes';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { RecipeType } from '@/types/recipe';
import { getRecipesByTag, getTagColor } from '@/lib/utils/helpers';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import RecipeCard from '@/components/RecipeCard';

export default function TagPage() {
  const { id } = useParams<{ id: string }>();

  const { data: tag, isLoading: isLoadingTag } = useTag(id);
  const { data: recipes, isLoading: isLoadingRecipes } = useRecipes();
  const { data: tags } = useTags();

  usePageTitle(tag?.title);

  if (isLoadingTag) return <LoadingMessage />;
  if (!tag) return notFound();

  const recipesWithThisTag = getRecipesByTag(recipes || [], id);

  // sort recipes by date
  const sortedRecipes = [...recipesWithThisTag].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
      <div className="flex justify-between items-center my-3">
        <h2 className="!my-0 py-2 px-4 text-2xl text-white font-bold bg-blue-400 rounded-xl" style={getTagColor(tag.color || '')}>{tag.title}</h2>
        <SharedLink href={`${tag.uid}/edit`} text="Edit tag" styles="text-sm text-right" />
      </div>
      {tag.description && <p>{tag.description}</p>}
      {isLoadingRecipes ? <LoadingMessage /> : (
        <div className="mt-4">
          <p className="mb-2">{sortedRecipes.length > 0 ? `Recipes with this tag (${sortedRecipes.length}):` : 'No recipes with this tag'}</p>
          {sortedRecipes.length > 0 &&
            <ul className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
              {sortedRecipes.map((recipe: RecipeType) => (
                <RecipeCard key={recipe.id} recipe={recipe} tags={tags || []} />
              ))}
            </ul>
          }
        </div>
      )}
    </div>
  );
}
