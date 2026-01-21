/**
 * Recipe page
 */
'use client';

import { useTags } from '@/hooks/useTags';
import { useParams } from 'next/navigation';
import { useRecipe, useRecipes, useUpdateRecipe } from '@/hooks/useRecipes';
import { notFound } from 'next/navigation';
import Md from '@/components/Markdown';
import { usePageTitle } from '@/hooks/usePageTitle';
import { getRecipesByTag, getTagByUid, getTitleByUid } from '@/lib/utils/helpers';
import Tag, { selectedTagStyles } from '@/components/Tag';
import LoadingMessage from '@/components/LoadingMessage';
import SharedHeading from '@/components/SharedHeading';
import SharedLink from '@/components/SharedLink';
import CookCounterButton from '@/components/CookCounterButton';
import PinCheck from '@/components/PinCheck';

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();

  const { data: recipe, isLoading: isLoadingRecipe } = useRecipe(id);
  const { data: recipes, isLoading: isLoadingRecipes } = useRecipes();
  const { data: tags, isLoading: isLoadingTags } = useTags();
  const updateMutation = useUpdateRecipe(id);

  usePageTitle(recipe?.title);

  if (isLoadingRecipe) return <LoadingMessage />;
  if (!recipe) return notFound();

  const sortedTags = [...recipe.tags].sort((a, b) => a.localeCompare(b));

  const handlePinChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRecipe = { ...recipe, isPinned: e.target.checked };
    updateMutation.mutate({ ...updatedRecipe });
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-3 sm:p-6">
        <div className="flex items-end my-3">
          {/* title row */}
          <SharedHeading text={recipe.title} styles="!my-0" />
          {/* temporarily removed */}
          {recipe.isPinned && (
            <span className="inline-block mb-1 mx-2 sm:mx-4 px-1 text-xs text-center rounded-full border border-orange-300 bg-orange-200">
              Pinned
            </span>
          )}
          <SharedLink href={`${recipe.uid}/edit`} text="Edit recipe" styles="text-sm ml-auto text-right" />
        </div>
        <div className="flex items-end justify-between">
          {/* tags list */}
          {(isLoadingTags || isLoadingRecipes)
            ? <LoadingMessage />
            : (sortedTags.length > 0)
              ? <div className="flex flex-wrap mt-3 gap-1 sm:gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
                {sortedTags.map((uid: string) => {
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
              : <p className="text-gray-400 italic">No tags</p>
          }
          {/* pin */}
          <PinCheck isPinned={recipe.isPinned} onChange={handlePinChange} isMiniPin={true} />
          {/* cook counter */}
          <CookCounterButton recipe={recipe} className="ml-1" />
        </div>
        {/* ingredients */}
        {(recipe.ingredients || recipe.instructions) && (
          <div className={recipe.ingredients && recipe.instructions && `sm:grid grid-cols-2 gap-12 mt-6 sm:mt-4`}>
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
        {/* description */}
        {recipe.description && (
          <div className="description mt-6">
            <Md className="max-w-full">{recipe.description}</Md>
          </div>
        )}
        {/* reference */}
        {recipe.reference && (
          <div className="reference mt-6 break-all">
            <SharedLink href={recipe.reference} text={recipe.reference} target="_blank" />
          </div>
        )}
        {/* no content */}
        {(!recipe.ingredients && !recipe.instructions && !recipe.description && !recipe.reference) && (
          <SharedLink href={`${recipe.uid}/edit`} text="Add content →" styles="block mt-8" />
        )}
      </div>
    </>
  );
}
