/**
 * Recipes page
 */
'use client';

import { useState } from 'react';
import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import RecipeCard from '@/components/RecipeCard';

export default function RecipesPage() {
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
  const sortedRecipes = [...filteredRecipes].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="-mb-12 p-3 pb-12 sm:p-6 sm:pb-24 min-h-screen bg-slate-100">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pr-10 border rounded"
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
      {sortedRecipes.length > 0 ? (
        <ul>
          {sortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              tags={tags ?? []}
              search={search}
              matchSources={recipe.matchSources}
            />
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
