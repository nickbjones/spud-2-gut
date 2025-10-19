import Link from 'next/link';

const sharedCtaStyles = 'm-2 px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 bg-gradient-to-b from-orange-100 to-orange-300 text-gray-900 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-orange-600">Spud2Gut Recipes</h1>
        <p className="text-lg text-gray-700 mb-6">Save and lookup your favorite dishes effortlessly.</p>
        <div className="flex">
          <Link href="/recipes" className={`${sharedCtaStyles} bg-orange-500 hover:bg-orange-600`}>
            See All Recipes
          </Link>
          <Link href="/recipes/new" className={`${sharedCtaStyles} bg-green-500 hover:bg-green-600`}>
            + New Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
