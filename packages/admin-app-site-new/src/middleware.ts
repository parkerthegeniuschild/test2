import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-pathname', request.nextUrl.pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ['/((?!sign-in|assets|favicon).*)'],
};
