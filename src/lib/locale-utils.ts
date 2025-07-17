import { NextRequest } from 'next/server'

export const SUPPORTED_LOCALES = ['tr', 'en'] as const
export const DEFAULT_LOCALE = 'tr' as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Dil kodunun desteklenen diller arasında olup olmadığını kontrol eder
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

/**
 * Accept-Language header'ını parse eder ve kalite skoruna göre sıralar
 */
export function parseAcceptLanguage(acceptLanguage: string): Array<{ locale: string; quality: number }> {
  return acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, quality = '1'] = lang.trim().split(';q=')
      return {
        locale: locale.split('-')[0].toLowerCase(),
        quality: parseFloat(quality),
      }
    })
    .sort((a, b) => b.quality - a.quality)
}

/**
 * Dil tercihi algılama mantığı - Güncellenmiş versiyon
 */
export function detectPreferredLocale(request: NextRequest): SupportedLocale {
  // URL parametresi kontrolü
  const urlLocale = request.nextUrl.searchParams.get('lang')
  if (urlLocale && isSupportedLocale(urlLocale)) {
    return urlLocale
  }

  // Cookie kontrolü (en yüksek öncelik kalıcı tercih için)
  const cookieLocale = request.cookies.get('language')?.value
  if (cookieLocale && isSupportedLocale(cookieLocale)) {
    return cookieLocale
  }

  // Accept-Language header kontrolü
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const parsedLanguages = parseAcceptLanguage(acceptLanguage)
    for (const { locale } of parsedLanguages) {
      if (isSupportedLocale(locale)) {
        return locale
      }
    }
  }

  return DEFAULT_LOCALE
}

/**
 * Kullanıcının tercih ettiği dili localStorage'a kaydetmek için client-side fonksiyon - Güncellenmiş
 */
export function setUserLocale(locale: SupportedLocale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', locale)

    // Cookie'yi 1 yıl boyunca kalıcı hale getir
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `language=${locale}; path=/; expires=${expires.toUTCString()}; samesite=lax`

    // HTML lang attribute'unu güncelle
    document.documentElement.lang = locale
  }
}

/**
 * Mevcut dili client-side'da alır - Güncellenmiş öncelik sırası
 */
export function getUserLocale(): SupportedLocale {
  if (typeof window !== 'undefined') {
    // localStorage'dan kontrol et (en yüksek öncelik)
    const storedLocale = localStorage.getItem('language')
    if (storedLocale && isSupportedLocale(storedLocale)) {
      return storedLocale
    }

    // Cookie'den kontrol et
    const cookieMatch = document.cookie.match(/language=([^;]+)/)
    if (cookieMatch && isSupportedLocale(cookieMatch[1])) {
      return cookieMatch[1]
    }

    // Tarayıcı dili kontrolü
    const browserLang = navigator.language.split('-')[0]
    if (isSupportedLocale(browserLang)) {
      return browserLang
    }
  }

  return DEFAULT_LOCALE
}

/**
 * Sayfa yenileme durumunda dil tercihini URL'e yansıt
 */
export function ensureLocaleInUrl(): void {
  if (typeof window !== 'undefined') {
    const currentLocale = getUserLocale()
    const urlParams = new URLSearchParams(window.location.search)
    const urlLocale = urlParams.get('lang')

    // Eğer URL'de lang yoksa ve kullanıcı tercihi varsayılan değilse URL'yi güncelle
    if (!urlLocale && currentLocale !== DEFAULT_LOCALE) {
      urlParams.set('lang', currentLocale)
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`
      window.history.replaceState(null, '', newUrl)
    }
  }
}
