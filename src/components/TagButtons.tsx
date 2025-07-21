import type { Tag } from '@/types/tag';

type TagButton = {
  id: string;
  name: string;
  tags: Tag[];
  selectedTags: string[];
  onChange: (tagUid: string) => void;
};

const labelStyles = `
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
const selectedTagStyles = `
  bg-blue-500
  text-white
  border-blue-500
`;
const unselectedTagStyles = `
  bg-white
  text-gray-800
  border-gray-300
`;

export default function TagButtons({ id, name, tags, selectedTags, onChange }: TagButton) {
  return (
    <div className="flex gap-2 my-3 overflow-x-auto whitespace-nowrap pb-1">
      {tags.map(({ uid, title }) => (
        <label
          key={uid}
          className={`${labelStyles} ${selectedTags.includes(uid) ? selectedTagStyles : unselectedTagStyles}`}
        >
          <input
            type="checkbox"
            id={id}
            name={name}
            value={uid}
            checked={selectedTags.includes(uid)}
            onChange={() => onChange(uid)}
            className="hidden"
          />
          {title}
        </label>
      ))}
    </div>
  );
}
