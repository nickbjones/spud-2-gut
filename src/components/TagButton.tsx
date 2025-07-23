type TagButtonType = {
  uid: string;
  name: string;
  title: string;
  isSelected?: boolean;
  onChange: (tagUid: string) => void;
};

export const labelStyles = `
  flex
  items-center
  justify-center
  text-center
  px-4
  py-2
  text-sm
  border
  rounded-lg
  cursor-pointer
`;
export const selectedTagStyles = `
  bg-blue-500
  text-white
  border-blue-500
`;
export const unselectedTagStyles = `
  bg-white
  text-gray-800
  border-gray-300
`;

export default function TagButton({ uid, name, title, isSelected = false, onChange }: TagButtonType) {
  return (
    <label
      className={`${labelStyles} ${isSelected ? selectedTagStyles : unselectedTagStyles}`}
    >
      <input
        type="checkbox"
        name={name}
        value={uid}
        checked={isSelected}
        onChange={() => onChange(uid)}
        className="hidden"
      />
      {title}
    </label>
  )
};
