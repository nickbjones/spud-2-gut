export default function SubmitButton({ text }: { text: string }) {
  return (
    <button type="submit" className="my-4 bg-blue-500 text-white p-2 rounded">{text}</button>
  );
}
