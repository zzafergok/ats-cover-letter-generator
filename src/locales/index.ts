'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './en/translation.json'
import trTranslation from './tr/translation.json'

// İlklendirme kontrolü
let isInitialized = false

// Resources for i18next
const resources = {
  en: { translation: enTranslation },
  tr: { translation: trTranslation },
}

// i18n yapılandırmasını bir kez yap
if (!isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: 'tr', // Türkçe varsayılan olarak ayarla
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: 'language',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        caches: ['localStorage'],
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
        bindI18nStore: '',
        transEmptyNodeValue: '',
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      },
    })
  isInitialized = true
}

export default i18n
