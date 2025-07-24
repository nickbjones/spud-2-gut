/**
 * Edit Recipe page
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams, useSearchParams, notFound } from 'next/navigation';
import type { Recipe } from '@/types/recipe';
import type { Tag } from '@/types/tag';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/SubmitButton';

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

  const ingredientsTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const instructionsTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const searchParams = useSearchParams();

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
      setError(`Failed to load tags. ${(err as Error).message}`);
    } finally {
      setLoadingTags(false);
    }
  }, []);

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error('Failed to fetch recipe');
      const recipeData: Recipe = await res.json();
      setFormData(recipeData);
    } catch (err) {
      setError(`Failed to load recipe. ${(err as Error).message}`);
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

  useEffect(() => {
    const focusParam = searchParams.get('focus');

    // stupid temporary fix to wait for the DOM to be loaded
    setTimeout(() => {
      if (focusParam === 'ingredients') {
        ingredientsTextareaRef.current?.focus();
      } else if (focusParam === 'instructions') {
        instructionsTextareaRef.current?.focus();
      }
    }, 1000);
  }, [searchParams]);

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
            ref={ingredientsTextareaRef}
            id="ingredients"
            name="ingredients"
            label="Ingredients"
            value={formData.ingredients}
            onChange={handleGeneralFieldChange}
            className="h-32"
          />
         <TextAreaField
            ref={instructionsTextareaRef}
            id="instructions"
            name="instructions"
            label="Instructions"
            value={formData.instructions}
            onChange={handleGeneralFieldChange}
            className="h-32"
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
    </div>
  );
}
