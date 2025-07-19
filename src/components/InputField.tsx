import { labelStyles, inputStyles } from './sharedStyles';

type InputField = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputField(input: InputField) {
  return (
    <>
      <label htmlFor={input.id} className={labelStyles}>{input.label}</label>
      <input
        type="text"
        id={input.id}
        name={input.name}
        value={input.value}
        onChange={input.onChange}
        className={inputStyles}
      />
    </>
  );
}
