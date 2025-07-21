import Link from 'next/link';

const tagStyles = `
  text-center
  mr-2
  px-4
  py-2
  text-sm
  border
  rounded-lg
  bg-blue-500
  text-white
  border-blue-500
`;

export default function Tag({uid, text}: {uid: string, text: string}) {
  return (
    <Link href={`/tags/${uid}`} className={tagStyles}>{text}</Link>
  );
}
