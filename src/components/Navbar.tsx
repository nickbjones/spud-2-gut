'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const rootPath = `/${pathname.split('/')[1]}`;

  const navItems = [
    { href: '/home', label: 'Home' },
    { href: '/recipes', label: 'Recipes' },
    { href: '/tags', label: 'Tags' },
  ];

  return (
    <nav className="p-4 bg-gray-800 text-white flex">
      {navItems.map(({ href, label }) => (
        <Link
          key={href} 
          href={href} 
          className={`mr-2 px-3 py-2 rounded-md transition ${
            rootPath === href ? 'bg-orange-500' : 'hover:bg-gray-700'
          }`}
        >
          {label}
        </Link>
      ))}
      <Link
        href="/recipes/new" 
        className="ml-auto px-3 py-2 rounded-md transition bg-green-600 hover:bg-green-500"
      >
        + New Recipe
      </Link>
    </nav>
  );
}
