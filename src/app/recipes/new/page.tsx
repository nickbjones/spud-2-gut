'use client';

import { useState } from 'react';
// import Recipe from '@/types/recipe';
import InputField from '@/components/InputField';

export default function New() {
  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState('');
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div>
      <form action="">
        <InputField id="title" label="Title" value={title} onChange={handleTitleChange} />{/* basic text */}
        <InputField id="uid" label="uid" value={uid} onChange={handleUidChange} />{/* auto-fill with title, hyphen-separated */}
        <InputField id="tags" label="Tags" value={tags} onChange={handleTagsChange} />{/* pre-select from list of tags or enter new */}
        <InputField id="date" label="Date" value={date} onChange={handleDateChange} />{/* auto-fill current date; ISO string format (YYYY-MM-DD) */}
        <InputField id="description" label="Description" value={description} onChange={handleDescriptionChange} />{/* markdown */}
        <InputField id="ingredients" label="Ingredients" value={ingredients} onChange={handleIngredientsChange} />{/* markdown list */}
        <InputField id="instructions" label="Instructions" value={instructions} onChange={handleInstructionsChange} />{/* markdown list */}
        <InputField id="reference" label="Reference" value={reference} onChange={handleReferenceChange} />{/* basic text URL */}
      </form>
    </div>
  );
}
