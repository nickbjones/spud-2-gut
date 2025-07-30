/**
 * Edit Tag page
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import type { TagType } from '@/types/tag';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';

const initialValues: TagType = {
  id: '',
  uid: '',
  title: '',
  date: '',
};

export default function Edit() {
  const router = useRouter();
  const params = useParams();
  const uid = params.id as string;

  const [formData, setFormData] = useState<TagType>(initialValues);
  // const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  // const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [loadingTag, setLoadingTag] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // // to be used later to check if a tag title exists already
  // const fetchTags = useCallback(async () => {
  //   try {
  //     const res = await fetch(`/api/tags`);
  //     if (!res.ok) throw new Error('Failed to fetch tags');
  //     const tagData: TagType[] = await res.json();
  //     setAvailableTags(tagData);
  //   } catch (err) {
  //     setAvailableTags([]);
  //     setError((err as Error).message);
  //   } finally {
  //     setLoadingTags(false);
  //   }
  // }, []);

  const fetchTag = useCallback(async () => {
    try {
      const res = await fetch(`/api/tags/${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error('Failed to fetch tag.');
      const tagData: TagType = await res.json();
      setFormData(tagData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingTag(false);
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetchTag();
      // // to be used later to check if a tag title exists already
      // fetchTags();
    }
  }, [uid, fetchTag]);

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

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
      setError(`Error saving tag. ${(err as Error).message}`);
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
      setError((err as Error).message);
    }
  };

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
        <p className="text-sm mt-6 mb-3">
          <span className="text-gray-600 font-medium mr-2">UID:</span>
          <span className="text-gray-400">{uid}</span>
        </p>
      </form>
      <SharedLink text="Delete tag" styles="text-red-800 hover:text-red-400" onClick={deleteTag} />
    </div>
  );
}
