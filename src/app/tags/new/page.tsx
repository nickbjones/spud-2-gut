/**
 * New Tag page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { TagType } from '@/types/tag';
import { initialTagValues } from '@/lib/initialValues';
import { uidRules, generateUid, getNewId, doesTagTitleExist } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import SubmitButton from '@/components/SubmitButton';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import ColorPicker from '@/components/ColorPicker';

export default function NewTagPage() {
  usePageTitle('New Tag');
  const router = useRouter();

  // Fetch all tags
  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  const [formData, setFormData] = useState<TagType>(initialTagValues);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [isTitleExisting, setIsTitleExisting] = useState<boolean>(false);

  useEffect(() => {
    const newId = getNewId('TAG', tags || []);
    setFormData((prev) => ({ ...prev, id: newId }));
  }, [tags]);

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setIsTitleExisting(doesTagTitleExist(tags, newTitle));
    setFormData((prev) => ({
      ...prev,
      title: e.target.value,
      uid: generateUid(newTitle, tags || []),
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
    setSubmitError('');

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
      setSubmitError(`Error saving tag. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const error = submitError || tagsError?.message || '';

  if (loadingTags) return <LoadingMessage />;
  if (!tags || tags.length < 1) return <ErrorMessage text="No tags!" />;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <InputField id="title" name="title" label="Title" value={formData.title} onChange={handleTitleChange} required />
        {isTitleExisting && (
          <div className="absolute -mt-2">
            <p className="text-xs text-red-700">Title exists already!</p>
          </div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          <TextAreaField
            id="description"
            name="description"
            label="Description"
            value={formData.description || ''}
            onChange={handleGeneralFieldChange}
            className="h-16"
          />
          <ColorPicker
            id="color"
            name="color"
            label="Color"
            value={formData.color || ''}
            onChange={handleGeneralFieldChange}
          />
        </div>
        <InputField id="uid" name="uid" label="UID" value={formData.uid} onChange={handleUidChange} required />
        <SubmitButton text={isSaving ? 'Saving...' : 'Save Tag'} disabled={isSaving} />
      </form>
    </div>
  );
}
