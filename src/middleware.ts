import type { NextRequest } from 'next/server';
import authenticate from '@/middleware/auth';

export function middleware(req: NextRequest) {
  console.log(`[MIDDLEWARE] ${req.nextUrl.pathname}`);
  return authenticate(req);
}

export const config = {
  matcher: ['/api/:path*', '/:path*'], // ✅ Matches all API routes & pages
};
