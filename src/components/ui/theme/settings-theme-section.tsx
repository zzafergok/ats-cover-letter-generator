'use client'

import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Moon, Sun, Palette } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'

import { SettingsSelector, SelectorOption } from '@/components/ui/settings/settings-selector'

import { cn } from '@/lib/utils'

export function SettingsThemeSection() {
  const { t } = useTranslation()
  const { theme, setTheme, isInitialized, isTransitioning } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme)
    }
  }

  const themeOptions: SelectorOption[] = [
    {
      value: 'light',
      label: t('theme.light.title'),
      description: t('theme.light.description'),
      icon: Sun,
      preview: (
        <>
          <div className={cn('absolute top-1 left-1 right-1 h-2 rounded-sm bg-slate-100')} />
          <div className={cn('absolute top-4 left-1 right-1 bottom-1 rounded-sm bg-white')} />
        </>
      ),
    },
    {
      value: 'dark',
      label: t('theme.dark.title'),
      description: t('theme.dark.description'),
      icon: Moon,
      preview: (
        <>
          <div className={cn('absolute top-1 left-1 right-1 h-2 rounded-sm bg-slate-800')} />
          <div className={cn('absolute top-4 left-1 right-1 bottom-1 rounded-sm bg-slate-900')} />
        </>
      ),
    },
  ]

  return (
    <SettingsSelector
      title={t('settings.themeAndAppearance')}
      description={t('settings.customizeInterface')}
      titleIcon={Palette}
      options={themeOptions}
      value={theme}
      onChange={handleThemeChange}
      isLoading={!mounted || !isInitialized}
      isTransitioning={isTransitioning}
      activeLabel={t('theme.active')}
      noteText={t('theme.note')}
      preferenceTitle={t('theme.preference')}
      preferenceDescription={t('theme.description')}
    />
  )
}
