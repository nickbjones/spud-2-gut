/**
 * New Recipe page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Recipe } from '@/types/recipe';
import type { Tag } from '@/types/tag';
import { uidRules, generateUid } from '@/lib/utils/helpers';
// FIX
// import { errorMessages } from '@/lib/constants/errorMessages';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import DateField from '@/components/DateField';
import TagButtons from '@/components/TagButtons';
import SubmitButton from '@/components/SubmitButton';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';

export default function New() {
  const router = useRouter();

  const initialValues = {
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTags = async () => {
    try {
      const res = await fetch(`/api/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const tagData: Tag[] = await res.json();
      setAvailableTags(tagData);
    } catch (err) {
      setAvailableTags([]);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      if (!res.ok) throw new Error('Failed to fetch recipes');
      const recipeData: Recipe[] = await res.json();
      setRecipes(recipeData);
      const newId = String(recipeData.length + 1);
      setFormData((prev) => ({ ...prev, id: newId }))

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
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
      uid: generateUid(newTitle),
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

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      const newRecipe = await response.json();
      router.push(`/recipes/${newRecipe.uid}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      return null;
    }
  };

  if (loading) return <LoadingMessage />;
  if (recipes.length < 1) return <p>No recipes!</p>;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <input type="hidden" id="id" name="id" value={formData.id} />
        <InputField id="title" name="title" label="Title" value={formData.title} onChange={handleTitleChange} />
        <InputField id="uid" name="uid" label="" value={formData.uid} onChange={handleUidChange} />
        <TagButtons id="tags" name="tags" tags={availableTags} selectedTags={formData.tags} onChange={handleTagChange} />
        <DateField id="date" name="date" label="Date" value={formData.date} onChange={handleGeneralFieldChange} />
        <TextAreaField id="description" name="description" label="Description" value={formData.description} onChange={handleGeneralFieldChange} />
        <TextAreaField id="ingredients" name="ingredients" label="Ingredients" value={formData.ingredients} onChange={handleGeneralFieldChange} />
        <TextAreaField id="instructions" name="instructions" label="Instructions" value={formData.instructions} onChange={handleGeneralFieldChange} />
        <InputField id="reference" name="reference" label="Reference" value={formData.reference} onChange={handleGeneralFieldChange} />
        <SubmitButton text="Save" />
      </form>
    </div>
  );
}
