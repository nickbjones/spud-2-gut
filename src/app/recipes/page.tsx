/**
 * Recipes page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import RecipeCard from '@/components/RecipeCard';

export default function Recipes() {
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  const error = recipesError?.message || tagsError?.message || '';
  const loading = loadingRecipes || loadingTags;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!recipes || recipes.length === 0) return <ErrorMessage text="No recipes!" />;

  const sortedRecipes = [...recipes].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="p-3 sm:p-6 bg-slate-100">
      {/* Add search bar here */}
      <ul>
        {sortedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} tags={tags ?? []} />
        ))}
      </ul>
    </div>
  );
}
