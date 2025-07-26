import React from 'react';
import { labelStyles, inputStyles } from './sharedFormStyles';

type TextAreaField = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export default function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  className,
  ...rest
}: TextAreaField) {
  return (
    <div>
      <label htmlFor={id} className={labelStyles}>{label}</label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={inputStyles + (className ? ` ${className}` : '')}
        {...rest}
      />
    </div>
  );
};
