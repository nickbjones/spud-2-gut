/**
 * Recipe page
 */
'use client';
import { useParams } from 'next/navigation';
import { useRecipe } from '@/hooks/useRecipe';
import { notFound } from 'next/navigation';
import { RecipeType } from '@/types/recipe';

const InfoRow = ({ label, data }: {
  label: keyof RecipeType;
  data: RecipeType[keyof RecipeType];
}) => (
  <tr className="border-t border-b">
    <td>{label}</td>
    <td>{data}</td>
  </tr>
);

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useRecipe(id);

  if (isLoading) return null;
  if (!data) return notFound();

  return (
    <div className="max-w-5xl mx-auto py-4 px-3 sm:px-6">
      <p>
        <span className="text-xl font-bold mr-2">{data.title}</span>
        <span className="text-blue-600 underline"><a href={`/recipes/${data.uid}/edit`}>Edit</a></span>
      </p>
      <table>
        <tbody>
          <InfoRow label="id" data={data.id} />
          <InfoRow label="uid" data={data.uid} />
          <InfoRow label="description" data={data.description} />
          <InfoRow label="ingredients" data={data.ingredients} />
          <InfoRow label="instructions" data={data.instructions} />
          <InfoRow label="reference" data={data.reference} />
          <InfoRow label="tags" data={data.tags} />
          <InfoRow label="date" data={data.date} />
          <InfoRow label="isPinned" data={data.isPinned} />
          <InfoRow label="cookCount" data={data.cookCount} />
        </tbody>
      </table>
    </div>
  );
}
