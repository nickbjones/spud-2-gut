/**
 * Edit Tag page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import type { TagType } from '@/types/tag';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';
import { initialTagValues } from '@/lib/initialValues';
import ColorPicker from '@/components/ColorPicker';

export default function Edit() {
  const router = useRouter();
  const { id: uid } = useParams() as { id: string };

  // // to be used later to check if a tag title exists already
  // const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);
  const { data: tag, error: tagError, isLoading: loadingTag } = useData<TagType>(`${API.tags}/${encodeURIComponent(uid)}`);

  const [formData, setFormData] = useState<TagType>(initialTagValues);
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    if (tag) {
      setFormData(tag);
    }
  }, [tag]);

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError('');

    try {
      const res = await fetch(`/api/tags/${encodeURIComponent(formData.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update tag');
      };

      router.push(`/tags/${uid}`);
    } catch (err) {
      setSubmitError(`Error saving tag. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  }

  const deleteTag = async () => {
    if (!confirm(`Are you sure you want to delete the tag "${formData.title}"?`)) return;

    // check here if this tag exists in any recipes
    // if so, show a warning and do not delete
    // for now, just confirm deletion
    try {
      if (!formData) throw new Error('Tag not found');

      const res = await fetch(`/api/tags/${encodeURIComponent(formData.id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete tag');
      };

      // Redirect to tags list after deletion
      window.location.href = '/tags';
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  };

  const error = submitError || tagError?.message || '';

  if (loadingTag) return <LoadingMessage />;
  if (!formData) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="inline-block flex items-center mb-4">
          <InputField id="title" name="title" value={formData.title} onChange={handleGeneralFieldChange} className="!mb-0" />
          <SubmitButton disabled={isSaving} styles="!my-0 ml-10 text-sm" text={isSaving ? 'Saving...' : 'Save'} />
        </div>
        <TextAreaField
          id="description"
          name="description"
          label="Description"
          value={formData.description || ''}
          onChange={handleGeneralFieldChange}
          className="h-32"
        />
        <ColorPicker
          id="color"
          name="color"
          label="Color"
          value={formData.color || ''}
          onChange={handleGeneralFieldChange}
        />
        <p className="text-sm mt-6 mb-3">
          <span className="text-gray-600 font-medium mr-2">UID:</span>
          <span className="text-gray-400">{uid}</span>
        </p>
      </form>
      <SharedLink text="Delete tag" styles="text-red-800 hover:text-red-400" onClick={deleteTag} />
    </div>
  );
}
