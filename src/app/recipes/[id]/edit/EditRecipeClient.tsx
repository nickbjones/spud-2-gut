/**
 * Edit Recipe page
 */
'use client';

import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
// import TagButtons from '@/components/TagButtons';
// import LoadingMessage from '@/components/LoadingMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';
import Uid from '@/components/Uid';
import { useEditRecipe } from '@/hooks/useEditRecipe';

type FormState = {
  title: string;
  ingredients: string;
  instructions: string;
  description: string;
  reference: string;
};

function safeRedirect(path: string | null, fallback = '/') {
  return path?.startsWith('/') && !path.startsWith('//') ? path : fallback;
}

export default function EditRecipeClientPage({ uid }: { uid: string }) {
  // this hook provides recipe data and mutation functions
  const {
    recipe,
    updateRecipe,
    deleteRecipe,
    isSaving,
    // isDeleting,
  } = useEditRecipe(uid);

  // redirect if passed redirect param
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  // set page title
  usePageTitle(recipe?.title);

  // form state
  const [form, setForm] = useState<FormState>({
    title: '',
    ingredients: '',
    instructions: '',
    description: '',
    reference: '',
  });

  // populate form when recipe loads
  useEffect(() => {
    if (!recipe) return;

    setForm({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      description: recipe.description,
      reference: recipe.reference,
    });
  }, [recipe]);

  if (!recipe) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecipe({ ...recipe, ...form });

    if (redirect) {
      router.push(safeRedirect(redirect, '/recipes'));
    } else {
      router.push(`/recipes/${uid}`);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this recipe?')) {
      // deleteRecipe();
      deleteRecipe({ id: recipe.id });
    }
  };

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
        {/* {loadingTags
          ? <LoadingMessage />
          : <TagButtons name="tags" tags={tags || []} selectedTags={recipe.tags} onChange={handleTagChange}
        />} */}
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
          <SubmitButton disabled={isSaving} styles="translate-x-1 lg:translate-x-20 -translate-y-7 my-0" text={isSaving ? 'Saving...' : 'Save'} />
        </div>
      </form>
    </div>
  );
}
