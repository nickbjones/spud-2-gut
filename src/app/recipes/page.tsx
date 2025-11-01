/**
 * Recipes page
 */
'use client';

import { useState } from 'react';
import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import RecipeCard from '@/components/RecipeCard';

const listStyles = 'grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-start';

export default function RecipesPage() {
  usePageTitle('Recipes');

  // Fetch all recipes
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  // Fetch all tags
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  const [search, setSearch] = useState('');

  const error = recipesError?.message || tagsError?.message || '';
  const loading = loadingRecipes || loadingTags;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!recipes || recipes.length === 0) return <ErrorMessage text="No recipes!" />;

  const lowerSearch = search.toLowerCase();

  const filteredRecipes = recipes
    .map((r) => {
      const matchSources: string[] = [];

      if (r.title?.toLowerCase().includes(lowerSearch)) matchSources.push('title');
      if (r.ingredients?.toLowerCase().includes(lowerSearch)) matchSources.push('ingredients');
      if (r.instructions?.toLowerCase().includes(lowerSearch)) matchSources.push('instructions');
      if (r.description?.toLowerCase().includes(lowerSearch)) matchSources.push('description');
      if (r.reference?.toLowerCase().includes(lowerSearch)) matchSources.push('reference');

      return matchSources.length > 0 ? { ...r, matchSources } : null;
    })
    .filter(Boolean) as (RecipeType & { matchSources: string[] })[];

  // sort recipes by title
  // const sortedRecipes = [...filteredRecipes].sort((a, b) => a.title.localeCompare(b.title));

  // sort recipes by date
  const sortedRecipes = [...filteredRecipes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // separate pinned and unpinned recipes
  const pinnedRecipes = sortedRecipes.filter(r => r.isPinned);
  const unpinnedRecipes = sortedRecipes.filter(r => !r.isPinned);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-300 bg-fixed">
      <div className="max-w-5xl mx-auto -mb-12 p-3 sm:p-6 pb-12 sm:pb-24">
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            name="search-recipes"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pr-10 border rounded shadow-lg"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              ×
            </button>
          )}
        </div>
        {sortedRecipes.length === 0 && <p>No recipes!</p>}
        {/* pinned recipes */}
        {pinnedRecipes.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 ml-1 text-md font-semibold text-gray-600">Pinned</h2>
            <ul className={listStyles}>
              {pinnedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  tags={tags ?? []}
                  search={search}
                  matchSources={recipe.matchSources}
                />
              ))}
            </ul>
          </>
        )}
        {(pinnedRecipes.length > 0) && (unpinnedRecipes.length > 0) && (
          <hr className="my-6 mx-20 border-t border-gray-400" />
        )}
        {/* unpinned recipes */}
        {unpinnedRecipes.length > 0 && (
          <ul className={listStyles}>
            {unpinnedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                tags={tags ?? []}
                search={search}
                matchSources={recipe.matchSources}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
