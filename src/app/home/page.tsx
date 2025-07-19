import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-100 to-orange-300 text-gray-900 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-orange-600">Delicious Recipes</h1>
        <p className="text-lg text-gray-700 mb-6">Save and lookup amazing dishes effortlessly.</p>
        <div className="flex justify-center space-x-6">
          <Link href="/recipes" className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition-all">
            View Recipes
          </Link>
          <Link href="/new-recipe" className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all">
            + New Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
