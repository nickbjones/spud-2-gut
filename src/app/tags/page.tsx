/**
 * Tags page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Tag } from '@/types/tag';
import CustomLink from '@/components/SharedLink';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      const recipeData: Tag[] = await res.json();
      setTags(recipeData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  if (loading) return <LoadingMessage />;
  if (tags.length < 1) return <p>No tags!</p>;
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Tags</h1>
      <ul>
        {tags.map((tag: Tag) => (
          <li key={tag.uid}>
            <CustomLink href={`tags/${tag.uid}`} text={tag.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
