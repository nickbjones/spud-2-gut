/**
 * Edit Recipe page
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import type { Recipe } from '@/types/recipe';
import type { Tag } from '@/types/tag';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';

type RecipeEditable = {
  id: string;
  title: string;
  tags: string[];
  description: string;
  ingredients: string;
  instructions: string;
  reference: string;
};

const initialValues: RecipeEditable = {
  id: '',
  title: '',
  tags: [],
  description: '',
  ingredients: '',
  instructions: '',
  reference: '',
};

export default function Edit() {
  const router = useRouter();
  const params = useParams();
  const uid = params.id as string;

  const [formData, setFormData] = useState<RecipeEditable>(initialValues);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [loadingRecipe, setLoadingRecipe] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`/api/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const tagData: Tag[] = await res.json();
      setAvailableTags(tagData);
    } catch (err) {
      setAvailableTags([]);
      setError((err as Error).message);
    } finally {
      setLoadingTags(false);
    }
  }, []);

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error('Failed to fetch recipe.');
      const recipeData: Recipe = await res.json();
      setFormData(recipeData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingRecipe(false);
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetchRecipe();
      fetchTags();
    }
  }, [uid, fetchRecipe, fetchTags]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError('');

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
      setError(`Error saving recipe. ${(err as Error).message}`);
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
      setError((err as Error).message);
    }
  };

  const confirmDeletion = () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe();
    }
  };

  if (loadingRecipe) return <LoadingMessage />;
  if (!formData) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <input type="hidden" id="id" name="id" value={formData.id} />
        <InputField id="title" name="title" label="Title" value={formData.title} onChange={handleGeneralFieldChange} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            value={formData.ingredients}
            onChange={handleGeneralFieldChange}
            className="h-64 sm:h-32"
          />
         <TextAreaField
            id="instructions"
            name="instructions"
            label="Instructions"
            value={formData.instructions}
            onChange={handleGeneralFieldChange}
            className="h-64 sm:h-32"
          />
        </div>
        <TextAreaField id="description" name="description" label="Description" value={formData.description} onChange={handleGeneralFieldChange} className="h-16" />
        {loadingTags
          ? <LoadingMessage />
          : <TagButtons name="tags" tags={availableTags} selectedTags={formData.tags} onChange={handleTagChange}
        />}
        <InputField id="reference" name="reference" label="Reference" value={formData.reference} onChange={handleGeneralFieldChange} />
        <p className="text-gray-600 font-medium text-sm">UID</p>
        <p className="text-gray-600 font-medium text-sm my-2">{uid}</p>
        <SubmitButton text={isSaving ? 'Saving...' : 'Save Changes'} disabled={isSaving} />
      </form>
      <SharedLink text="Delete recipe" styles="text-red-800 hover:text-red-400" onClick={confirmDeletion} />
    </div>
  );
}
