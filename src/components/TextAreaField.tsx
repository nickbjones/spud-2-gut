type TextAreaField = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextAreaField(input: TextAreaField) {
  return (
    <>
      <label htmlFor={input.id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{input.label}</label>
      <textarea
        id={input.id}
        value={input.value}
        onChange={input.onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </>
  );
}
