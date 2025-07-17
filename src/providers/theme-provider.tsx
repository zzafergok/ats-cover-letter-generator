'use client'

import { useEffect } from 'react'

import { useTheme } from '@/hooks/useTheme'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark'
  disableTransitions?: boolean
}

export function ThemeProvider({ children, defaultTheme = 'light', disableTransitions = false }: ThemeProviderProps) {
  const { isInitialized, setTheme } = useTheme()

  useEffect(() => {
    if (isInitialized) {
      const storedTheme = localStorage.getItem('starkon-theme-storage')
      if (!storedTheme) {
        setTheme(defaultTheme)
      }
    }
  }, [isInitialized, defaultTheme, setTheme])

  useEffect(() => {
    if (disableTransitions && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--theme-transition-duration', '0ms')
    }

    return () => {
      if (disableTransitions && typeof document !== 'undefined') {
        document.documentElement.style.removeProperty('--theme-transition-duration')
      }
    }
  }, [disableTransitions])

  return <>{children}</>
}
