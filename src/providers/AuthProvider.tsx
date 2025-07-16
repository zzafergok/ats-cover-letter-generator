'use client'

import { useRouter, usePathname } from 'next/navigation'

import React, { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'

import { LoadingSpinner } from '@/components/core/Loading/LoadingSpinner'
// import { logAuthDebug } from '@/utils/authDebug'

interface AuthProviderProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthProvider({ children, requireAuth = false, redirectTo = '/auth/login' }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()

  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setInitError(null)

        // if (process.env.NODE_ENV === 'development') {
        //   logAuthDebug('AuthProvider - Before checkAuth')
        // }

        await checkAuth()

        // if (process.env.NODE_ENV === 'development') {
        //   logAuthDebug('AuthProvider - After checkAuth')
        // }
      } catch (error) {
        console.error('[AuthProvider] Auth initialization failed:', error)
        setInitError(error instanceof Error ? error.message : 'Authentication failed')
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isInitialized || isLoading) return

    if (requireAuth && !isAuthenticated) {
      const loginUrl = new URL(redirectTo, window.location.origin)
      if (pathname !== redirectTo) {
        loginUrl.searchParams.set('redirect', pathname)
      }

      // if (process.env.NODE_ENV === 'development') {
      //   console.log('[AuthProvider] Redirecting to login:', loginUrl.toString())
      // }

      router.push(loginUrl.toString())
      return
    }

    if (!requireAuth && isAuthenticated && pathname.startsWith('/auth/')) {
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('[AuthProvider] Redirecting authenticated user to dashboard')
      // }
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, pathname, router, isInitialized])

  if (!isInitialized || isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900'>
        <div className='text-center space-y-4'>
          <LoadingSpinner size='lg' />
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>Kimlik doğrulanıyor...</p>
          {process.env.NODE_ENV === 'development' && initError && (
            <p className='text-xs text-red-500 max-w-md mx-auto'>Debug: {initError}</p>
          )}
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900'>
        <div className='text-center space-y-4'>
          <LoadingSpinner size='lg' />
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
