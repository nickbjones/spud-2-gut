import { useState } from "react";

const sharedPinStyles = 'block w-[100] mt-4 mb-8 px-3 py-1 text-sm text-center rounded-full border cursor-pointer';
const isPinnedStyles = 'border-orange-400 bg-orange-200 hover:bg-orange-300';
const notPinnedStyles = 'border-slate-300 bg-white hover:bg-slate-100';

type PinCheckType = {
  isPinned?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PinCheck({ isPinned = false, onChange }: PinCheckType) {
  const [hovered, setHovered] = useState(false);

  const labelText = isPinned
    ? hovered
      ? 'Unpin'
      : 'Pinned'
    : hovered
    ? 'Pin it!'
    : 'Not pinned';

  return (
    <label
      className={`${sharedPinStyles} ${isPinned ? isPinnedStyles : notPinnedStyles}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="checkbox"
        name="isPinned"
        checked={isPinned}
        onChange={onChange}
        className="hidden"
      />
      {labelText}
    </label>
  );
}
