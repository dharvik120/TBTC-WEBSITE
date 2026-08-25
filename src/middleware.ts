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
    let userRole = '';
    let permissions: any = null;

    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token, secretKey);
        isAuthenticated = true;
        userRole = (payload as any).role || '';
        permissions = (payload as any).permissions || null;
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

    // Enforce permission checks if authenticated and accessing protected dashboard pages
    if (isAuthenticated && !isPublicAdminPath) {
      // 1. Users management is strictly SUPER_ADMIN only
      if (pathname === '/admin/users' && userRole !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
      }

      // 2. Perform role config whitelisting checks
      if (permissions) {
        const settingsPaths = [
          '/admin/themes', '/admin/topbar', '/admin/navigation', '/admin/slider',
          '/admin/sections', '/admin/about-cms', '/admin/footer', '/admin/company-info',
          '/admin/seo', '/admin/settings'
        ];
        const productsPaths = [
          '/admin/products', '/admin/categories', '/admin/brands', '/admin/featured'
        ];
        const downloadsPaths = ['/admin/downloads'];
        const blogsPaths = ['/admin/blogs'];
        const formsPaths = ['/admin/inquiries', '/admin/quotes', '/admin/form-builder'];
        const customPagesPaths = [
          '/admin/why-choose-us', '/admin/industries', '/admin/cta', '/admin/custom-pages',
          '/admin/socials'
        ];

        if (settingsPaths.includes(pathname) && !permissions.canEditSettings) {
          return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
        }
        if (productsPaths.includes(pathname) && !permissions.canEditProducts) {
          return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
        }
        if (downloadsPaths.includes(pathname) && !permissions.canEditDownloads) {
          return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
        }
        if (blogsPaths.includes(pathname) && !permissions.canEditBlogs) {
          return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
        }
        if (formsPaths.includes(pathname) && !permissions.canEditForms) {
          return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
        }
        if (customPagesPaths.includes(pathname) && !permissions.canEditCustomPages) {
          return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
