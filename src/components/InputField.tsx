import Required from './Required';
import { labelStyles, inputStyles } from './sharedFormStyles';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function InputField({
    id,
    name,
    label,
    value,
    onChange,
    className,
    ...rest
  }: InputFieldProps) {
  return (
    <>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
          {rest.required && <Required />}
        </label>
      )}
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={inputStyles + (className ? ` ${className}` : '')}
        {...rest}
      />
    </>
  );
}
