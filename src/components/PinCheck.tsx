import { useState } from "react";

const sharedPinStyles = 'block w-[100] mt-4 mb-8 px-3 py-1 text-sm text-center rounded-full border cursor-pointer';
const isPinnedStyles = 'border-orange-400 bg-orange-200 hover:bg-orange-300';
const notPinnedStyles = 'border-slate-300 bg-white hover:bg-slate-100';

type PinCheckType = {
  isPinned?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMiniPin?: boolean;
};

export default function PinCheck({ isPinned = false, onChange, isMiniPin = false }: PinCheckType) {
  const [hovered, setHovered] = useState(false);

  if(isMiniPin) {
    const pinStyle = isPinned ? 'orange' : 'gray'
    return (
      <label className="ml-auto mb-[3px] cursor-pointer" title={isPinned ? 'Unpin' : 'Pin it!'}>
        <input
          type="checkbox"
          name="isPinned"
          checked={isPinned}
          onChange={onChange}
          className="hidden"
        />
        <span className={`p-1 border-2 border-${pinStyle}-500 bg-${pinStyle}-200 rounded-full text-xs`}>📌</span>
      </label>
    );
  }

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
