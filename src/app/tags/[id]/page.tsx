/**
 * Tag page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import { useParams, notFound } from 'next/navigation';
import { getRecipesByTag, getTagColor } from '@/lib/utils/helpers';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import RecipeCard from '@/components/RecipeCard';

const bigTagStyles = `
  !my-0
  py-2
  px-4
  text-2xl
  text-white
  font-bold
  bg-blue-400
  rounded-xl
`;

export default function TagPage() {
  const { id: uid } = useParams() as { id: string };

  // Fetch tag
  const { data: tag, error: tagError, isLoading: loadingTag } = useData<TagType>(`${API.tags}/${encodeURIComponent(uid)}`);

  usePageTitle(tag?.title);

  // Fetch all tags
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  // Fetch all recipes
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  const error = recipesError?.message || tagsError?.message || tagError?.message || '';
  const loading = loadingRecipes || loadingTags || loadingTag;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!tag) return notFound();

  const recipesWithThisTag = getRecipesByTag(recipes || [], uid);

  // sort recipes by date
  const sortedRecipes = [...recipesWithThisTag].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
      <div className="flex justify-between items-center my-3">
        <h2 className={bigTagStyles} style={getTagColor(tag.color || '')}>{tag.title}</h2>
        <SharedLink href={`${tag.uid}/edit`} text="Edit tag" styles="text-sm text-right" />
      </div>
      {tag.description && <p>{tag.description}</p>}
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
    </div>
  );
}
