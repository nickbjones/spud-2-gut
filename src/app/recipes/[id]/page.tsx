/**
 * Recipe page
 */
'use client';

import { API } from '@/lib/constants';
import useSWR from 'swr';
import { useParams, notFound } from 'next/navigation';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import Md from '@/components/Markdown';
import Tag, { selectedTagStyles } from '@/components/Tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import SharedLink from '@/components/SharedLink';
import { getRecipesByTag, getTitleByUid } from '@/lib/utils/helpers';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
});

export default function Recipe() {
  const { id: uid } = useParams() as { id: string };

  const {
    data: recipe,
    error: recipeError,
    isLoading: loadingRecipe,
  } = useSWR<RecipeType>(`${API.recipes}/${encodeURIComponent(uid)}`, fetcher);

  const {
    data: recipes,
    error: recipesError,
    isLoading: loadingRecipes,
  } = useSWR<RecipeType[]>(API.recipes, fetcher);

  const { data: tags,
    error: tagsError,
    isLoading: loadingTags,
  } = useSWR<TagType[]>(API.tags, fetcher);

  const error = recipeError?.message || recipesError?.message || tagsError?.message || '';
  const loading = loadingRecipe || loadingRecipes || loadingTags;

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (!recipe) return notFound();

  return (
    <div className="p-3 sm:p-6">
      <div className="flex justify-between items-center my-3">
        <SharedHeading text={recipe.title} styles="!my-0" />
        <SharedLink href={`${recipe.uid}/edit`} text="[Edit]" styles="text-sm" />
      </div>

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap mt-3">
          {recipe.tags.map((uid: string) => {
            const count = getRecipesByTag(recipes ?? [], uid).length;
            return (
              <Tag key={uid} uid={uid} className={selectedTagStyles}>
                <span className="block">{getTitleByUid(uid, tags ?? [])}</span>
                <span className="block text-[8px]/[8px]">({count} recipes)</span>
              </Tag>
            );
          })}
        </div>
      )}
      {(recipe.ingredients || recipe.instructions) && (
        <div className={recipe.ingredients && recipe.instructions && `sm:grid grid-cols-2 gap-6 mt-0 sm:mt-2`}>
          {recipe.ingredients && (
            <div className="ingredients mt-6 sm:mt-0 -mx-3 sm:mx-0">
              <div className="mt-2 sm:mt-4 px-3 py-1 bg-gray-100">
                <Md>{recipe.ingredients}</Md>
              </div>
            </div>
          )}
          {recipe.instructions && (
            <div className="instructions mt-6 sm:mt-1 mb-2 sm:mb-4 mr-1 sm:mx-0">
              <Md>{recipe.instructions}</Md>
            </div>
          )}
        </div>
      )}
      {recipe.description && (
        <div className="description mt-6">
          <Md className="max-w-full">{recipe.description}</Md>
        </div>
      )}
      {recipe.reference && (
        <div className="reference mt-6 break-all">
          <SharedLink href={recipe.reference} text={recipe.reference} />
        </div>
      )}
      {(!recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference) && (
        <SharedLink href={`${recipe.uid}/edit`} text="Add content →" styles="block mt-8" />
      )}
    </div>
  );
}
