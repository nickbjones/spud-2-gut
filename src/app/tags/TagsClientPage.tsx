/**
 * Tags client page
 */
'use client';

import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTags } from '@/hooks/useTags';
import type { TagType} from '@/types/tag';
// import { getRecipesByTag } from '@/lib/utils/helpers';
import Tag, { selectedTagStyles } from '@/components/Tag';
import SharedLink from '@/components/SharedLink';

export default function TagsPage() {
  usePageTitle('Tags');
  
  const { tags } = useTags();

  // Fetch all tags
  // const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);
  
  // Fetch all recipes
  // const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  // const error = recipesError?.message || tagsError?.message || '';
  // const loading = loadingRecipes || loadingTags;

  // if (loading) return <LoadingMessage />;
  // if (error) return <ErrorMessage text={error} />;
  // if (!tags || tags.length < 1) return <ErrorMessage text="No tags!" />;

  const sortedTags = [...(tags || [])].sort((a, b) => a.uid.localeCompare(b.uid));

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
      <SharedLink text="+ New Tag" href="/tags/new" />
      {/* tags list */}
      <div className="flex flex-wrap gap-2 mt-3">
        {sortedTags.map((tag: TagType) => {
          // const recipesWithThisTag = getRecipesByTag(recipes || [], tag.uid).length;
          return (
            <Tag
              key={tag.uid}
              uid={tag.uid}
              color={tag.color}
              className={`${selectedTagStyles} border-none`}
            >
              <span className="block">{tag.title}</span>
              {/* <span className="block text-[8px]/[8px]">({recipesWithThisTag} recipes)</span> */}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
