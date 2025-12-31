/**
 * Edit Recipe client page
 */
'use client';

import { useTags } from '@/hooks/useTags';
import { useRecipe } from '@/hooks/useRecipe';
import { useRecipes } from '@/hooks/useRecipes';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RecipeType } from '@/types/recipe';
import { initialRecipeValues } from '@/lib/initialValues';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import LoadingMessage from '@/components/LoadingMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';
import Uid from '@/components/Uid';

// function safeRedirect(path: string | null, fallback = '/') {
//   return path?.startsWith('/') && !path.startsWith('//') ? path : fallback;
// }

export default function EditRecipeClientPage({ uid }: { uid: string }) {
  const { recipe, isLoadingRecipe } = useRecipe(uid);
  const { updateRecipe, isUpdatingRecipe, deleteRecipe } = useRecipes();
  const { tags, isLoadingTags } = useTags();

  usePageTitle(recipe?.title);

  // redirect if passed redirect param
  // const router = useRouter();
  const searchParams = useSearchParams();
  // const redirect = searchParams.get('redirect');

  // form state
  const [form, setForm] = useState<RecipeType>(initialRecipeValues);

  const [initialized, setInitialized] = useState(false);

  // populate form when recipe loads
  useEffect(() => {
    if (!recipe || initialized) return;

    setForm(recipe);
    setInitialized(true);
  }, [recipe, initialized]);

  if (!recipe) return null;

  const handleTagChange = (tagUid: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tagUid)
        ? f.tags.filter((t) => t !== tagUid) // remove if already selected
        : [...f.tags, tagUid], // add if not already selected
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecipe(form);
  };

  const handleDelete = () => {
    if (!confirm('Delete this recipe?')) return;
    deleteRecipe(recipe.id);
  };

  if (isLoadingRecipe) return <LoadingMessage />;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:px-5">
      <form onSubmit={handleSubmit} className="relative">
        <div className="inline-block flex items-center mb-4">
          <InputField
            id="title"
            name="title"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            className="!mb-0"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            value={form.ingredients}
            onChange={(e) => setForm(f => ({ ...f, ingredients: e.target.value }))}
            textAreaClassName="h-80 sm:h-60"
          />
         <TextAreaField
            id="instructions"
            name="instructions"
            label="Instructions"
            value={form.instructions}
            onChange={(e) => setForm(f => ({ ...f, instructions: e.target.value }))}
            textAreaClassName="h-80 sm:h-60"
          />
        </div>
        <TextAreaField
          id="description"
          name="description"
          label="Description"
          value={form.description}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          textAreaClassName="h-32"
          wrapperClassName="mt-3 mb-6"
        />
        {isLoadingTags
          ? <LoadingMessage />
          : <TagButtons name="tags" tags={tags || []} selectedTags={form.tags} onChange={handleTagChange} />
        }
        <InputField
          id="reference"
          name="reference"
          label="Reference"
          value={form.reference}
          onChange={(e) => setForm(f => ({ ...f, reference: e.target.value }))}
        />
        <Uid uid={recipe.uid} />
        <SharedLink text="Delete recipe" styles="mt-2 text-red-800 hover:text-red-400" onClick={handleDelete} />
        <div className="flex justify-end">
          <SubmitButton
            disabled={isUpdatingRecipe}
            styles="translate-x-1 lg:translate-x-20 -translate-y-7 my-0"
            text={isUpdatingRecipe ? 'Saving...' : 'Save'}
          />
        </div>
      </form>
    </div>
  );
}
