/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

// Routes that should redirect to dashboard if user is already authenticated
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

// Supported locales for language management
const supportedLocales = ['tr', 'en'] as const
const defaultLocale = 'tr'

/**
 * Handle language management logic
 */
function handleLanguageLogic(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone()
  const langParam = url.searchParams.get('lang')
  const cookieLocale = request.cookies.get('language')?.value

  // If URL has valid lang parameter, update cookie and continue
  if (langParam && supportedLocales.includes(langParam as any)) {
    const response = NextResponse.next()
    response.cookies.set('language', langParam, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    return response
  }

  // If no lang param but cookie exists with non-default locale, redirect with lang param
  if (!langParam && cookieLocale && supportedLocales.includes(cookieLocale as any) && cookieLocale !== defaultLocale) {
    url.searchParams.set('lang', cookieLocale)
    return NextResponse.redirect(url)
  }

  return null // No language-related redirect needed
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Handle language logic first (for all routes except skipped ones)
  const languageResponse = handleLanguageLogic(request)
  if (languageResponse) {
    return languageResponse
  }

  // Root route redirect to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))

  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // Since we're using sessionStorage (client-side only), we can't check tokens in middleware
  // Middleware runs on server-side, so we'll handle auth logic in client components

  // For auth routes, let them through - AuthProvider will handle redirects
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // For public routes, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For protected routes, let them through - ProtectedRoute component will handle auth check
  // This is because sessionStorage is not available in server-side middleware
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
