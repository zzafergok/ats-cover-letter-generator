'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/core/Button/Button'
import { LoginForm } from '@/components/forms/auth/LoginForm'
import { LoadingSpinner } from '@/components/core/Loading/LoadingSpinner'
import { LoginFormValues } from '@/lib/validations/auth'

function LoginPageContent() {
  const router = useRouter()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const { isAuthenticated, login, isLoading } = useAuth()

  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const error = searchParams.get('error')

  const handleLogin = async (data: LoginFormValues) => {
    try {
      // console.log(t('auth.loginFormSubmitted'))
      await login(data)
    } catch {
      // console.error('Login failed:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // console.log(t('auth.alreadyAuthenticated'), redirectTo)
      router.replace(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router, t])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900'>
        <div className='text-center space-y-4'>
          <LoadingSpinner size='lg' />
          <p className='text-sm text-neutral-600 dark:text-neutral-300'>{t('common.authenticating')}</p>
        </div>
      </div>
    )
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'unauthorized':
        return t('errors.unauthorized')
      case 'session_expired':
        return t('errors.sessionExpired')
      case 'invalid_token':
        return t('errors.invalidToken')
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-primary-50 to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-800 relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 dark:hero-pattern-dark' />
      <div className='absolute top-0 right-0 w-96 h-96 bg-primary-200/20 dark:bg-primary-700/10 rounded-full blur-3xl' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent-200/20 dark:bg-accent-700/10 rounded-full blur-3xl' />

      {/* Header with back button */}
      <div className='absolute top-4 left-4 z-20'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.push('/')}
          className='flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 backdrop-blur-sm'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('common.backToHome')}</span>
        </Button>
      </div>

      {/* Error message from URL */}
      {error && (
        <div className='absolute top-16 left-1/2 transform -translate-x-1/2 z-20'>
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg text-sm backdrop-blur-sm'>
            {getErrorMessage(error)}
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className='relative z-10'>
        <LoginForm
          onSubmit={handleLogin}
          redirectOnSuccess={redirectTo}
          variant='default'
          showRememberMe={true}
          showForgotPassword={true}
          showRegisterLink={true}
        />
      </div>
    </div>
  )
}

export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900'>
          <div className='text-center space-y-4'>
            <LoadingSpinner size='lg' />
            <p className='text-sm text-neutral-600 dark:text-neutral-300'>{t('common.pageLoading')}</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
