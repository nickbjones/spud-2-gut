import type { NextRequest } from 'next/server';
import authenticate from '@/middleware/auth';

export function middleware(req: NextRequest) {
  return authenticate(req);
}

export const config = {
  matcher: ['/api/:path*', '/:path*'], // ✅ Matches all API routes & pages
};
