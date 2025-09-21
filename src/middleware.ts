import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { checkUserProfileStatus } from './lib/server-profile-check';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();
  const { pathname } = req.nextUrl;
  
  // If user is not authenticated and trying to access protected routes
  if (!authData.userId && !isPublicRoute(req)) {
    return authData.redirectToSignIn();
  }

  // For authenticated users
  if (authData.userId) {
    // Check profile status for root and welcome routes
    if (pathname === '/' || pathname === '/welcome') {
      const { hasCompleteProfile, currentRole } = await checkUserProfileStatus(authData.userId);
      
      if (hasCompleteProfile && currentRole) {
        // Redirect to appropriate dashboard based on role
        switch (currentRole) {
          case 'teacher':
            return NextResponse.redirect(new URL('/teacher', req.url));
          case 'student':
            return NextResponse.redirect(new URL('/dashboard', req.url));
          case 'researcher':
            return NextResponse.redirect(new URL('/researcher', req.url));
          default:
            // Unknown role, redirect to welcome for role selection
            if (pathname === '/') {
              return NextResponse.redirect(new URL('/welcome', req.url));
            }
        }
      } else {
        // Profile not complete, redirect to welcome if on root
        if (pathname === '/') {
          return NextResponse.redirect(new URL('/welcome', req.url));
        }
      }
    }

    // Role-based route protection
    if (pathname.startsWith('/teacher')) {
      const { currentRole } = await checkUserProfileStatus(authData.userId);
      if (currentRole !== 'teacher') {
        return NextResponse.redirect(new URL('/welcome', req.url));
      }
    }
    
    if (pathname.startsWith('/researcher')) {
      const { currentRole } = await checkUserProfileStatus(authData.userId);
      if (currentRole !== 'researcher') {
        return NextResponse.redirect(new URL('/welcome', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
