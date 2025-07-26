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

  const envUser = process.env.AUTH_USER;
  const envPass = process.env.AUTH_PASS;

  const validAuth = `Basic ${Buffer.from(`${envUser}:${envPass}`).toString('base64')}`;

  const isAuthenticated = authHeader === validAuth;
  return isAuthenticated;
}

// 🛡 Authentication Middleware
export default function authenticate(req: NextRequest): NextResponse | null {
  const pathname = req.nextUrl.pathname;

  if (!protectedRoutes.some(path => pathname.startsWith(path))) return null;

  const authHeader = req.headers.get('authorization');

  if (!isAuthenticated(authHeader)) {
    console.warn(`[AUTH FAIL] ${pathname}`);
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  console.log(`[AUTH SUCCESS] ${pathname}`);
  return null;
}
