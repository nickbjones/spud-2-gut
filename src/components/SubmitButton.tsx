type SubmitButton = {
  text: string;
};

export default function SubmitButton({ text }: SubmitButton) {
  return (
    <button type="submit" className="my-4 bg-blue-500 text-white p-2 rounded">{text}</button>
  );
}
