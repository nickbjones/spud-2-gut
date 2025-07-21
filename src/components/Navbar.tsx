'use client';

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
          className={`${sharedNavButtonStyles} ${
            rootPath === href ? 'bg-orange-500' : 'hover:bg-gray-700'
          }`}
        >
          {label}
        </Link>
      ))}
      <Link
        href="/recipes/new" 
        className={`${sharedNavButtonStyles} ml-auto mr-0 bg-green-600 hover:bg-green-500`}
      >
        <span className="hidden sm:block">+ New Recipe</span>
        <span className="block sm:hidden">+ New</span>
      </Link>
    </nav>
  );
}
