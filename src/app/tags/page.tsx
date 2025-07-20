/**
 * Tags page
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tag } from '@/types/tag';
import SharedButton from '@/components/SharedButton';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import InputField from '@/components/InputField';
import SubmitButton from '@/components/SubmitButton';
import { generateUid } from '@/lib/utils/helpers';

export default function Tags() {
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditingNewTag, setIsEditingNewTag] = useState<boolean>(false);
  const [id, setId] = useState('');
  const [uid, setUid] = useState('');
  const [title, setTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // move to shared library
  function getNewId(prefix: string, data: { id: string }[]): string {
    const maxId = data.reduce((max, item) => {
      const num = parseInt(item.id.replace(`${prefix}#`, ''), 10);
      return num > max ? num : max;
    }, 0);

    const nextId = (maxId + 1).toString().padStart(3, '0');
    return `${prefix}#${nextId}`;
  }

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      const recipeData: Tag[] = await res.json();
      setTags(recipeData);
      const newId = getNewId('TAG', recipeData);
      setId(newId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleToggleNewTagClick = () => {
    setIsEditingNewTag(true);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newUid = generateUid(newTitle);
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
    } catch (error) {
      setError('Error saving tag.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingMessage />;
  if (tags.length < 1) return <p>No tags!</p>;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-6">
      <SharedButton href="/tags/new" text="+ New Tag" styles="float-right" />
      <SharedHeading text="Tags" />
      <ul>
        {tags.map((tag: Tag) => (
          <li key={tag.uid} className="my-2">
            <SharedLink href={`tags/${tag.uid}`} text={tag.title} />
          </li>
        ))}
      </ul>
      <div className="mt-4">
        {isEditingNewTag ? (
          <form onSubmit={handleSubmit}>
            <InputField
              id="newTag"
              name="newTag"
              label="New Tag"
              value={title}
              onChange={handleTitleChange}
              // autocomplete="off"
            />
            <input type="hidden" id="id" name="id" value={id} />
            <input type="hidden" id="uid" name="uid" value={uid} />
            <SubmitButton text={isSaving ? 'Saving...' : 'Save'} disabled={isSaving} />
          </form>
        ) : (
          <SharedLink text="+ New Tag" onClick={handleToggleNewTagClick} />
        )}
      </div>
    </div>
  );
}
