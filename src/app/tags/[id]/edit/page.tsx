/**
 * Edit Tag page
 */
'use client';

import { API } from '@/lib/constants';
import { useData } from '@/hooks/useData';
import { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import type { TagType } from '@/types/tag';
import { RecipeType } from '@/types/recipe';
import { initialTagValues } from '@/lib/initialValues';
import { getRecipesByTag, doesTagTitleExist } from '@/lib/utils/helpers';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import LoadingMessage from '@/components/LoadingMessage';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/SubmitButton';
import SharedLink from '@/components/SharedLink';
import ColorPicker from '@/components/ColorPicker';
import Uid from '@/components/Uid';

export default function EditTagPage() {
  const router = useRouter();
  const { id: uid } = useParams() as { id: string };

  const { data: tags, error: tagsError, isLoading: loadingTags } = useData<TagType[]>(API.tags);

  // Try to find the tag from the cached tags
  const fallbackTag = tags?.find(r => r.uid === uid);

  // Use fallbackData only if we don't already have the specific tag cached
  const { data: tag, error: tagError, isLoading: loadingTag } = useData<TagType>(`${API.tags}/${encodeURIComponent(uid)}`, fallbackTag);

  // Fetch recipes
  const { data: recipes, error: recipesError, isLoading: loadingRecipes } = useData<RecipeType[]>(API.recipes);

  const [formData, setFormData] = useState<TagType>(initialTagValues);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [isTitleExisting, setIsTitleExisting] = useState<boolean>(false);
  const [recipesWithThisTag, setRecipesWithThisTag] = useState<RecipeType[]>([]);

  useEffect(() => {
    if (tag) {
      setFormData(tag);
    }
  }, [tag]);

  useEffect(() => {
    setRecipesWithThisTag(getRecipesByTag(recipes || [], uid));
  }, [recipes]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    if (!tag || newTitle !== tag?.title) {
      setIsTitleExisting(doesTagTitleExist(tags, newTitle));
    }

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
    }));
  };

  const handleGeneralFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError('');

    try {
      const res = await fetch(`/api/tags/${encodeURIComponent(formData.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update tag');
      };

      router.push(`/tags/${uid}`);
    } catch (err) {
      setSubmitError(`Error saving tag. ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  }

  const deleteTag = async () => {
    if (!confirm(`Are you sure you want to delete the tag "${formData.title}"?`)) return;

    // check here if this tag exists in any recipes
    // if so, show a warning and do not delete
    // for now, just confirm deletion
    try {
      if (!formData) throw new Error('Tag not found');

      const res = await fetch(`/api/tags/${encodeURIComponent(formData.id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete tag');
      };

      // Redirect to tags list after deletion
      window.location.href = '/tags';
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  };

  const error = submitError || tagsError?.message || tagError?.message || recipesError?.message || '';
  const loading = loadingTags || loadingTag || loadingRecipes;

  if (loading) return <LoadingMessage />;
  if (!formData) return notFound();
  if (error) return <ErrorMessage text={error} />;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="inline-block flex items-center mb-6">
          <InputField id="title" name="title" value={formData.title} onChange={handleTitleChange} className="!mb-0" />
          {isTitleExisting && (
            <div className="absolute mt-14">
              <p className="text-xs text-red-700">Title exists already!</p>
            </div>
          )}
          <SubmitButton disabled={isSaving} styles="!my-0 ml-10 text-sm" text={isSaving ? 'Saving...' : 'Save'} />
        </div>
        <TextAreaField
          id="description"
          name="description"
          label="Description"
          value={formData.description || ''}
          onChange={handleGeneralFieldChange}
          className="h-32"
        />
        <ColorPicker
          id="color"
          name="color"
          label="Color"
          value={formData.color || ''}
          onChange={handleGeneralFieldChange}
        />
      </form>
      <Uid uid={formData.uid} />
      {(recipesWithThisTag.length > 0)
        ? <div className="mt-6 text-gray-400 text-sm">
            <p>This tag is used in the following recipes:</p>
            <p className="my-1">
              {recipesWithThisTag.map((recipe) => (
                <SharedLink
                  key={recipe.uid}
                  text={recipe.title}
                  styles="mr-4 whitespace-nowrap"
                  href={`/recipes/${recipe.uid}/edit?redirect=/tags/${formData.uid}/edit`} />
              ))}
            </p>
            <p>Please remove this tag from those recipes before deleting.</p>
          </div>
        : <SharedLink text="Delete tag" styles="text-red-800 hover:text-red-400" onClick={deleteTag} />
      }
    </div>
  );
}
