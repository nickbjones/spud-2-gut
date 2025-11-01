import React from 'react';
import { labelStyles, inputStyles } from './sharedFormStyles';

type TextAreaField = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textAreaClassName?: string;
  wrapperClassName?: string;
};

export default function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  textAreaClassName,
  wrapperClassName,
  ...rest
}: TextAreaField) {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className={labelStyles}>{label}</label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={inputStyles + (textAreaClassName ? ` ${textAreaClassName}` : '')}
        {...rest}
      />
    </div>
  );
};
