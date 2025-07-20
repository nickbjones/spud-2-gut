export default function SubmitButton({ text, disabled }: { text: string, disabled?: boolean }) {
  const SubmitButtonStyles = `
    my-4
    bg-blue-500
    text-white
    p-2
    rounded
    hover:bg-blue-600
    disabled:bg-gray-400
    disabled:cursor-not-allowed
  `;

  return (
    <button
      type="submit"
      className={SubmitButtonStyles}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}
