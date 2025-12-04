import { defaultTagColor } from '@/lib/initialValues';
import { getTagColor } from '@/lib/utils/helpers';
import Link from 'next/link';

export const sharedTagStyles = `
  px-2
  py-1
  sm:px-4
  sm:py-2
  text-center
  text-xs
  sm:text-sm
  border-4
  rounded-lg
  cursor-pointer
`;

export const selectedTagStyles = `
  border-blue-600
`;

export const unselectedTagStyles = `
  border-white
`;

export const miniTagStyles = `
  py-0
  px-1
  text-center
  text-[10px]
  rounded-lg
`;

type TagProps = {
  uid: string;
  color?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Tag({uid, color = defaultTagColor, className, children}: TagProps) {
  return (
    <Link
      href={`/tags/${uid}`}
      className={`${sharedTagStyles} ${className}`}
      style={getTagColor(color)}
    >
      {children}
    </Link>
  );
}
