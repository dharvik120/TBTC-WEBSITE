import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const COOKIE_NAME = 'stbt_session';
const JWT_SECRET = process.env.JWT_SECRET || 'stbt_secret_key_12345_industrial_portal';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run middleware on /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        await jose.jwtVerify(token, secretKey);
        isAuthenticated = true;
      } catch (error) {
        // Invalid token
      }
    }

    const publicAdminPaths = [
      '/admin/login',
      '/admin/register',
      '/admin/forgot-password',
      '/admin/reset-password'
    ];
    const isPublicAdminPath = publicAdminPaths.includes(pathname);

    // Redirect to login if accessing admin pages unauthenticated
    if (!isAuthenticated && !isPublicAdminPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Redirect to dashboard if accessing public admin pages while authenticated
    if (isAuthenticated && isPublicAdminPath) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
