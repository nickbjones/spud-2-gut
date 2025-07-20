import Link from 'next/link';

const sharedLinkStyles = `
  py-1
  text-blue-800
  hover:text-blue-400
  transition-all
`;

type SharedLinkProps = {
  text: string;
  href?: string;
  styles?: string;
  onClick?: () => void;
};

export default function SharedLink({ text, href, styles, onClick}: SharedLinkProps) {
  return (
    <Link
      href={href || ''}
      className={sharedLinkStyles + (styles ? ` ${styles}` : '')}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}
