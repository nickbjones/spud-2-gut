/**
 * New Tag page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { TagType } from '@/types/tag';
import { uidRules, generateUid, getNewId } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import SubmitButton from '@/components/SubmitButton';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';

export default function New() {
  const router = useRouter();

  const initialValues: TagType = {
    id: '',
    uid: '',
    title: '',
    description: '',
    color: '',
    date: new Date().toISOString().split('T')[0], // today
  };

  const [formData, setFormData] = useState<TagType>(initialValues);
  const [existingTags, setExistingTags] = useState<TagType[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchTags = async () => {
    try {
      const res = await fetch(`/api/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const tagData: TagType[] = await res.json();
      setExistingTags(tagData);
      setFormData((prev) => ({
        ...prev,
        id: getNewId('TAG', tagData),
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    fetchTags();
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
      title: e.target.value,
      uid: generateUid(newTitle, existingTags),
    }));
  };

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUid = e.target.value.toLowerCase().replace(uidRules, ''); // enforce rules
    setFormData((prev) => ({
      ...prev,
      uid: newUid,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create tag');
      }

      const newTag = await response.json();
      router.push(`/tags/${newTag.uid}`);
    } catch (err) {
      setError(`Error saving tag. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingTags) return <LoadingMessage />;
  if (existingTags.length < 1) return <ErrorMessage text="No tags!" />;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <InputField id="title" name="title" label="Title" value={formData.title} onChange={handleTitleChange} required />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="description"
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleGeneralFieldChange}
            className="h-80 sm:h-32"
          />
          <TextAreaField
            id="color"
            name="color"
            label="Color"
            value={formData.color}
            onChange={handleGeneralFieldChange}
            className="h-80 sm:h-32"
          />
        </div>
        <InputField id="uid" name="uid" label="UID" value={formData.uid} onChange={handleUidChange} required />
        <input type="hidden" id="date" name="date" value={formData.date} />
        <SubmitButton text={isSaving ? 'Saving...' : 'Save Tag'} disabled={isSaving} />
      </form>
    </div>
  );
}
