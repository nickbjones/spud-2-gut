import { labelStyles, inputStyles } from './sharedStyles';

type DateField = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DateField(input: DateField) {
  return (
    <>
      <label htmlFor={input.id} className={labelStyles}>{input.label}</label>
      <input
        type="date"
        id={input.id}
        name={input.name}
        value={input.value}
        onChange={input.onChange}
        className={inputStyles}
      />
    </>
  );
}
