/**
 * Tags page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { usePageTitle } from '@/hooks/usePageTitle';
import { RecipeType } from '@/types/recipe';
import type { TagType} from '@/types/tag';
import { getRecipesByTag } from '@/lib/utils/helpers';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import Tag, { selectedTagStyles } from '@/components/Tag';
import SharedLink from '@/components/SharedLink';

export default function TagsPage() {
  // Fetch all tags
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);
  
  // Fetch all recipes
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  const error = recipesError?.message || tagsError?.message || '';
  const loading = loadingRecipes || loadingTags;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!tags || tags.length < 1) return <ErrorMessage text="No tags!" />;

  const sortedTags = [...tags].sort((a, b) => a.uid.localeCompare(b.uid));

  usePageTitle('Tags');

  return (
    <div className="p-3 sm:p-6">
      <SharedLink text="+ New Tag" href="/tags/new" />
      {/* tags list */}
      <div className="flex flex-wrap gap-2 mt-3">
        {sortedTags.map((tag: TagType) => {
          const recipesWithThisTag = getRecipesByTag(recipes || [], tag.uid).length;
          return (
            <Tag
              key={tag.uid}
              uid={tag.uid}
              color={tag.color}
              className={`${selectedTagStyles} border-none`}
            >
              <span className="block">{tag.title}</span>
              <span className="block text-[8px]/[8px]">({recipesWithThisTag} receipes)</span>
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
