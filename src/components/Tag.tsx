import Link from 'next/link';

export const sharedTagStyles = `
  mr-1
  px-2
  py-1
  sm:mr-2
  sm:px-4
  sm:py-2
  text-center
  text-xs
  sm:text-sm
  border
  rounded-lg
  cursor-pointer
`;

export const selectedTagStyles = `
  bg-blue-500
  text-white
  border-blue-500
`;

export const unselectedTagStyles = `
  bg-white
  text-gray-800
  border-gray-300
`;

export default function Tag({uid, text, className}: {uid: string, text: string, className?: string}) {
  return (
    <Link href={`/tags/${uid}`} className={`${sharedTagStyles} ${className}`}>{text}</Link>
  );
}
