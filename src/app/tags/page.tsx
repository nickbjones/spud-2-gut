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

export default function Tags() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      const tagData: TagType[] = await res.json();
      setTags(tagData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  if (loading) return <LoadingMessage />;
  if (tags.length < 1) return <ErrorMessage text="No tags!" />;
  if (error) return <ErrorMessage text={error} />;

  tags.sort((a, b) => a.uid.localeCompare(b.uid));

  return (
    <div className="p-3 sm:p-6">
      <SharedLink text="+ New Tag" href="/tags/new" />
      {/* tags list */}
      <ul className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag: TagType) => (
          <Tag key={tag.uid} uid={tag.uid} text={tag.title} className={`${selectedTagStyles} !mr-0`} />
        ))}
      </ul>
    </div>
  );
}
