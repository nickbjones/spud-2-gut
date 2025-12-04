import React from 'react';

type HeadingType = 'h1' | 'h2' | 'h3';

type SharedHeadingProps = {
  type?: HeadingType;
  text: string;
  styles?: string;
};

const sharedStyles = `
  font-bold
`;

const typeStyles: Record<HeadingType, string> = {
  h1: 'text-3xl mt-6 mb-4',
  h2: 'text-2xl mt-5 mb-3',
  h3: 'text-xl mt-4 mb-2',
};

export default function SharedHeading({type = 'h2', text, styles}: SharedHeadingProps) {
  return React.createElement(type, { className: `${sharedStyles} ${typeStyles[type]} ${styles}`, }, text);
}
