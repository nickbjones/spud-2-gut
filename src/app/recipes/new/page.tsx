/**
 * New Recipe page
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipes, useCreateRecipe } from '@/hooks/useRecipes';
import { useTags } from '@/hooks/useTags';
import { usePageTitle } from '@/hooks/usePageTitle';
import { uidRules, generateUid } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import LoadingMessage from '@/components/LoadingMessage';
import SubmitButton from '@/components/SubmitButton';
import { initialRecipeValues } from '@/lib/initialValues';
import type { RecipeType } from '@/types/recipe';

export default function NewRecipePage() {
  const { data: recipes, isLoading: isLoadingRecipes } = useRecipes();
  const { data: tags, isLoading: isLoadingTags } = useTags();

  const create = useCreateRecipe();
  const isCreatingRecipe = create.isPending;

  const router = useRouter();
  const [form, setForm] = useState<RecipeType>(initialRecipeValues);
  
  usePageTitle('New Recipe');

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: newTitle,
      uid: generateUid(newTitle, recipes || []),
    }));
  };

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUid = e.target.value.toLowerCase().replace(uidRules, ''); // enforce rules
    setForm((prev) => ({
      ...prev,
      uid: newUid,
    }));
  };

  const handleTagChange = (tagUid: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagUid)
        ? prev.tags.filter((t) => t !== tagUid) // remove if already selected
        : [...prev.tags, tagUid], // add if not already selected
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create.mutate(form, {
      onSuccess: () => router.push(`/recipes/${form.uid}`),
    })
  };

  if (isLoadingTags || isLoadingRecipes) return <LoadingMessage />;
  if (isLoadingRecipes) return <LoadingMessage />;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:px-5">
      <form onSubmit={handleSubmit}>
        <InputField
          id="title"
          name="title"
          label="Title"
          value={form.title}
          onChange={handleTitleChange}
          required
          autoFocus
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            value={form.ingredients}
            onChange={handleGeneralFieldChange}
            textAreaClassName="h-48"
          />
          <TextAreaField
            id="instructions"
            name="instructions"
            label="Instructions"
            value={form.instructions}
            onChange={handleGeneralFieldChange}
            textAreaClassName="h-48"
          />
        </div>
        <TextAreaField
          id="description"
          name="description"
          label="Description"
          value={form.description}
          onChange={handleGeneralFieldChange}
          textAreaClassName="h-32"
          wrapperClassName="mt-3 mb-6"
        />
        <TagButtons name="tags" tags={tags || []} selectedTags={form.tags} onChange={handleTagChange} />
        <InputField id="reference" name="reference" label="Reference" value={form.reference} onChange={handleGeneralFieldChange} />
        <InputField id="uid" name="uid" label="UID" value={form.uid} onChange={handleUidChange} required />
        <SubmitButton text={isCreatingRecipe ? 'Saving...' : 'Save Recipe'} disabled={isCreatingRecipe} />
      </form>
    </div>
  );
}
