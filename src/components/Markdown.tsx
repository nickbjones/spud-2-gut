import React from 'react';
import Markdown from 'react-markdown';

type MdProps = {
  children: string;
  className?: string;
};

export default function Md({ children, className = '' }: MdProps) {
  return (
    <Markdown className={`prose ${className}`}>
      {children}
    </Markdown>
  );
}
