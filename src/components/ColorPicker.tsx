import { labelStyles } from './sharedFormStyles';

type ColorPickerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const colorStyles = `w-24 h-12`;

export default function ColorPicker({
  id,
  name,
  label,
  value,
  onChange,
  className,
  ...rest
}: ColorPickerProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
        </label>
      )}
      <input
        type="color"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={colorStyles + (className ? ` ${className}` : '')}
        {...rest}
      />
    </div>
  );
}
