'use client'

import { useState, useEffect } from 'react'

import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/hooks/useTheme'

import { Button } from '@/components/core/button'

import { cn } from '@/lib/utils'

interface ThemeSwitcherProps {
  variant?: 'button' | 'toggle'
  size?: 'sm' | 'default' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ThemeSwitcher({
  variant = 'toggle',
  size = 'default',
  showLabel = false,
  className,
}: ThemeSwitcherProps) {
  const { t } = useTranslation()
  const { setTheme, isInitialized, isTransitioning, isDark } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isInitialized) {
    return (
      <Button variant='ghost' size={size} className={cn('pointer-events-none opacity-50', className)} disabled>
        <Sun className='h-4 w-4' />
        {showLabel && <span className='ml-2'>{t('theme.title')}</span>}
      </Button>
    )
  }

  if (variant === 'button') {
    return (
      <Button
        variant='ghost'
        size={size}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        disabled={isTransitioning}
        className={cn('transition-all duration-200', isTransitioning && 'pointer-events-none opacity-75', className)}
        aria-label={t('theme.switchTo', { theme: isDark ? t('theme.light.title') : t('theme.dark.title') })}
      >
        {isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
        {showLabel && <span className='ml-2'>{isDark ? t('theme.light.title') : t('theme.dark.title')}</span>}
      </Button>
    )
  }

  return (
    <Button
      variant='ghost'
      size={size}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      disabled={isTransitioning}
      className={cn('relative transition-all duration-200', isTransitioning && 'pointer-events-none', className)}
      aria-label={t('theme.switchTo', { theme: isDark ? t('theme.light.title') : t('theme.dark.title') })}
    >
      <div className='relative'>
        <Sun
          className={cn(
            'h-4 w-4 transition-all duration-300',
            isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 h-4 w-4 transition-all duration-300',
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0',
          )}
        />
      </div>
      {showLabel && <span className='ml-2'>{isDark ? t('theme.dark.title') : t('theme.light.title')}</span>}
    </Button>
  )
}
