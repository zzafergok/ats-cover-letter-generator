// src/lib/i18n.ts
'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from '../locales/en/translation.json'
import trTranslation from '../locales/tr/translation.json'

// Resources for i18next
const resources = {
  en: { translation: enTranslation },
  tr: { translation: trTranslation },
}

// Browser API'lerine güvenli erişim için yardımcı fonksiyonlar
const isBrowser = () => typeof window !== 'undefined'

// LocalStorage güvenli erişim
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('LocalStorage erişim hatası:', error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn('LocalStorage yazma hatası:', error)
    }
  },
}

// Cookie güvenli erişim
const safeCookie = {
  get: (name: string): string | null => {
    if (!isBrowser()) return null
    try {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
      return match ? match[2] : null
    } catch (error) {
      console.warn('Cookie okuma hatası:', error)
      return null
    }
  },
  set: (name: string, value: string, days: number = 365): void => {
    if (!isBrowser()) return
    try {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; samesite=lax`
    } catch (error) {
      console.warn('Cookie yazma hatası:', error)
    }
  },
}

// URL parametreleri güvenli erişim
const safeURLParams = {
  get: (param: string): string | null => {
    if (!isBrowser()) return null
    try {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get(param)
    } catch (error) {
      console.warn('URL parametresi okuma hatası:', error)
      return null
    }
  },
  set: (param: string, value: string): void => {
    if (!isBrowser()) return
    try {
      const url = new URL(window.location.href)
      url.searchParams.set(param, value)
      window.history.replaceState(null, '', url.toString())
    } catch (error) {
      console.warn('URL güncelleme hatası:', error)
    }
  },
}

// Kullanıcının tercih ettiği dili al
const getUserPreferredLanguage = (): string => {
  const supportedLanguages = ['tr', 'en']

  // localStorage'dan kontrol et (en yüksek öncelik)
  const storedLocale = safeLocalStorage.getItem('language')
  if (storedLocale && supportedLanguages.includes(storedLocale)) {
    return storedLocale
  }

  // Cookie'den kontrol et
  const cookieLocale = safeCookie.get('language')
  if (cookieLocale && supportedLanguages.includes(cookieLocale)) {
    return cookieLocale
  }

  // URL parametresinden kontrol et
  const urlLang = safeURLParams.get('lang')
  if (urlLang && supportedLanguages.includes(urlLang)) {
    return urlLang
  }

  return 'tr' // Varsayılan dil
}

// İlklendirme durumu kontrolü
let initializationPromise: Promise<typeof i18n> | null = null

// İlklendirme fonksiyonu
const initializeI18n = async (): Promise<typeof i18n> => {
  // Zaten başlatılmışsa mevcut instance'ı dön
  if (i18n.isInitialized) {
    return i18n
  }

  // Başlatma işlemi devam ediyorsa bekle
  if (initializationPromise) {
    return initializationPromise
  }

  // Yeni başlatma işlemi başlat
  initializationPromise = new Promise((resolve, reject) => {
    const run = async () => {
      try {
        const initialLanguage = getUserPreferredLanguage()

        await i18n
          .use(LanguageDetector)
          .use(initReactI18next)
          .init({
            resources,
            lng: initialLanguage,
            fallbackLng: 'en',
            debug: false, // Production'da her zaman false olmalı

            interpolation: {
              escapeValue: false,
            },

            detection: {
              order: ['localStorage', 'cookie', 'querystring', 'navigator'],
              lookupLocalStorage: 'language',
              lookupCookie: 'language',
              lookupQuerystring: 'lang',
              caches: ['localStorage', 'cookie'],
            },

            // Namespace ve key separator ayarları
            defaultNS: 'translation',
            keySeparator: '.',
            nsSeparator: ':',
            pluralSeparator: '_',
            contextSeparator: '_',

            // React i18next ayarları
            react: {
              useSuspense: false,
              bindI18n: 'languageChanged',
              bindI18nStore: 'added removed',
              transEmptyNodeValue: '',
              transSupportBasicHtmlNodes: true,
              transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
            },

            // Performans optimizasyonları
            load: 'languageOnly',
            preload: ['tr', 'en'],

            // Çeviri anahtarı bulunamazsa fallback davranışı
            returnEmptyString: false,
            returnNull: false,
            returnObjects: false,

            // Çeviri anahtarı bulunamadığında
            missingKeyHandler: (lng, ns, key, fallbackValue) => {
              if (process.env.NODE_ENV === 'development') {
                console.warn(`Missing translation key: ${key} for language: ${lng}`)
              }
              return fallbackValue || key
            },
          })

        resolve(i18n)
      } catch (error) {
        console.error('i18n initialization failed:', error)
        reject(error)
      }
    }
    run()
  })

  return initializationPromise
}

// Browser ortamında otomatik başlatma
if (isBrowser()) {
  initializeI18n().catch((error) => {
    console.error('i18n otomatik başlatma hatası:', error)
  })
}

// Export edilen helper fonksiyonlar
export const getTranslation = (key: string, lng?: string): string => {
  if (!i18n.isInitialized) return key
  try {
    return i18n.getFixedT(lng || i18n.language)(key) as string
  } catch (error) {
    console.warn('Çeviri alınamadı:', key, error)
    return key
  }
}

export const changeLanguage = async (lng: string): Promise<void> => {
  try {
    // i18n dil değişikliği
    await i18n.changeLanguage(lng)

    // Tarayıcı storage'larını güncelle
    safeLocalStorage.setItem('language', lng)
    safeCookie.set('language', lng, 365)
    safeURLParams.set('lang', lng)

    // HTML lang attribute güncelle
    if (isBrowser() && document.documentElement) {
      document.documentElement.lang = lng
    }
  } catch (error) {
    console.error('Dil değiştirme hatası:', error)
    throw error
  }
}

export const getCurrentLanguage = (): string => {
  return i18n.language || 'tr'
}

export const isReady = (): boolean => {
  return i18n.isInitialized && i18n.hasResourceBundle(i18n.language || 'tr', 'translation')
}

// Named exports
export default i18n
export { initializeI18n, isBrowser }
