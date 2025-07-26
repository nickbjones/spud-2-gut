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

const disabledStyles = `
  bg-gray-300
  border-gray-300
  focus:bg-gray-300
  focus:border-gray-300
  cursor-not-allowed
`;

type SharedButtonProps = {
  text: string;
  href?: string;
  styles?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function SharedButton({ text, href, styles, onClick, disabled = false}: SharedButtonProps) {
  return (
    <Link
      href={href || ''}
      className={sharedButtonStyles + (styles ? ` ${styles}` : '') + (disabled ? disabledStyles : '')}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}
