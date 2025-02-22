/**
 * New Recipe page
 */
'use client';

import { useState, useEffect } from 'react';
import type { Recipe } from '@/types/recipe';
import type { Tag } from '@/types/tag';
import { getRecipeCount, createRecipeInDynamoDb } from '@/lib/api/recipes';
import { getAllTags } from '@/lib/api/tags';
import { uidRules, generateUid } from '@/lib/utils/helpers';
import { errorMessages } from '@/lib/constants/errorMessages';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import DateField from '@/components/DateField';
import TagButtons from '@/components/TagButtons';
import SubmitButton from '@/components/SubmitButton';

export default function New() {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // get list of tags
    getAllTags()
      .then((tags: Tag[]) => setAvailableTags(tags))
      .catch(() => {
        setAvailableTags([]);
        setErrorMessage(errorMessages.cannotFetchTags);
      });
    // increment id
    getRecipeCount()
      .then((count) => setFormData((prev) => ({ ...prev, id: String(Number(count) + 1) })))
      .catch(() => setErrorMessage(errorMessages.cannotSetIndex));
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

      return await response.json();
    } catch (error) {
      console.error('Error creating recipe:', error);
      return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="mb-3 text-red-500">{errorMessage}</p>}
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
