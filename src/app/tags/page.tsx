/**
 * Tags page
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TagType} from '@/types/tag';
import Tag, { selectedTagStyles } from '@/components/Tag';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import InputField from '@/components/InputField';
import SubmitButton from '@/components/SubmitButton';
import { generateUid, getNewId } from '@/lib/utils/helpers';

export default function Tags() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isEditingNewTag, setIsEditingNewTag] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [uid, setUid] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      const recipeData: TagType[] = await res.json();
      setTags(recipeData);
      const newId = getNewId('TAG', recipeData);
      setId(newId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newUid = generateUid(newTitle, tags);
    setTitle(newTitle);
    setUid(newUid);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, uid, title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create tag');
      }

      setIsEditingNewTag(false);
      setTitle('');
      setUid('');
      await fetchTags();
    } catch (err) {
      setError(`Failed to save tag. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingMessage />;
  if (tags.length < 1) return <ErrorMessage text="No tags!" />;
  if (error) return <ErrorMessage text={error} />;

  tags.sort((a, b) => a.uid.localeCompare(b.uid));

  return (
    <div className="p-6">
      <SharedHeading text="Tags" />
      <ul className="flex flex-wrap gap-1 sm:gap-2">
        {tags.map((tag: TagType) => (
          <Tag key={tag.uid} uid={tag.uid} text={tag.title} className={`${selectedTagStyles} !mr-0`} />
        ))}
      </ul>

      {/* new tag */}
      <div className="mt-4">
        {isEditingNewTag ? (
          <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
            <input type="hidden" id="id" name="id" value={id} />
            <input type="hidden" id="uid" name="uid" value={uid} />
            <InputField
              id="newTag"
              name="newTag"
              value={title}
              onChange={handleTitleChange}
              className="w-auto mb-0 h-10"
              autoFocus
              autoComplete="off"
            />
            <SubmitButton text={isSaving ? 'Saving...' : 'Save'} disabled={isSaving} />
          </form>
        ) : (
          <SharedLink text="+ New Tag" onClick={() => setIsEditingNewTag(true)} />
        )}
      </div>
    </div>
  );
}
