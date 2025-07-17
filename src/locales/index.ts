'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './en/translation.json'
import trTranslation from './tr/translation.json'

// Resources for i18next
const resources = {
  en: { translation: enTranslation },
  tr: { translation: trTranslation },
}

// Kullanıcının tercih ettiği dili al
const getUserPreferredLanguage = (): string => {
  if (typeof window !== 'undefined') {
    // localStorage'dan kontrol et (en yüksek öncelik)
    const storedLocale = localStorage.getItem('language')
    if (storedLocale && ['tr', 'en'].includes(storedLocale)) {
      return storedLocale
    }

    // Cookie'den kontrol et
    const cookieMatch = document.cookie.match(/language=([^;]+)/)
    if (cookieMatch && ['tr', 'en'].includes(cookieMatch[1])) {
      return cookieMatch[1]
    }

    // URL parametresinden kontrol et
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang')
    if (urlLang && ['tr', 'en'].includes(urlLang)) {
      return urlLang
    }
  }

  return 'tr' // Varsayılan dil
}

// İlklendirme kontrolü
const initializeI18n = () => {
  if (!i18n.isInitialized) {
    const initialLanguage = getUserPreferredLanguage()

    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage, // Kullanıcı tercihini kullan
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
          escapeValue: false,
        },

        detection: {
          order: ['localStorage', 'cookie', 'querystring', 'navigator', 'htmlTag'],
          lookupLocalStorage: 'language',
          lookupCookie: 'language',
          lookupQuerystring: 'lang',
          lookupFromPathIndex: 0,
          lookupFromSubdomainIndex: 0,
          caches: ['localStorage', 'cookie'],
          excludeCacheFor: ['cimode'],
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

        // Çeviri anahtarının kendisini göster eğer çeviri bulunamazsa
        missingKeyHandler: (lng, ns, key, fallbackValue) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Missing translation key: ${key} for language: ${lng}`)
          }
          return fallbackValue || key
        },
      })
      .catch((error) => {
        console.error('i18n initialization failed:', error)
      })
  }
}

// Browser ortamında çalıştır
if (typeof window !== 'undefined') {
  initializeI18n()
}

export default i18n

// Export edilen helper fonksiyonlar - Güncellenmiş
export const getTranslation = (key: string, lng?: string) => {
  return i18n.getFixedT(lng || i18n.language)(key)
}

export const changeLanguage = (lng: string) => {
  // Dil değişikliğinde localStorage ve cookie'yi de güncelle
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng)

    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `language=${lng}; path=/; expires=${expires.toUTCString()}; samesite=lax`

    // URL parametresini de güncelle
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('lang', lng)
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.replaceState(null, '', newUrl)
  }

  return i18n.changeLanguage(lng)
}

export const getCurrentLanguage = () => {
  return i18n.language
}

export const isReady = () => {
  return i18n.isInitialized && i18n.hasResourceBundle(i18n.language, 'translation')
}
