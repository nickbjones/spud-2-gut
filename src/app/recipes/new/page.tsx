/**
 * New Recipe page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import { uidRules, generateUid, getNewId } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import SubmitButton from '@/components/SubmitButton';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import { initialRecipeValues } from '@/lib/initialValues';

export default function NewRecipePage() {
  const router = useRouter();

  // Fetch all recipes
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  // Fetch all tags
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  const [formData, setFormData] = useState<RecipeType>(initialRecipeValues);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    const newId = getNewId('RECIPE', recipes || []);
    setFormData((prev) => ({ ...prev, id: newId }))
  }, [recipes]);

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      uid: generateUid(newTitle, recipes || []),
    }));
  };

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUid = e.target.value.toLowerCase().replace(uidRules, ''); // enforce rules
    setFormData((prev) => ({
      ...prev,
      uid: newUid,
    }));
  };

  const handleTagChange = (tagUid: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagUid)
        ? prev.tags.filter((t) => t !== tagUid) // remove if already selected
        : [...prev.tags, tagUid], // add if not already selected
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      const newRecipe = await response.json();
      router.push(`/recipes/${newRecipe.uid}`);
    } catch (err) {
      setSubmitError(`Error saving recipe. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const error = submitError || recipesError?.message || tagsError?.message || '';

  if (loadingTags || loadingRecipes) return <LoadingMessage />;
  if (!recipes || recipes.length < 1) return <ErrorMessage text="No recipes!" />;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <InputField
          id="title"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleTitleChange}
          required
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            value={formData.ingredients}
            onChange={handleGeneralFieldChange}
            className="h-48"
          />
          <TextAreaField
            id="instructions"
            name="instructions"
            label="Instructions"
            value={formData.instructions}
            onChange={handleGeneralFieldChange}
            className="h-48"
          />
        </div>
        <TextAreaField id="description" name="description" label="Description" value={formData.description} onChange={handleGeneralFieldChange} className="h-16" />
        <TagButtons name="tags" tags={tags || []} selectedTags={formData.tags} onChange={handleTagChange} />
        <InputField id="reference" name="reference" label="Reference" value={formData.reference} onChange={handleGeneralFieldChange} />
        <InputField id="uid" name="uid" label="UID" value={formData.uid} onChange={handleUidChange} required />
        <SubmitButton text={isSaving ? 'Saving...' : 'Save Recipe'} disabled={isSaving} />
      </form>
    </div>
  );
}
