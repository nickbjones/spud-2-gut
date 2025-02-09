export default function Recipe({ params }: { params: { id: string } }) {
  // if (!params.id) return notFound();

  return <h1 className="text-3xl font-bold">{params.id} recipe</h1>;
}
