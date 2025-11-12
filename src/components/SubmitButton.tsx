const SubmitButtonStyles = `
  my-4
  bg-blue-500
  text-white
  px-2
  py-1
  sm:px-2
  sm:py-2
  rounded
  hover:bg-blue-600
  disabled:bg-gray-400
  disabled:cursor-not-allowed
`;

type SubmitButtonProps = {
  text: string;
  disabled?: boolean;
  styles?: string;
};

export default function SubmitButton({ text, disabled, styles }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`${SubmitButtonStyles}${styles ? ` ${styles}` : ''}`}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}
