/**
 * Edit Recipe page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams, notFound } from 'next/navigation';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';
import { initialRecipeValues } from '@/lib/initialValues';
import Uid from '@/components/Uid';

function safeRedirect(path: string | null, fallback = '/') {
  return path?.startsWith('/') && !path.startsWith('//') ? path : fallback;
}

export default function EditRecipePage() {
  const router = useRouter();
  const { id: uid } = useParams() as { id: string };

  // Fetch recipe
  const { data: recipe, error: recipeError, isLoading: loadingRecipe } = useData<RecipeType>(`${API.recipes}/${encodeURIComponent(uid)}`);

  // Fetch all tags
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [formData, setFormData] = useState<RecipeType>(initialRecipeValues);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  usePageTitle(recipe?.title);

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

      if (redirect) {
        router.push(safeRedirect(redirect, '/recipes'));
      } else {
        router.push(`/recipes/${uid}`);
      }
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
    <div className="max-w-4xl mx-auto p-3 sm:px-5">
      <form onSubmit={handleSubmit} className="relative">
        <div className="inline-block flex items-center mb-4">
          <InputField id="title" name="title" value={formData.title} onChange={handleGeneralFieldChange} className="!mb-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            value={formData.ingredients}
            onChange={handleGeneralFieldChange}
            textAreaClassName="h-80 sm:h-60"
          />
         <TextAreaField
            id="instructions"
            name="instructions"
            label="Instructions"
            value={formData.instructions}
            onChange={handleGeneralFieldChange}
            textAreaClassName="h-80 sm:h-60"
          />
        </div>
        <TextAreaField
          id="description"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleGeneralFieldChange}
          textAreaClassName="h-32"
          wrapperClassName="mt-3 mb-6"
        />
        {loadingTags
          ? <LoadingMessage />
          : <TagButtons name="tags" tags={tags || []} selectedTags={formData.tags} onChange={handleTagChange}
        />}
        <InputField id="reference" name="reference" label="Reference" value={formData.reference} onChange={handleGeneralFieldChange} />
        <Uid uid={formData.uid} />
        <SharedLink text="Delete recipe" styles="absolute mt-2 text-red-800 hover:text-red-400" onClick={confirmDeletion} />
        <div className="sticky -bottom-4 flex justify-end">
          <SubmitButton disabled={isSaving} styles="translate-x-1 lg:translate-x-20 -translate-y-4 my-0" text={isSaving ? 'Saving...' : 'Save'} />
        </div>
      </form>
    </div>
  );
}
