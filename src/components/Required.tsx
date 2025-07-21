const requiredStyles = `
  ml-1
  text-red-700
  text-xs
`;

// required component for form fields with optional text parameter
export default function Required({ text = '*required' }: { text?: string }) {
  return <span className={requiredStyles}>{text}</span>;
}
