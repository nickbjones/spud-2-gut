/**
 * New Recipe page
 */
'use client';

import { useState, useEffect } from 'react';
import type { Tag } from '@/types/types';
import { getAllTags } from '@/lib/fetchData';
import { generateSlug } from '@/lib/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import DateField from '@/components/DateField';
import TagButtons from '@/components/TagButtons';

export default function New() {
  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    getAllTags()
      .then(setTags)
      .catch(() => setTags([]));
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setUid(generateSlug(newTitle)); // Auto-fill UID
  };

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUid = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''); // Enforce rules
    setUid(newUid);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setIngredients(e.target.value);

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value);

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => setReference(e.target.value);

  return (
    <div>
      <form>
        <InputField id="title" label="Title" value={title} onChange={handleTitleChange} />
        <InputField id="uid" label="uid" value={uid} onChange={handleUidChange} />
        <TagButtons id="tags" tags={tags} selectedTags={selectedTags} onChange={setSelectedTags} />
        <DateField id="date" label="Date" value={date} onChange={handleDateChange} />
        <TextAreaField id="description" label="Description" value={description} onChange={handleDescriptionChange} />
        <TextAreaField id="ingredients" label="Ingredients" value={ingredients} onChange={handleIngredientsChange} />
        <TextAreaField id="instructions" label="Instructions" value={instructions} onChange={handleInstructionsChange} />
        <InputField id="reference" label="Reference" value={reference} onChange={handleReferenceChange} />
      </form>
    </div>
  );
}
