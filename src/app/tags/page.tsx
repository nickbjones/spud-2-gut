/**
 * Tags page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Tag } from '@/types/tag';
import Link from 'next/link';

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

  if (loading) return <p>Loading...</p>;
  if (tags.length < 1) return <p>No tags!</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Tags</h1>
      <ul>
        {tags.map((tag: Tag) => (
          <li key={tag.uid}>
            <Link href={`tags/${tag.uid}`}>{tag.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
