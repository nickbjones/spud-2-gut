import Link from 'next/link';

const tagStyles = `
  space-x-4
  m-1
  p-1
  text-xs
  text-white
  bg-gray-800
`;

export default function Tag({tag}: {tag: string}) {
  return (
    <Link href={`/tags/${tag}`} className={tagStyles}>{tag}</Link>
  );
}
