/**
 * New Recipe page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Recipe } from '@/types/recipe';
import type { Tag } from '@/types/tag';
import { uidRules, generateUid } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import TagButtons from '@/components/TagButtons';
import SubmitButton from '@/components/SubmitButton';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';

export default function New() {
  const router = useRouter();

  const initialValues: Recipe = {
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

  const [formData, setFormData] = useState<Recipe>(initialValues);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTags = async () => {
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
  };

  // move to shared library
  function getNewId(prefix: string, data: { id: string }[]): string {
    const maxId = data.reduce((max, item) => {
      const num = parseInt(item.id.replace(`${prefix}#`, ''), 10);
      return num > max ? num : max;
    }, 0);

    const nextId = (maxId + 1).toString().padStart(3, '0');
    return `${prefix}#${nextId}`;
  }

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      if (!res.ok) throw new Error('Failed to fetch recipes');
      const recipeData: Recipe[] = await res.json();
      setRecipes(recipeData);
      const newId = getNewId('RECIPE', recipeData);
      setFormData((prev) => ({ ...prev, id: newId }))
    } catch (err) {
      setError(`Failed to load recipes. ${(err as Error).message}`);
    } finally {
      setLoadingRecipes(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchRecipes();
  }, []);

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
      uid: generateUid(newTitle, recipes),
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
    setError('');

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
      setError(`Error saving recipe. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingTags || loadingRecipes) return <LoadingMessage />;
  if (recipes.length < 1) return <p>No recipes!</p>;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <input type="hidden" id="id" name="id" value={formData.id} />
        <InputField id="title" name="title" label="Title" value={formData.title} onChange={handleTitleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <TextAreaField id="ingredients" name="ingredients" label="Ingredients" value={formData.ingredients} onChange={handleGeneralFieldChange} className="h-32" />
          <TextAreaField id="instructions" name="instructions" label="Instructions" value={formData.instructions} onChange={handleGeneralFieldChange} className="h-32" />
        </div>
        <TextAreaField id="description" name="description" label="Description" value={formData.description} onChange={handleGeneralFieldChange} className="h-16" />
        <TagButtons id="tags" name="tags" tags={availableTags} selectedTags={formData.tags} onChange={handleTagChange} />
        <InputField id="reference" name="reference" label="Reference" value={formData.reference} onChange={handleGeneralFieldChange} />
        <InputField id="uid" name="uid" label="UID" value={formData.uid} onChange={handleUidChange} required />
        <SubmitButton text={isSaving ? 'Saving...' : 'Save Recipe'} disabled={isSaving} />
      </form>
    </div>
  );
}
