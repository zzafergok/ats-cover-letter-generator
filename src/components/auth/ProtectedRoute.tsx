'use client'

import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useAuth } from '@/providers/AuthProvider'

import { LoadingSpinner } from '../core/loading-spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  requiredRole?: string
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
  requiredRole,
  fallback,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { isAuthenticated, loading, user } = useAuth()

  const [authChecked, setAuthChecked] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Hydration fix: Client-side rendering kontrolü
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Hydration safe loading text
  const loadingText = isClient ? t('auth.loading') : 'Loading...'

  const defaultFallback = <LoadingSpinner size='lg' text={loadingText} centered />

  useEffect(() => {
    if (loading) {
      setAuthChecked(false)
      return
    }

    if (!authChecked) {
      setAuthChecked(true)
    }

    if (hasRedirected) return

    if (requireAuth && !isAuthenticated) {
      setHasRedirected(true)
      router.replace(redirectTo)
      return
    }

    if (requireAuth && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      setHasRedirected(true)
      router.replace('/unauthorized')
      return
    }

    if (!requireAuth && isAuthenticated) {
      setHasRedirected(true)
      router.replace('/dashboard')
      return
    }

    setHasRedirected(false)
  }, [
    isAuthenticated,
    loading,
    requireAuth,
    requiredRole,
    user?.role,
    user?.email,
    router,
    redirectTo,
    hasRedirected,
    authChecked,
  ])

  if (loading || !authChecked || !isClient) {
    return <>{fallback || defaultFallback}</>
  }

  if (requireAuth && !isAuthenticated) {
    return <>{fallback || defaultFallback}</>
  }

  if (requireAuth && isAuthenticated && requiredRole && user?.role !== requiredRole) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='text-6xl text-red-500 mb-4'>🚫</div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>{t('auth.unauthorized.title')}</h1>
          <p className='text-gray-600 mb-6'>{t('auth.unauthorized.message')}</p>
          <button
            onClick={() => router.replace('/dashboard')}
            className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors'
          >
            {t('auth.unauthorized.backToDashboard')}
          </button>
        </div>
      </div>
    )
  }

  if (!requireAuth && isAuthenticated) {
    return <>{fallback || defaultFallback}</>
  }

  return <>{children}</>
}
