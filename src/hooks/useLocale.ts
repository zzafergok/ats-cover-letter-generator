'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SupportedLocale, getUserLocale, setUserLocale, isSupportedLocale } from '@/lib/locale-utils'

export function useLocale() {
  const { i18n } = useTranslation()
  const searchParams = useSearchParams()
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(() => getUserLocale())
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)

  useEffect(() => {
    const langParam = searchParams.get('lang')
    if (langParam && isSupportedLocale(langParam) && langParam !== currentLocale) {
      changeLocale(langParam)
    }
  }, [searchParams, currentLocale])

  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale)
    }
  }, [currentLocale, i18n])

  const changeLocale = useCallback(
    (newLocale: SupportedLocale) => {
      if (newLocale === currentLocale || isChangingLanguage) {
        return
      }

      setIsChangingLanguage(true)
      setCurrentLocale(newLocale)
      setUserLocale(newLocale)
      i18n.changeLanguage(newLocale)

      const current = new URL(window.location.href)
      current.searchParams.set('lang', newLocale)
      window.history.replaceState(null, '', current.toString())

      document.documentElement.lang = newLocale

      const metaLang = document.querySelector('meta[name="language"]')
      if (metaLang) {
        metaLang.setAttribute('content', newLocale)
      } else {
        const newMetaLang = document.createElement('meta')
        newMetaLang.name = 'language'
        newMetaLang.content = newLocale
        document.head.appendChild(newMetaLang)
      }

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
    },
    [currentLocale, i18n, isChangingLanguage],
  )

  const changeLocaleWithReload = useCallback(
    (newLocale: SupportedLocale) => {
      if (newLocale === currentLocale) return

      const current = new URL(window.location.href)
      current.searchParams.set('lang', newLocale)
      window.location.href = current.toString()
    },
    [currentLocale],
  )

  return {
    currentLocale,
    changeLocale,
    changeLocaleWithReload,
    isChangingLanguage,
    isCurrentLocale: useCallback((locale: SupportedLocale) => locale === currentLocale, [currentLocale]),
  }
}
