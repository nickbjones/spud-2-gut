/**
 * Tags page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { RecipeType } from '@/types/recipe';
import type { TagType} from '@/types/tag';
import { getRecipesByTag } from '@/lib/utils/helpers';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import Tag, { selectedTagStyles } from '@/components/Tag';
import SharedLink from '@/components/SharedLink';

export default function Tags() {
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  const error = recipesError?.message || tagsError?.message || '';
  const loading = loadingRecipes || loadingTags;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!tags || tags.length < 1) return <ErrorMessage text="No tags!" />;

  const sortedTags = [...tags].sort((a, b) => a.uid.localeCompare(b.uid));

  return (
    <div className="p-3 sm:p-6">
      <SharedLink text="+ New Tag" href="/tags/new" />
      {/* tags list */}
      <div className="flex flex-wrap gap-2 mt-3">
        {sortedTags.map((tag: TagType) => {
          const recipesWithThisTag = getRecipesByTag(recipes || [], tag.uid).length;
          return <Tag key={tag.uid} uid={tag.uid} className={`${selectedTagStyles} !mr-0`}>
            <span className="block">{tag.title}</span>
            <span className="block text-[8px]/[8px]">({recipesWithThisTag} receipes)</span>
          </Tag>;
        })}
      </div>
    </div>
  );
}
