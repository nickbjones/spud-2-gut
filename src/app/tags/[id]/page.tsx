/**
 * Tag page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
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

  // Get the full list of tags — this will reuse cache if already available
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  // Try to find the tag from the cached tags
  const fallbackTag = tags?.find(r => r.uid === uid);

  // Use fallbackData only if we don't already have the specific tag cached
  const { data: tag, error: tagError, isLoading: loadingTag } = useData<TagType>(`${API.tags}/${encodeURIComponent(uid)}`, fallbackTag);

  // Fetch recipes
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  const error = recipesError?.message || tagsError?.message || tagError?.message || '';
  const loading = loadingRecipes || loadingTags || loadingTag;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!tag) return notFound();

  const recipesWithThisTag = getRecipesByTag(recipes || [], uid);

  return (
    <div className="p-3 sm:p-6">
      <div className="flex justify-between items-center my-3">
        <h2 className={bigTagStyles} style={getTagColor(tag.color || '')}>{tag.title}</h2>
        <SharedLink href={`${tag.uid}/edit`} text="[Edit]" styles="text-sm" />
      </div>
      {tag.description && <p>{tag.description}</p>}
      <div className="mt-4">
        <p className="mb-2">{recipesWithThisTag.length > 0 ? `Recipes with this tag (${recipesWithThisTag.length}):` : 'No recipes with this tag'}</p>
        {recipesWithThisTag.length > 0 &&
          <ul>
            {recipesWithThisTag.map((recipe: RecipeType) => (
              <RecipeCard key={recipe.id} recipe={recipe} tags={tags || []} />
            ))}
          </ul>
        }
      </div>
    </div>
  );
}
