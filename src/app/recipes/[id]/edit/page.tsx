/**
 * Edit Recipe page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';

const initialValues: RecipeType = {
  id: '',
  title: '',
  uid: '',
  tags: [],
  date: new Date().toISOString().split('T')[0], // today
  description: '',
  ingredients: '',
  instructions: '',
  reference: '',
};

export default function Edit() {
  const router = useRouter();

  const [formData, setFormData] = useState<RecipeType>(initialValues);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const { id: uid } = useParams() as { id: string };

  const { data: recipe, error: recipeError, isLoading: loadingRecipe } = useData<RecipeType>(`${API.recipes}/${encodeURIComponent(uid)}`);
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
    }
  }, [recipe]);

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError('');

    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(formData.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update recipe');
      };

      router.push(`/recipes/${uid}`);
    } catch (err) {
      setSubmitError(`Error saving recipe. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  }

  const deleteRecipe = async () => {
    try {
      if (!formData) throw new Error('Recipe not found');

      const res = await fetch(`/api/recipes/${encodeURIComponent(formData.id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete recipe');
      };

      // Redirect to recipes list after deletion
      window.location.href = '/recipes';
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  };

  const confirmDeletion = () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe();
    }
  };

  const error = submitError || recipeError?.message || tagsError?.message || '';

  if (loadingRecipe) return <LoadingMessage />;
  if (!formData) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="inline-block flex items-center mb-4">
          <InputField id="title" name="title" value={formData.title} onChange={handleGeneralFieldChange} className="!mb-0" />
          <SubmitButton disabled={isSaving} styles="!my-0 ml-10 text-sm" text={isSaving ? 'Saving...' : 'Save'} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            value={formData.ingredients}
            onChange={handleGeneralFieldChange}
            className="h-80 sm:h-32"
          />
         <TextAreaField
            id="instructions"
            name="instructions"
            label="Instructions"
            value={formData.instructions}
            onChange={handleGeneralFieldChange}
            className="h-80 sm:h-32"
          />
        </div>
        <TextAreaField id="description" name="description" label="Description" value={formData.description} onChange={handleGeneralFieldChange} className="h-16" />
        {loadingTags
          ? <LoadingMessage />
          : <TagButtons name="tags" tags={tags || []} selectedTags={formData.tags} onChange={handleTagChange}
        />}
        <InputField id="reference" name="reference" label="Reference" value={formData.reference} onChange={handleGeneralFieldChange} />
        <p className="text-sm mt-6 mb-3">
          <span className="text-gray-600 font-medium mr-2">UID:</span>
          <span className="text-gray-400">{uid}</span>
        </p>
      </form>
      <SharedLink text="Delete recipe" styles="text-red-800 hover:text-red-400" onClick={confirmDeletion} />
    </div>
  );
}
