import { generateUid, getNewId } from '@/lib/utils/helpers';
import type { Tag } from '@/types/tag';
import { useRef, useState } from 'react';

type TagButtonType = {
  uid: string;
  name: string;
  title: string;
  isSelected?: boolean;
  onChange: (tagUid: string) => void;
};

type TagButtonsType = {
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

const TagButton = ({ uid, name, title, isSelected = false, onChange }: TagButtonType) => (
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
);

export default function TagButtons({ id, name, tags, selectedTags, onChange }: TagButtonsType) {
  const [tagsList, setTagsList] = useState<Tag[]>(tags);
  const [isEditingNewTag, setIsEditingNewTag] = useState<boolean>(false);
  const [newUid, setNewUid] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [error, setError] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  const handleNewTagSubmit = async () => {
    if (!newTitle) return;

    const newTag = {
      id: getNewId('TAG', tagsList),
      uid: newUid,
      title: newTitle,
      description: '',
    };

    setTagsList(prev => [...prev, newTag]);
    onChange(newUid);

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTag),
      });

      if (!response.ok) {
        throw new Error('Failed to create tag');
      }

      // reset new tag form
      setIsEditingNewTag(false);
      setNewUid('');
      setNewTitle('');
    } catch (err) {
      setError(`Failed to save tag. ${(err as Error).message}`);
    }
  };

  const scrollToRightEnd = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({
        left: el.scrollWidth - el.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const openNewTagEditor = () => {
    setIsEditingNewTag(true);
    // wait a moment, then scroll right
    setTimeout(() => {
      scrollToRightEnd();
    }, 200);
  };

  const handleNewTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTitle = e.target.value;
    setNewTitle(inputTitle);
    setNewUid(generateUid(inputTitle, tagsList));
  };

  return (
    <div ref={containerRef} className="flex gap-2 my-3 overflow-x-auto whitespace-nowrap pb-1">
      {tagsList.map(({ uid, title }) => (
        <TagButton
          key={uid + title}
          uid={uid}
          name={name}
          title={title}
          isSelected={selectedTags.includes(uid)}
          onChange={() => onChange(uid)}
        />
      ))}
      {isEditingNewTag ? (
        <div className="flex items-center">
          <input
            type="text"
            placeholder="New tag title"
            className="w-28 px-4 py-2 border rounded-lg text-sm"
            value={newTitle}
            onChange={handleNewTitleChange}
          />
          <button
            type="button"
            onClick={handleNewTagSubmit}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
            disabled={!newTitle}
          >
            Save
          </button>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      ) : (
        <span
          className={`${labelStyles} ${unselectedTagStyles}`}
          onClick={openNewTagEditor}
        >
          + New
        </span>
      )}
    </div>
  );
}
