/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useSearchParams } from 'next/navigation'

import { useCallback, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { SupportedLocale, getUserLocale, setUserLocale, isSupportedLocale, ensureLocaleInUrl } from '@/lib/locale-utils'

export function useLocale() {
  const { i18n } = useTranslation()
  const searchParams = useSearchParams()
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(() => getUserLocale())

  const [isMounted, setIsMounted] = useState(false)
  const [isI18nReady, setIsI18nReady] = useState(false)
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)

  // Component mount durumunu takip et
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // i18n hazırlık durumunu takip et
  useEffect(() => {
    if (i18n.isInitialized) {
      setIsI18nReady(true)
    } else {
      const handleInitialized = () => {
        setIsI18nReady(true)
      }

      i18n.on('initialized', handleInitialized)

      return () => {
        i18n.off('initialized', handleInitialized)
      }
    }
  }, [i18n])

  // Sayfa yüklendiğinde dil tercihini URL'e yansıt
  useEffect(() => {
    if (isMounted && isI18nReady) {
      ensureLocaleInUrl()
    }
  }, [isMounted, isI18nReady])

  // URL parametresi değişikliklerini dinle
  useEffect(() => {
    if (!isI18nReady) return

    const langParam = searchParams.get('lang')
    if (langParam && isSupportedLocale(langParam) && langParam !== currentLocale) {
      changeLocale(langParam)
    }
  }, [searchParams, currentLocale, isI18nReady])

  // i18n ile senkronizasyon
  useEffect(() => {
    if (isI18nReady && i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale)
    }
  }, [currentLocale, i18n, isI18nReady])

  const changeLocale = useCallback(
    (newLocale: SupportedLocale) => {
      if (typeof window !== 'undefined' && isI18nReady) {
        if (newLocale === currentLocale || isChangingLanguage) {
          return
        }

        setIsChangingLanguage(true)
        setCurrentLocale(newLocale)
        setUserLocale(newLocale)
        i18n.changeLanguage(newLocale)

        // URL'yi güncelle
        const current = new URL(window.location.href)
        current.searchParams.set('lang', newLocale)
        window.history.replaceState(null, '', current.toString())

        // HTML lang attribute'unu güncelle
        document.documentElement.lang = newLocale

        // Meta tag güncellemesi
        const metaLang = document.querySelector('meta[name="language"]')
        if (metaLang) {
          metaLang.setAttribute('content', newLocale)
        } else {
          const newMetaLang = document.createElement('meta')
          newMetaLang.name = 'language'
          newMetaLang.content = newLocale
          document.head.appendChild(newMetaLang)
        }

        // Storage event ile diğer sekmeler için senkronizasyon
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'language',
            newValue: newLocale,
            oldValue: currentLocale,
            storageArea: localStorage,
            url: window.location.href,
          }),
        )

        setTimeout(() => {
          setIsChangingLanguage(false)
        }, 300)
      }
    },
    [currentLocale, i18n, isChangingLanguage, isI18nReady],
  )

  const changeLocaleWithReload = useCallback(
    (newLocale: SupportedLocale) => {
      if (newLocale === currentLocale || !isI18nReady) return

      setUserLocale(newLocale)

      const current = new URL(window.location.href)
      current.searchParams.set('lang', newLocale)
      window.location.href = current.toString()
    },
    [currentLocale, isI18nReady],
  )

  return {
    currentLocale,
    changeLocale,
    changeLocaleWithReload,
    isChangingLanguage,
    isCurrentLocale: useCallback((locale: SupportedLocale) => locale === currentLocale, [currentLocale]),
    // Yeni eklenen özellikler
    isI18nReady,
    isMounted,
    isReady: isMounted && isI18nReady, // Hem mount hem de i18n hazır mı?
  }
}
