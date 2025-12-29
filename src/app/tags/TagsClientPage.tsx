/**
 * Tags client page
 */
'use client';

import { useTags } from '@/hooks/useTags';
import { useRecipes } from '@/hooks/useRecipes';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { TagType} from '@/types/tag';
import { getRecipesByTag } from '@/lib/utils/helpers';
import Tag, { selectedTagStyles } from '@/components/Tag';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';

export default function TagsPage() {
  usePageTitle('Tags');

  const { tags, isLoading: loadingTags } = useTags();
  const { data: recipes, isLoading: loadingRecipes } = useRecipes();

  const isLoading = loadingRecipes || loadingTags;

  if (isLoading) return <LoadingMessage />;

  const sortedTags = [...(tags || [])].sort((a, b) => a.uid.localeCompare(b.uid));

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
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
              <span className="block text-[8px]/[8px]">({recipesWithThisTag} recipes)</span>
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
