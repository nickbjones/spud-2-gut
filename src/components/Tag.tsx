import Link from 'next/link';

export default function Tag({tag}: {tag: string}) {
  return (
    <Link href={`/tags/${tag}`} className="bg-gray-800 text-white space-x-4 m-1 p-1">{tag}</Link>
  );
}
