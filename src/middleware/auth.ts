import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/api/',
  '/home/',
  '/recipes/',
  '/settings/',
  '/tags/',
];

function isAuthenticated(authHeader?: string | null): boolean {
  if (!authHeader) return false;

  const envUser = process.env.AUTH_USER;
  const envPass = process.env.AUTH_PASS;

  const validAuth = `Basic ${Buffer.from(`${envUser}:${envPass}`).toString('base64')}`;
  return authHeader === validAuth;
}

function getClientIp(req: NextRequest): string {
  return (
    // Vercel passes real client IP through this header
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

export default function authenticate(req: NextRequest): NextResponse | null {
  const pathname = req.nextUrl.pathname;

  if (!protectedRoutes.some(path => pathname.startsWith(path))) {
    return null;
  }

  const authHeader = req.headers.get('authorization');

  if (!isAuthenticated(authHeader)) {
    // 🔒 Log unauthorized attempt
    const ip = getClientIp(req);
    console.warn(`[UNAUTHORIZED ACCESS] ${pathname} from IP ${ip}`);

    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  return null;
}
