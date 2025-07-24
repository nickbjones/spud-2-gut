import React from 'react';
import { labelStyles, inputStyles } from './sharedFormStyles';

type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ id, name, label, value, onChange, className, ...rest }, ref) => {
    return (
      <div>
        <label htmlFor={id} className={labelStyles}>{label}</label>
        <textarea
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={inputStyles + (className ? ` ${className}` : '')}
          {...rest}
        />
      </div>
    );
  }
);

export default TextAreaField;
