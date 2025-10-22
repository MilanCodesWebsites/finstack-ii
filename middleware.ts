import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      // Redirect to admin login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If accessing admin login while already authenticated, redirect to dashboard
  if (request.nextUrl.pathname === '/admin/login') {
    const adminSession = request.cookies.get('admin_session');
    
    if (adminSession && adminSession.value === 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};