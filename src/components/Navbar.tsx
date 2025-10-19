'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sharedNavButtonStyles = `
  flex
  items-center
  justify-center
  mr-2
  px-3
  p-1
  sm:py-2
  rounded-md
  transition
`;

const HamMenuItem = ({ href, label }: { href: string; label: string }) => (
  <li>
    <a href={href} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
      {label}
    </a>
  </li>
);

const HamMenuHr = () => (
  <li>
    <hr className="my-2 mx-8 border-t border-slate-200" />
  </li>
);

export default function Navbar() {
  const pathname = usePathname();
  const rootPath = `/${pathname.split('/')[1]}`;

  const [hamMenuIsOpen, setHamMenuIsOpen] = useState(false);

  const navItems = [
    // { href: '/home', label: 'Home' },
    { href: '/recipes', label: 'Recipes' },
    { href: '/tags', label: 'Tags' },
  ];

  return (
    <nav className="py-4 px-3 sm:px-6 bg-gray-800 text-white flex">
      {navItems.map(({ href, label }) => (
        <Link
          key={href} 
          href={href} 
          className={`${sharedNavButtonStyles} ${
            rootPath === href ? 'bg-orange-500' : 'hover:bg-gray-700'
          }`}
        >
          {label}
        </Link>
      ))}

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

        {/* Hamburger button */}
        <button
          className="ml-2 -mr-2 px-1 sm:p-2 focus:outline-none focus:ring"
          onClick={() => setHamMenuIsOpen(!hamMenuIsOpen)}
        >
          ≡
        </button>

        {/* Hamburger menu */}
        <div className="relative z-10">
          {hamMenuIsOpen && (
            <ul className="absolute -right-2 w-[50vw] max-w-[180] mt-12 py-3 px-2 bg-white border text-black rounded shadow-lg">
              <HamMenuItem href="/recipes" label="View all recipes" />
              <HamMenuItem href="/recipes/new" label="Create new recipe" />
              <HamMenuHr />
              <HamMenuItem href="/tags" label="View all tags" />
              <HamMenuItem href="/tags/new" label="Create new tag" />
              <HamMenuHr />
              <HamMenuItem href="/home" label="Landing page" />
              <HamMenuItem href="/settings" label="Settings" />
              <HamMenuItem href="/change-log" label="Change log" />
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
