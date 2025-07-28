import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// import logRequest from '@/middleware/log';
import authenticate from '@/middleware/auth';

export function middleware(req: NextRequest) {
  // 🔴 Check if killswitch is active
  if (process.env.KILLSWITCH_ENABLED === 'true') {
    return new NextResponse('The site is temporarily unavailable.', { status: 503 });
  }

  // logRequest(req);
  return authenticate(req);
}

export const config = {
  matcher: ['/api/:path*', '/:path*'], // ✅ Matches all API routes & pages
};
