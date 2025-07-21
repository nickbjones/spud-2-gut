const sharedHeadingStyles = `
  mt-4
  mb-4
  text-3xl
  font-bold
`;

export default function SharedHeading({text, styles}: {text: string, styles?: string}) {
  return (
    <h1 className={sharedHeadingStyles + (styles ? ` ${styles}` : '')}>
      {text}
    </h1>
  );
}
