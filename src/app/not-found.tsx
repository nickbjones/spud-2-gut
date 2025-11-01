import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f8f9fa',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.25rem' }}>Page not found.</p>
      <Link href="/" style={{ marginTop: '1rem', color: '#0070f3', textDecoration: 'underline' }}>
        Go back home
      </Link>
    </div>
  )
}
