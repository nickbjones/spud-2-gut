import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-gray-700">
      <h1 className="mt-16 mb-4 text-6xl">404</h1>
      <p className="text-lg">Page not found.</p>
      <Link href="/" className="mt-4 text-blue-600 underline">
        Go back home
      </Link>
    </div>
  )
}
