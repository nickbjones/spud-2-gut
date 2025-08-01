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

export default function Recipes() {
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);
  const [search, setSearch] = useState('');

  const error = recipesError?.message || tagsError?.message || '';
  const loading = loadingRecipes || loadingTags;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!recipes || recipes.length === 0) return <ErrorMessage text="No recipes!" />;

  const lowerSearch = search.toLowerCase();

  const filteredRecipes = recipes.filter((r) =>
    [r.title, r.ingredients, r.instructions, r.description, r.reference]
      .filter(Boolean) // skip undefined/null
      .some((field) =>
        field.toLowerCase().includes(lowerSearch)
      )
  );

  // sort recipes by title
  const sortedRecipes = [...filteredRecipes].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="p-3 sm:p-6 bg-slate-100">
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />
      {sortedRecipes.length > 0 ? (
        <ul>
          {sortedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} tags={tags ?? []} />
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
