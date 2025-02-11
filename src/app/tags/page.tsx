/**
 * Tags page
 */
import type { Tag } from '@/types/types';
import { tags } from '@/lib/mock';
import Link from 'next/link';

export default function Tags() {
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
