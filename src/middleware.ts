import type { NextRequest } from 'next/server';
import logRequest from '@/middleware/log';
import authenticate from '@/middleware/auth';

export function middleware(req: NextRequest) {
  logRequest(req);
  return authenticate(req);
}

export const config = {
  matcher: ['/api/:path*', '/:path*'], // ✅ Matches all API routes & pages
};
