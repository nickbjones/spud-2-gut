'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sharedNavButtonStyles = `flex items-center justify-center mr-2 px-3 p-1 sm:py-2 rounded-md transition`;

export default function Navbar() {
  const pathname = usePathname();
  const rootPath = `/${pathname.split('/')[1]}`;

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-5xl mx-auto py-4 px-3 sm:px-6 flex">
        <Link
          href="/recipes" 
          className={`${sharedNavButtonStyles} ${
            rootPath === '/recipes' ? 'bg-orange-500' : 'hover:bg-gray-700'
          }`}
        >
          <span>Recipes</span>
        </Link>
        {(rootPath === '/recipes' || rootPath === '/archive') && (
          <Link
            href="/archive" 
            className={`${sharedNavButtonStyles} ${
              rootPath === '/archive' ? 'bg-orange-500' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <span>Archive</span>
          </Link>
        )}
        <Link
          href="/tags" 
          className={`${sharedNavButtonStyles} ${
            rootPath === '/tags' ? 'bg-orange-500' : 'hover:bg-gray-700'
          }`}
        >
          <span>Tags</span>
        </Link>
        <div className="flex ml-auto">
          {rootPath === '/recipes' && (
            <Link
              href="/recipes/new" 
              className={`${sharedNavButtonStyles} ml-auto !mr-0 bg-green-600 hover:bg-green-500`}
            >
              <span className="hidden sm:block">+ New Recipe</span>
              <span className="block sm:hidden">+ New</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
