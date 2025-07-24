import { sharedTagStyles, selectedTagStyles, unselectedTagStyles } from "./Tag";

type TagButtonType = {
  uid: string;
  name: string;
  title: string;
  isSelected?: boolean;
  onChange: (tagUid: string) => void;
};

export default function TagButton({ uid, name, title, isSelected = false, onChange }: TagButtonType) {
  return (
    <label
      className={`${sharedTagStyles} ${isSelected ? selectedTagStyles : unselectedTagStyles}`}
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
