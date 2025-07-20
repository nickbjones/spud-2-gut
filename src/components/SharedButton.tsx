import Link from 'next/link';

const sharedButtonStyles = `
  px-3
  py-2
  text-white
  rounded-md
  bg-blue-500
  hover:bg-blue-400
  transition
`;

type SharedButtonProps = {
  text: string;
  href?: string;
  styles?: string;
  onClick?: () => void;
};

export default function SharedButton({ text, href, styles, onClick}: SharedButtonProps) {
  return (
    <Link
      href={href || ''}
      className={sharedButtonStyles + (styles ? ` ${styles}` : '')}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}
