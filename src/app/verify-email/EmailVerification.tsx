/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

import { useAuth } from '@/providers/AuthProvider'

import { ThemeSwitcher } from '@/components/ui/theme/theme-switcher'

import AuthApiService from '@/lib/services/authApiService'

type VerificationStatus = 'verifying' | 'success' | 'error'

interface VerificationMessage {
  title: string
  description: string
}

const EmailVerification = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { checkAuth } = useAuth()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [message, setMessage] = useState<VerificationMessage>({
    title: '',
    description: '',
  })

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage({
        title: t('auth.emailVerification.error.invalidLink.title'),
        description: t('auth.emailVerification.error.invalidLink.description'),
      })
      return
    }

    verifyEmailToken(token)
  }, [searchParams, t])

  const verifyEmailToken = async (token: string) => {
    try {
      const response = await AuthApiService.verifyEmail(token)

      if (response.success) {
        setStatus('success')
        setMessage({
          title: t('auth.emailVerification.success.title'),
          description: t('auth.emailVerification.success.description'),
        })

        await checkAuth()

        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        throw new Error(response.message || t('auth.emailVerification.error.defaultError'))
      }
    } catch (error) {
      setStatus('error')
      setMessage({
        title: t('auth.emailVerification.error.verificationFailed.title'),
        description:
          error instanceof Error ? error.message : t('auth.emailVerification.error.verificationFailed.description'),
      })
    }
  }

  const handleReturnToLogin = () => {
    router.push('/login')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      {/* Theme Switcher - top right corner */}
      <div className='absolute top-4 right-4'>
        <ThemeSwitcher variant='button' size='sm' />
      </div>

      <div className='max-w-md w-full space-y-8'>
        <div className='bg-card border border-border rounded-lg shadow-theme-lg p-8'>
          <div className='text-center'>
            {status === 'verifying' && (
              <>
                <Loader2 className='mx-auto h-12 w-12 text-primary animate-spin' />
                <h2 className='mt-4 text-xl font-semibold text-foreground'>
                  {t('auth.emailVerification.verifying.title')}
                </h2>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {t('auth.emailVerification.verifying.description')}
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className='mx-auto h-12 w-12 text-green-600 dark:text-green-400' />
                <h2 className='mt-4 text-xl font-semibold text-green-900 dark:text-green-100'>{message.title}</h2>
                <p className='mt-2 text-sm text-green-700 dark:text-green-300'>{message.description}</p>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className='mx-auto h-12 w-12 text-red-600 dark:text-red-400' />
                <h2 className='mt-4 text-xl font-semibold text-red-900 dark:text-red-100'>{message.title}</h2>
                <p className='mt-2 text-sm text-red-700 dark:text-red-300 mb-6'>{message.description}</p>
                <button
                  onClick={handleReturnToLogin}
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:ring-inset transition-colors theme-transition-colors'
                >
                  {t('auth.emailVerification.returnToLogin')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
