/**
 * New Tag client page
 */
'use client';

import { useState, useEffect } from 'react';
import { useTags } from '@/hooks/useTags';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { TagType } from '@/types/tag';
import { initialTagValues } from '@/lib/initialValues';
import { uidRules, generateUid, getNewId, doesTagTitleExist } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import SubmitButton from '@/components/SubmitButton';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import ColorPicker from '@/components/ColorPicker';

export default function NewTagClientPage() {
  const { tags, createTag, isLoadingTags, isCreatingTag } = useTags();

  usePageTitle('New Tag');

  // form state
  const [form, setForm] = useState<TagType>(initialTagValues);

  const [isTitleExisting, setIsTitleExisting] = useState<boolean>(false);

  // create new ID on load
  useEffect(() => {
    const newId = getNewId('TAG', tags || []);
    setForm((prev) => ({ ...prev, id: newId }));
  }, [tags]);

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setIsTitleExisting(doesTagTitleExist(tags, newTitle));
    setForm((prev) => ({
      ...prev,
      title: e.target.value,
      uid: generateUid(newTitle, tags || []),
    }));
  };

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUid = e.target.value.toLowerCase().replace(uidRules, ''); // enforce rules
    setForm((prev) => ({
      ...prev,
      uid: newUid,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTag(form);
  };

  if (isLoadingTags) return <LoadingMessage />;
  if (!tags || tags.length < 1) return <ErrorMessage text="No tags!" />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <InputField id="title" name="title" label="Title" value={form.title} onChange={handleTitleChange} required />
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
            value={form.description || ''}
            onChange={handleGeneralFieldChange}
            textAreaClassName="h-16"
          />
          <ColorPicker
            id="color"
            name="color"
            label="Color"
            value={form.color || ''}
            onChange={handleGeneralFieldChange}
          />
        </div>
        <InputField id="uid" name="uid" label="UID" value={form.uid} onChange={handleUidChange} required />
        <SubmitButton text={isCreatingTag ? 'Saving...' : 'Save Tag'} disabled={isCreatingTag} />
      </form>
    </div>
  );
}
