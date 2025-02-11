/**
 * New Recipe page
 */
'use client';

import { useState } from 'react';
// import type { Recipe } from '@/types/types';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import DateField from '@/components/DateField';

export default function New() {
  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [reference, setReference] = useState('');

  // Function to generate a slug from the title
  const generateSlug = (text: string) => 
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric characters
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setUid(generateSlug(newTitle)); // Auto-fill UID
  };

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUid = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''); // Enforce rules
    setUid(newUid);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {};

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {};

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {};

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div>
      <form action="">
        <InputField id="title" label="Title" value={title} onChange={handleTitleChange} />
        <InputField id="uid" label="uid" value={uid} onChange={handleUidChange} />

        <InputField id="tags" label="Tags" value={tags} onChange={handleTagsChange} />{/* pre-select from list of tags */}

        <DateField id="date" label="Date" value={date} onChange={handleDateChange} />{/* auto-fill current date; ISO string format (YYYY-MM-DD) */}

        <TextAreaField id="description" label="Description" value={description} onChange={handleDescriptionChange} />
        <TextAreaField id="ingredients" label="Ingredients" value={ingredients} onChange={handleIngredientsChange} />
        <TextAreaField id="instructions" label="Instructions" value={instructions} onChange={handleInstructionsChange} />

        <InputField id="reference" label="Reference" value={reference} onChange={handleReferenceChange} />
      </form>
    </div>
  );
}
