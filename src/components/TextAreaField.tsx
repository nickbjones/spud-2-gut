import { labelStyles, inputStyles } from './sharedFormStyles';

type TextAreaField = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextAreaField(input: TextAreaField) {
  return (
    <>
      <label htmlFor={input.id} className={labelStyles}>{input.label}</label>
      <textarea
        id={input.id}
        name={input.name}
        value={input.value}
        onChange={input.onChange}
        className={inputStyles}
      />
    </>
  );
}
