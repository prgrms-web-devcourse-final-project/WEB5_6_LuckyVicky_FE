import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
const { nextUrl, cookies } = req;
const { pathname, search } = nextUrl;

if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {

const token =
cookies.get('accessToken')?.value ||
cookies.get('admin_token')?.value ||
cookies.get('token')?.value;

if (!token) {
  const url = new URL('/admin/login', req.url);
  url.searchParams.set('next', pathname + search);
  return NextResponse.redirect(url);
}
}

return NextResponse.next();
}

export const config = {
matcher: ['/admin/:path*'],
};