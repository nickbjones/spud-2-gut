import { generateUid, getNewId } from '@/lib/utils/helpers';
import type { TagType } from '@/types/tag';
import { useRef, useState } from 'react';
import TagButton from './TagButton';
import { sharedTagStyles, selectedTagStyles, unselectedTagStyles } from "./Tag";
import SharedButton from './SharedButton';
import { defaultTagColor } from '@/lib/initialValues';

type TagButtonsType = {
  name: string;
  tags: TagType[];
  selectedTags: string[];
  onChange: (tagUid: string) => void;
};

export default function TagButtons({ name, tags, selectedTags, onChange }: TagButtonsType) {
  const [tagsList, setTagsList] = useState<TagType[]>(tags);
  const [isEditingNewTag, setIsEditingNewTag] = useState<boolean>(false);
  const [isSavingNewTag, setIsSavingNewTag] = useState<boolean>(false);
  const [newUid, setNewUid] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [error, setError] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  const handleNewTagSubmit = async () => {
    if (!newTitle) return;
    setIsSavingNewTag(true);

    const newTag: TagType = {
      id: getNewId('TAG', tagsList),
      uid: newUid,
      title: newTitle,
      description: '',
      color: '',
      date: new Date().toISOString().split('T')[0], // today
    };

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTag),
      });

      if (!response.ok) {
        throw new Error('Failed to create tag');
      }

      // add new tag to list
      setTagsList(prev => [newTag, ...prev]);
      // add new tag to form data
      onChange(newUid);
      // reset new tag form
      setIsEditingNewTag(false);
      setIsSavingNewTag(false);
      setNewUid('');
      setNewTitle('');
    } catch (err) {
      setError(`Failed to save tag. ${(err as Error).message}`);
    }
  };

  const handleNewTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTitle = e.target.value;
    setNewTitle(inputTitle);
    setNewUid(generateUid(inputTitle, tagsList));
  };

  return (
    <div ref={containerRef} className="flex my-3 pb-1 overflow-x-auto whitespace-nowrap no-scrollbar">
      {/* new tag */}
      {isEditingNewTag ? (
        <div className="flex items-center">
          <input
            type="text"
            placeholder="New tag name"
            className={`${sharedTagStyles} !text-left !mr-0`}
            value={isSavingNewTag ? 'Saving...' : newTitle}
            onChange={handleNewTitleChange}
            autoFocus
          />
          <SharedButton
            text="Save"
            onClick={handleNewTagSubmit}
            styles={`${sharedTagStyles} ${selectedTagStyles} !py-1 !px-2 hover:bg-blue-600`}
            disabled={!newTitle || isSavingNewTag}
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      ) : (
        <span
          className={`${sharedTagStyles} ${unselectedTagStyles}`}
          onClick={() => setIsEditingNewTag(true)}
        >
          + New
        </span>
      )}
      {/* tags list */}
      {tagsList.map(({ uid, title, color = defaultTagColor }) => (
        <TagButton
          key={uid + title}
          uid={uid}
          name={name}
          title={title}
          color={color}
          isSelected={selectedTags.includes(uid)}
          onChange={() => onChange(uid)}
        />
      ))}
    </div>
  );
}
