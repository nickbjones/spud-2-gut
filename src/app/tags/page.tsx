/**
 * Tags page
 */
'use client';

import { useEffect, useState } from 'react';
import type { Tag } from '@/types/tag';
import { getAllTags } from '@/lib/api/tags';
import Link from 'next/link';

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    getAllTags()
      .then(setTags)
      .catch(() => setTags([]));
  }, []);

  // TODO: add loading state

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
