'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const rootPath = `/${pathname.split('/')[1]}`;

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/new-recipe', label: 'New Recipe' },
    { href: '/recipes', label: 'Recipes' },
    { href: '/tags', label: 'Tags' },
  ];

  console.log(rootPath);

  return (
    <nav className="p-4 bg-gray-800 text-white flex space-x-4">
      {navItems.map(({ href, label }) => (
        <Link 
          key={href} 
          href={href} 
          className={`px-3 py-2 rounded-md transition ${
            rootPath === href ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
