import type { Tag } from '@/types/types';

type TagButton = {
  id: string;
  tags: Tag[];
  selectedTags: Tag[];
  onChange: (selected: Tag[]) => void;
};

export default function TagButtons({ id, tags, selectedTags, onChange }: TagButton) {
  const toggleTag = (tag: Tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    onChange(updatedTags);
  };

  return (
    <div>
      {tags.map((tag) => (
        <button
          key={tag.uid}
          type="button"
          id={id}
          className={`px-4 py-2 border rounded ${
            selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => toggleTag(tag)}
        >
          {tag.title}
        </button>
      ))}
    </div>
  );
}
