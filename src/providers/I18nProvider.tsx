'use client'

import { useEffect, useState } from 'react'

import { I18nextProvider } from 'react-i18next'

import i18n, { initializeI18n } from '@/lib/i18n'

interface I18nProviderProps {
  children: React.ReactNode
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeI18n()
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        setIsInitialized(true) // Hata durumunda da devam et
      }
    }

    init()
  }, [])

  // i18n yüklenene kadar children'ı render et ama provider olmadan
  if (!isInitialized) {
    return <>{children}</>
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
