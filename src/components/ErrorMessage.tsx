export default function ErrorMessage({ text }: { text: string }) {
  return <p className="py-2 px-6 bg-red-500 text-white">{text}</p>;
}
