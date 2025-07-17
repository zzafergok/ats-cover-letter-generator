'use client'

import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Languages, Globe } from 'lucide-react'

import { Button } from '@/components/core/button'

import { changeLanguage, getCurrentLanguage } from '@/locales'

import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  variant?: 'button' | 'toggle'
  size?: 'sm' | 'default' | 'lg'
  showLabel?: boolean
  className?: string
}

export function LanguageSwitcher({
  variant = 'toggle',
  size = 'default',
  showLabel = false,
  className,
}: LanguageSwitcherProps) {
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

  const handleLanguageToggle = async () => {
    const newLanguage = currentLanguage === 'tr' ? 'en' : 'tr'

    if (isTransitioning) return

    setIsTransitioning(true)
    try {
      await changeLanguage(newLanguage)
      setCurrentLanguage(newLanguage)
    } catch (error) {
      console.error('Language change failed:', error)
      setIsTransitioning(false)
    }
  }

  if (!mounted) {
    return (
      <Button variant='ghost' size={size} className={cn('pointer-events-none opacity-50', className)} disabled>
        <Languages className='h-4 w-4' />
        {showLabel && <span className='ml-2'>{t('language.title')}</span>}
      </Button>
    )
  }

  const languageDataMap = {
    tr: {
      label: t('language.turkish.title'),
      native: t('language.turkish.native'),
      flag: '🇹🇷',
      icon: Languages,
    },
    en: {
      label: t('language.english.title'),
      native: t('language.english.native'),
      flag: '🇺🇸',
      icon: Globe,
    },
  }

  const currentLanguageData = languageDataMap[currentLanguage as keyof typeof languageDataMap] || languageDataMap.en

  const nextLanguage = currentLanguage === 'tr' ? 'en' : 'tr'
  const nextLanguageData = languageDataMap[nextLanguage as keyof typeof languageDataMap] || languageDataMap.en

  if (variant === 'button') {
    return (
      <Button
        variant='ghost'
        size={size}
        onClick={handleLanguageToggle}
        disabled={isTransitioning}
        className={cn('transition-all duration-200', isTransitioning && 'pointer-events-none opacity-75', className)}
        aria-label={t('language.switchTo', { language: nextLanguageData.label })}
      >
        <span className='text-base mr-2'>{currentLanguageData.flag}</span>
        {showLabel && <span className='ml-1'>{currentLanguageData.native}</span>}
      </Button>
    )
  }

  return (
    <Button
      variant='ghost'
      size={size}
      onClick={handleLanguageToggle}
      disabled={isTransitioning}
      className={cn('relative transition-all duration-200', isTransitioning && 'pointer-events-none', className)}
      aria-label={t('language.switchTo', { language: nextLanguageData.label })}
    >
      <div className='relative flex items-center'>
        <span
          className={cn(
            'text-base transition-all duration-300',
            isTransitioning ? 'scale-75 opacity-50' : 'scale-100 opacity-100',
          )}
        >
          {currentLanguageData.flag}
        </span>
        {isTransitioning && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin' />
          </div>
        )}
      </div>
      {showLabel && <span className='ml-2 font-medium'>{currentLanguageData.native}</span>}
    </Button>
  )
}
