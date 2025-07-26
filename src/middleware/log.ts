import type { NextRequest } from 'next/server';

function isExternalRequest(req: NextRequest): boolean {
  const ua = req.headers.get('user-agent') || '';
  const referer = req.headers.get('referer') || '';
  return !ua.includes('Next.js') && !referer.includes(req.nextUrl.origin);
}

function logExternalRequest(req: NextRequest) {
  const date = new Date().toISOString();
  const method = req.method;
  const url = req.nextUrl.pathname;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = req.headers.get('user-agent') ?? 'unknown';
  console.log(`[${date}] ${method} ${url} from IP: ${ip} | UA: ${ua}`);
}

// 🛡 Logging Middleware
export default function logRequest(req: NextRequest) {
  if (isExternalRequest(req)) {
    logExternalRequest(req);
  }
}
