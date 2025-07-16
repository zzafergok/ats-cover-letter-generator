import { NextRequest, NextResponse } from 'next/server'

// Desteklenen diller
const supportedLocales = ['tr', 'en'] as const
const defaultLocale = 'tr' as const

type SupportedLocale = (typeof supportedLocales)[number]

/**
 * Kullanıcının tercih ettiği dili algılar
 */
function detectUserLocale(request: NextRequest): SupportedLocale {
  // 1. URL'den dil parametresini kontrol et
  const urlLocale = request.nextUrl.searchParams.get('lang')
  if (urlLocale && supportedLocales.includes(urlLocale as SupportedLocale)) {
    return urlLocale as SupportedLocale
  }

  // 2. Cookie'den dil tercihini kontrol et
  const cookieLocale = request.cookies.get('language')?.value
  if (cookieLocale && supportedLocales.includes(cookieLocale as SupportedLocale)) {
    return cookieLocale as SupportedLocale
  }

  // 3. Accept-Language header'ından dil tercihini algıla
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => {
        const [locale, quality = '1'] = lang.trim().split(';q=')
        return {
          locale: locale.split('-')[0].toLowerCase(),
          quality: parseFloat(quality),
        }
      })
      .sort((a, b) => b.quality - a.quality)

    for (const { locale } of languages) {
      if (supportedLocales.includes(locale as SupportedLocale)) {
        return locale as SupportedLocale
      }
    }
  }

  return defaultLocale
}

/**
 * Korumalı rotaları kontrol eder
 */
function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/settings',
    '/users',
    '/components', // Components sayfası da korumalı
  ]
  return protectedPaths.some((path) => pathname.startsWith(path))
}

/**
 * Authentication gerektirmeyen genel rotaları kontrol eder
 */
function isPublicRoute(pathname: string): boolean {
  const publicPaths = ['/', '/about', '/contact', '/pricing']
  return publicPaths.includes(pathname)
}

/**
 * Auth sayfaları kontrolü
 */
function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/')
}

/**
 * Statik dosya yollarını kontrol eder
 */
function isStaticFile(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/site.webmanifest') ||
    pathname.startsWith('/robots.txt')
  )
}

/**
 * Authentication token'ını kontrol eder - İyileştirilmiş validasyon
 */
function hasValidAuthToken(request: NextRequest): boolean {
  try {
    // Cookie'lerden token'ları kontrol et
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    // Token'ların varlığını kontrol et
    if (!accessToken || !refreshToken) {
      return false
    }

    // Mock token format kontrolü - İyileştirilmiş
    const isValidAccessTokenFormat = accessToken.startsWith('mock-access-token-') && accessToken.split('-').length >= 4
    const isValidRefreshTokenFormat =
      refreshToken.startsWith('mock-refresh-token-') && refreshToken.split('-').length >= 4

    if (!isValidAccessTokenFormat || !isValidRefreshTokenFormat) {
      return false
    }

    // User ID kontrolü - token'larda aynı user ID olmalı
    const accessTokenParts = accessToken.split('-')
    const refreshTokenParts = refreshToken.split('-')

    if (accessTokenParts[3] !== refreshTokenParts[3]) {
      return false
    }

    // Token expiry kontrolü (eğer cookie'de mevcutsa)
    const tokenExpiry = request.cookies.get('tokenExpiry')?.value
    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry)
      if (!isNaN(expiryTime)) {
        const currentTime = Date.now()
        const bufferTime = 5 * 60 * 1000 // 5 dakika buffer

        if (currentTime > expiryTime - bufferTime) {
          return false // Token süresi dolmuş
        }
      }
    }

    return true
  } catch {
    return false
  }
}

/**
 * Response headers'ını güvenli şekilde ayarlar
 */
function setSecureHeaders(response: NextResponse): NextResponse {
  // Güvenlik headers'ları ekle
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Development ortamında ek debug headers
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('X-Middleware-Version', '1.0.1')
  }

  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Development logging
  // if (process.env.NODE_ENV === 'development') {
  //   console.log(`[Middleware] ${request.method} ${pathname}`)
  // }

  // Statik dosyalar için middleware'i atla
  if (isStaticFile(pathname)) {
    return NextResponse.next()
  }

  // Kullanıcının dil tercihini algıla
  const detectedLocale = detectUserLocale(request)
  const hasAuth = hasValidAuthToken(request)

  // Response objesi oluştur
  const response = NextResponse.next()

  // Dil cookie'sini güncelle (sadece gerekirse)
  const currentLanguageCookie = request.cookies.get('language')?.value
  if (currentLanguageCookie !== detectedLocale) {
    response.cookies.set('language', detectedLocale, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 yıl
      path: '/',
    })
  }

  // Content-Language header'ını ayarla
  response.headers.set('Content-Language', detectedLocale)

  // Authentication kontrolü
  if (isAuthRoute(pathname)) {
    // Auth sayfalarında zaten giriş yapmış kullanıcıyı dashboard'a yönlendir
    if (hasAuth) {
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('[Middleware] Already authenticated, redirecting to dashboard')
      // }
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('lang', detectedLocale)
      return NextResponse.redirect(dashboardUrl)
    }
    // Auth sayfalarında değilse, güvenlik headers'ı ile devam et
    return setSecureHeaders(response)
  }

  if (isProtectedRoute(pathname)) {
    // Korumalı rotada authentication kontrolü
    if (!hasAuth) {
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('[Middleware] Not authenticated, redirecting to login')
      // }
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('lang', detectedLocale)

      // Redirect sonrası dönülecek sayfayı kaydet
      if (pathname !== '/auth/login') {
        loginUrl.searchParams.set('redirect', pathname)
      }

      return NextResponse.redirect(loginUrl)
    }
    // Authentication varsa güvenlik headers'ı ile devam et
    return setSecureHeaders(response)
  }

  // Public routes için normal devam et
  if (isPublicRoute(pathname)) {
    return setSecureHeaders(response)
  }

  // Dil parametresi varsa ve geçerliyse, temizle ve cookie'ye kaydet
  const langParam = request.nextUrl.searchParams.get('lang')
  if (langParam && supportedLocales.includes(langParam as SupportedLocale)) {
    const newUrl = new URL(request.url)
    newUrl.searchParams.delete('lang')

    const redirectResponse = NextResponse.redirect(newUrl)
    redirectResponse.cookies.set('language', langParam, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    })

    return setSecureHeaders(redirectResponse)
  }

  // Development modunda debug bilgileri ekle
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('X-Debug-Locale', detectedLocale)
    response.headers.set('X-Debug-Path', pathname)
    response.headers.set('X-Debug-Auth', hasAuth ? 'true' : 'false')
    response.headers.set(
      'X-Debug-Route-Type',
      isPublicRoute(pathname)
        ? 'public'
        : isProtectedRoute(pathname)
          ? 'protected'
          : isAuthRoute(pathname)
            ? 'auth'
            : 'unknown',
    )
  }

  return setSecureHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Aşağıdaki yollar hariç tüm istekleri eşleştir:
     * - api rotaları (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico ve diğer static dosyalar
     * - public klasöründeki dosyalar
     */
    '/((?!api|_next/static|_next/image|favicon|.*\\.|manifest|robots|sw\\.js).*)',
  ],
}
