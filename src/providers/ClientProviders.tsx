'use client'

import React, { useEffect, useState } from 'react'
import { ToastContainer } from '@/components/ui/ToastContainer/ToastContainer'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { EnhancedErrorBoundary } from '@/components/ui/ErrorBoundary/EnhancedErrorBoundary'

interface ClientProvidersProps {
  children: React.ReactNode
}

function LoadingFallback() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900'>
      <div className='text-center space-y-4'>
        <LoadingSpinner size='lg' />
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>Uygulama yükleniyor...</p>
      </div>
    </div>
  )
}

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initializeTheme = () => {
      try {
        const html = document.documentElement

        if (html.classList.contains('light') || html.classList.contains('dark')) {
          setMounted(true)
          return
        }

        const savedTheme = localStorage.getItem('theme') || 'system'
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const effectiveTheme = savedTheme === 'system' ? systemPreference : savedTheme

        html.classList.remove('light', 'dark', 'theme-loading')
        html.classList.add(effectiveTheme)
        html.style.colorScheme = effectiveTheme

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          if (localStorage.getItem('theme') === 'system') {
            const newTheme = e.matches ? 'dark' : 'light'
            html.classList.remove('light', 'dark')
            html.classList.add(newTheme)
            html.style.colorScheme = newTheme
          }
        }

        mediaQuery.addEventListener('change', handleSystemThemeChange)
        setMounted(true)

        return () => {
          mediaQuery.removeEventListener('change', handleSystemThemeChange)
        }
      } catch (error) {
        console.warn('Theme initialization error:', error)
        document.documentElement.classList.add('light')
        setMounted(true)
      }
    }

    const timeoutId = setTimeout(initializeTheme, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  if (!mounted) {
    return <LoadingFallback />
  }

  return <>{children}</>
}

function AuthHydration({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Zustand persist store'larının hydrate olmasını bekle
    const hydrationTimeout = setTimeout(() => {
      setIsHydrated(true)
    }, 100)

    return () => clearTimeout(hydrationTimeout)
  }, [])

  if (!isHydrated) {
    return <LoadingFallback />
  }

  return <>{children}</>
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        if (process.env.NODE_ENV === 'production') {
          console.error('Global Error:', error, errorInfo)
        }
      }}
    >
      <ThemeInitializer>
        <AuthHydration>
          {children}
          <ToastContainer position='top-right' />
        </AuthHydration>
      </ThemeInitializer>
    </EnhancedErrorBoundary>
  )
}
