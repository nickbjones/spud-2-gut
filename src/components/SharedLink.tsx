import Link from 'next/link';

const sharedLinkStyles = `
  py-1
  text-blue-800
  hover:text-blue-400
  transition-all
`;

export default function SharedLink({href, text, styles}: {href: string, text: string, styles?: string}) {
  return (
    <Link href={href} className={sharedLinkStyles + (styles ? ` ${styles}` : '')}>
      {text}
    </Link>
  );
}
