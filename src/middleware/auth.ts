import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/api/',
  '/home/',
  '/recipes/',
  '/tags/',
];

// Helper function to check authentication
function isAuthenticated(authHeader?: string | null): boolean {
  if (!authHeader) return false;
  const validAuth = `Basic ${Buffer.from(`${process.env.AUTH_USER}:${process.env.AUTH_PASS}`).toString('base64')}`;
  return authHeader === validAuth;
}

// 🛡 Authentication Middleware
export default function authenticate(req: NextRequest): NextResponse | null {
  if (!protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))) return null;

  const auth = req.headers.get('authorization');

  if (!isAuthenticated(auth)) {
    console.warn(`[AUTH FAIL] ${req.nextUrl.pathname}`);
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  console.log(`[AUTH SUCCESS] ${req.nextUrl.pathname}`);
  return null;
}
