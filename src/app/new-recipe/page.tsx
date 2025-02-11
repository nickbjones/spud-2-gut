/**
 * New Recipe page
 */
'use client';

import { useState, useEffect } from 'react';
import type { Tag } from '@/types/types';
import { getAllTags } from '@/lib/fetchData';
import { uidRules, generateUid } from '@/lib/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import DateField from '@/components/DateField';
import TagButtons from '@/components/TagButtons';
import SubmitButton from '@/components/SubmitButton';

export default function New() {
  type FormData = {
    title: string;
    uid: string;
    tags: string[];
    date: string;
    description: string;
    ingredients: string;
    instructions: string;
    reference: string;
  };

  const today = new Date().toISOString().split('T')[0];

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    uid: '',
    tags: [],
    date: today,
    description: '',
    ingredients: '',
    instructions: '',
    reference: '',
  });

  useEffect(() => {
    getAllTags()
      .then((tags: Tag[]) => setAvailableTags(tags))
      .catch(() => setAvailableTags([]));
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
