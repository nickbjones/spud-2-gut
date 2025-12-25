/**
 * Recipe client page
 */
'use client';
import { useRecipe } from '@/hooks/useRecipe';
import { notFound } from 'next/navigation';
import LoadingMessage from '@/components/LoadingMessage';

export default function RecipeClientPage({ id }: { id: string }) {
  const { data, isLoading } = useRecipe(id);

  if (isLoading) return <LoadingMessage />;
  if (!data) return notFound();

  return (
    <div className="max-w-5xl mx-auto py-4 px-3 sm:px-6">
      <p>
        <span className="text-xl font-bold mr-2">{data.title}</span>
        <span className="text-blue-600 underline"><a href={`/recipes/${data.uid}/edit`}>Edit</a></span>
      </p>
      <pre className="mb-5">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
