/**
 * Recipe page
 */
'use client';

import { useEffect, useState } from 'react';
import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useParams, notFound } from 'next/navigation';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import { getRecipesByTag, getTagByUid, getTitleByUid } from '@/lib/utils/helpers';
import Md from '@/components/Markdown';
import Tag, { selectedTagStyles } from '@/components/Tag';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import SharedLink from '@/components/SharedLink';

const findRecipe = (recipeList: RecipeType[], uid: string) => recipeList.find(r => r.uid === uid);
const retryDelay = 2000;

export default function RecipePage() {
  const { id: uid } = useParams() as { id: string };
  const [recipe, setRecipe] = useState<RecipeType | undefined>(undefined);
  const [checkedForRecipe, setCheckedForRecipe] = useState<boolean>(false);

  // Fetch all recipes
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  // Fetch all tags
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  // Get recipe
  useEffect(() => {
    if (!recipes) return; // still loading

    // Always do the initial check immediately
    const recipeFound = findRecipe(recipes, uid);
    if (recipeFound) {
      setRecipe(recipeFound);
      setCheckedForRecipe(true);
      return; // no need to wait
    }

    // Otherwise, wait and check again once
    const timer = setTimeout(() => {
      const foundLater = findRecipe(recipes, uid);
      if (foundLater) {
        setRecipe(foundLater);
      }
      setCheckedForRecipe(true);
    }, retryDelay);

    return () => clearTimeout(timer);
  }, [recipes, uid]);

  usePageTitle(recipe?.title);

  const error = recipesError?.message || tagsError?.message || '';
  const isLoading = loadingRecipes || loadingTags || !checkedForRecipe;

  if (isLoading) return <LoadingMessage />;
  if (error) return <ErrorMessage text={error} />;
  if (checkedForRecipe && !recipe) return notFound();

  if (recipe) {
    return (
      <div className="p-3 sm:p-6">
        <div className="flex justify-between items-center my-3">
          <SharedHeading text={recipe.title} styles="!my-0" />
          <SharedLink href={`${recipe.uid}/edit`} text="[Edit]" styles="text-sm" />
        </div>
        {/* tags list */}
        {(recipe.tags.length > 0) &&
          <div className="flex flex-wrap mt-3 gap-1 sm:gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
            {recipe.tags.map((uid: string) => {
              const count = getRecipesByTag(recipes ?? [], uid).length;
              return (
                <Tag
                  key={uid}
                  uid={uid}
                  className={`${selectedTagStyles} border-none`}
                  color={getTagByUid(uid, tags || []).color}
                >
                  <span className="block">{getTitleByUid(uid, tags ?? [])}</span>
                  <span className="block text-[8px]/[8px]">({count} recipes)</span>
                </Tag>
              );
            })}
          </div>
        }
        {(recipe.ingredients || recipe.instructions) && (
          <div className={recipe.ingredients && recipe.instructions && `sm:grid grid-cols-2 gap-6 mt-0 sm:mt-2`}>
            {recipe.ingredients && (
              <div className="ingredients mt-4 sm:mt-0 -mx-3 sm:mx-0">
                <div className="mt-2 sm:mt-4 px-3 py-1 bg-slate-100">
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
            <SharedLink href={recipe.reference} text={recipe.reference} target="_blank" />
          </div>
        )}
        {(!recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference) && (
          <SharedLink href={`${recipe.uid}/edit`} text="Add content →" styles="block mt-8" />
        )}
      </div>
    );
  }

  return <ErrorMessage text="No recipe!" />;
}
