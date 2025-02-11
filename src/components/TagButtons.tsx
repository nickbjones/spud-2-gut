import type { Tag } from '@/types/types';

type TagButton = {
  id: string;
  name: string;
  tags: Tag[];
  selectedTags: string[];
  onChange: (tagUid: string) => void;
};

export default function TagButtons({ id, name, tags, selectedTags, onChange }: TagButton) {
  return (
    <div className="flex gap-2 my-3">
      {tags.map(({ uid, title }) => (
        <label
          key={uid}
          className={`cursor-pointer rounded-lg px-4 py-2 border ${
            selectedTags.includes(uid)
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            name="tags"
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
