import { getTextColorForBackground } from '@/lib/utils/helpers';
import { sharedTagStyles, selectedTagStyles, unselectedTagStyles } from './Tag';

type TagButtonType = {
  uid: string;
  name: string;
  title: string;
  color: string;
  isSelected?: boolean;
  onChange: (tagUid: string) => void;
};

export default function TagButton({ uid, name, title, color, isSelected = false, onChange }: TagButtonType) {
  return (
    <label
      className={`${sharedTagStyles} ${isSelected ? selectedTagStyles : unselectedTagStyles}`}
      style={{ backgroundColor: color, color: getTextColorForBackground(color) }}
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
