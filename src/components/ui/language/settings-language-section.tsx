'use client'

import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Languages, Globe } from 'lucide-react'

import { SettingsSelector, SelectorOption } from '@/components/ui/settings/settings-selector'

import { changeLanguage, getCurrentLanguage } from '@/locales'

export function SettingsLanguageSection() {
  const { t, i18n } = useTranslation()

  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage())

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language)
      setIsTransitioning(false)
    }

    i18n.on('languageChanged', handleLanguageChanged)
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === currentLanguage || isTransitioning) return

    setIsTransitioning(true)
    try {
      await changeLanguage(newLanguage)
      setCurrentLanguage(newLanguage)
    } catch (error) {
      console.error('Language change failed:', error)
      setIsTransitioning(false)
    }
  }

  const languageOptions: SelectorOption[] = [
    {
      value: 'tr',
      label: t('language.turkish.title'),
      description: t('language.turkish.description'),
      native: t('language.turkish.native'),
      icon: Languages,
      preview: '🇹🇷',
    },
    {
      value: 'en',
      label: t('language.english.title'),
      description: t('language.english.description'),
      native: t('language.english.native'),
      icon: Globe,
      preview: '🇺🇸',
    },
  ]

  return (
    <SettingsSelector
      title={t('settings.languageAndRegion')}
      description={t('settings.languagePreferences')}
      titleIcon={Languages}
      options={languageOptions}
      value={currentLanguage}
      onChange={handleLanguageChange}
      isLoading={!mounted}
      isTransitioning={isTransitioning}
      activeLabel={t('language.active')}
      noteText={t('language.note')}
      preferenceTitle={t('language.preference')}
      preferenceDescription={t('language.description')}
    />
  )
}
