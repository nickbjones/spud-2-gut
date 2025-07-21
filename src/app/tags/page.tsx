/**
 * Tags page
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Tag as TagType} from '@/types/tag';
import Tag from '@/components/Tag';
import SharedLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SharedHeading from '@/components/SharedHeading';
import InputField from '@/components/InputField';
import SubmitButton from '@/components/SubmitButton';
import { generateUid } from '@/lib/utils/helpers';

export default function Tags() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isEditingNewTag, setIsEditingNewTag] = useState<boolean>(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagUid, setEditingTagUid] = useState<string | null>(null);
  const [id, setId] = useState<string>('');
  const [uid, setUid] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');

  // move to shared library
  function getNewId(prefix: string, data: { id: string }[]): string {
    const maxId = data.reduce((max, item) => {
      const num = parseInt(item.id.replace(`${prefix}#`, ''), 10);
      return num > max ? num : max;
    }, 0);

    const nextId = (maxId + 1).toString().padStart(3, '0');
    return `${prefix}#${nextId}`;
  }

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
      setError(`Failed to load tags. ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleToggleNewTagClick = () => {
    setIsEditingNewTag(true);
  }

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

  const handleDelete = async (tag: TagType) => {
    // check here if this tag is used in any recipes
    // if so, show a warning and do not delete
    // for now, just confirm deletion
    if (!confirm(`Are you sure you want to delete the tag "${tag.title}"?`)) return;

    console.log('Deleting tag:', tag);

    try {
      const response = await fetch(`/api/tags/${encodeURIComponent(tag.id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tag');
      }

      await fetchTags();
    } catch (err) {
      setError(`Failed to delete tag. ${(err as Error).message}`);
    }
  };

  const startEditing = (tag: TagType) => {
    setEditingTagId(tag.id);
    setEditingTagUid(tag.uid);
    setEditedTitle(tag.title);
  };

  const stopEditing = () => {
    setEditingTagId(null);
    setEditingTagUid(null);
    setEditedTitle('');
  };

  const handleSave = async () => {
    if (!editingTagId || !editedTitle.trim()) return;
    try {
      await fetch(`/api/tags/${encodeURIComponent(editingTagId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTagId, uid: editingTagUid, title: editedTitle }),
      });
      // optionally trigger revalidation or refresh local state
      stopEditing();
      await fetchTags();
    } catch (err) {
      setError(`Failed to save tag. ${(err as Error).message}`);
    }
  };

  // TODO: used for what?
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      stopEditing();
    }
  };

  if (loading) return <LoadingMessage />;
  if (tags.length < 1) return <p>No tags!</p>;
  if (error) return <ErrorMessage text={error} />;

  tags.sort((a, b) => a.uid.localeCompare(b.uid));

  return (
    <div className="p-6">
      <SharedHeading text="Tags" />
      <ul className="flex flex-wrap gap-1">
        {tags.map((tag: TagType) => (
          <li key={tag.uid} className="my-1 group">
            {editingTagId === tag.id ? (
              <>
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border px-2 py-1 rounded w-full max-w-xs"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="ml-2 text-green-600 hover:text-green-800"
                  aria-label="Save edit"
                >
                  💾
                </button>
                <button
                  onClick={stopEditing}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Cancel edit"
                >
                  ❌
                </button>
              </>
            ) : (
              <>
                <Tag uid={tag.uid} text={tag.title} />
                <div className="invisible group-hover:visible flex gap-2 ml-2 mr-auto">
                  <button
                    onClick={() => startEditing(tag)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit tag"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(tag)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete tag"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
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
          />
          <SubmitButton text={isSaving ? 'Saving...' : 'Save'} disabled={isSaving} />
        </form>
      ) : (
        <SharedLink text="+ New Tag" onClick={handleToggleNewTagClick} />
      )}
    </div>
  );
}
