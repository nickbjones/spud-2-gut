/**
 * Edit Tag page
 */
'use client';

import { useTag } from '@/hooks/useTag';
import { useTags } from '@/hooks/useTags';
import { useRecipes } from '@/hooks/useRecipes';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { TagType } from '@/types/tag';
import type { RecipeType } from '@/types/recipe';
import { getRecipesByTag, doesTagTitleExist } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import LoadingMessage from '@/components/LoadingMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';
import ColorPicker from '@/components/ColorPicker';
import Uid from '@/components/Uid';
import { initialTagValues } from '@/lib/initialValues';

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { tag, isLoadingTag } = useTag(id); // or uid?
  const { tags, isLoadingTags, updateTag, isUpdatingTag, deleteTag } = useTags();
  const { recipes, isLoadingRecipes } = useRecipes();

  usePageTitle(tag?.title);

  // form state
  const [form, setForm] = useState<TagType>(initialTagValues);

  // populate form when recipe loads
  useEffect(() => {
    if (!tag) return;
    setForm(tag);
  }, [tag]);

  const [isTitleExisting, setIsTitleExisting] = useState<boolean>(false);
  const [recipesWithThisTag, setRecipesWithThisTag] = useState<RecipeType[]>([]);

  // get recipes that use this tag
  useEffect(() => {
    setRecipesWithThisTag(getRecipesByTag(recipes || [], id)); // or uid?
  }, [recipes, id]); // or uid?

  if (!tag) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    if (!tag || newTitle !== tag?.title) {
      setIsTitleExisting(doesTagTitleExist(tags, newTitle));
    }
    setForm(f => ({ ...f, title: newTitle }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateTag({ ...tag, ...form });
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the tag "${form.title}"?`)) return;
    deleteTag(tag.id);
  };

  const loading = isLoadingTags || isLoadingTag || isLoadingRecipes;
  if (loading) return <LoadingMessage />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="inline-block flex items-center mb-6">
          <InputField
            id="title"
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            className="!mb-0"
          />
          {isTitleExisting && (
            <div className="absolute mt-14">
              <p className="text-xs text-red-700">Title exists already!</p>
            </div>
          )}
          <SubmitButton disabled={isUpdatingTag} styles="!my-0 ml-10 text-sm" text={isUpdatingTag ? 'Saving...' : 'Save'} />
        </div>
        <TextAreaField
          id="description"
          name="description"
          label="Description"
          value={form.description || ''}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          textAreaClassName="h-16"
        />
        <ColorPicker
          id="color"
          name="color"
          label="Color"
          value={form.color || ''}
          onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
        />
      </form>
      <Uid uid={tag.uid} />
      {(recipesWithThisTag.length > 0)
        ? <div className="mt-6 text-gray-400 text-sm">
            <p>This tag is used in the following recipes:</p>
            <p className="my-1">
              {recipesWithThisTag.map((recipe) => (
                <SharedLink
                  key={recipe.uid}
                  text={recipe.title}
                  styles="block"
                  href={`/recipes/${recipe.uid}/edit?redirect=/tags/${tag.uid}/edit`} />
              ))}
            </p>
            <p>Remove this tag from these recipes before deleting.</p>
          </div>
        : <SharedLink text="Delete tag" styles="text-red-800 hover:text-red-400" onClick={handleDelete} />
      }
    </div>
  );
}
