/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'

import { useState, useCallback, useMemo } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Clock, ShieldAlert } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { ThemeSwitcher } from '@/components/ui/theme/theme-switcher'
import { LanguageSwitcher } from '@/components/ui/language/language-switcher'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { authApi } from '@/lib/api/api'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('auth.forgotPassword.emailRequired') })
      .email({ message: t('auth.forgotPassword.emailInvalid') })
      .transform((email) => email.toLowerCase().trim()),
  })

interface SuccessScreenProps {
  emailSent: string
  t: (key: string, options?: any) => string
}

const SuccessScreen = ({ emailSent, t }: SuccessScreenProps) => (
  <div className='w-full max-w-md mx-auto'>
    <Card>
      <CardHeader className='text-center'>
        <div className='mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4'>
          <CheckCircle className='w-6 h-6 text-green-600 dark:text-green-400' />
        </div>
        <CardTitle className='text-xl font-semibold'>{t('auth.forgotPassword.success.title')}</CardTitle>
        <CardDescription className='text-center'>
          {t('auth.forgotPassword.success.description', { email: emailSent })}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4'>
          <div className='flex items-start gap-3'>
            <Mail className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                {t('auth.forgotPassword.success.checkEmail')}
              </h4>
              <p className='text-xs text-blue-700 dark:text-blue-300'>
                {t('auth.forgotPassword.success.emailInstructions')}
              </p>
              <p className='text-xs text-blue-600 dark:text-blue-400'>{t('auth.forgotPassword.success.linkExpiry')}</p>
            </div>
          </div>
        </div>

        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3'>
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4 text-yellow-600 dark:text-yellow-400' />
            <p className='text-xs text-yellow-700 dark:text-yellow-300'>
              {t('auth.forgotPassword.success.rateLimitInfo')}
            </p>
          </div>
        </div>

        <div className='text-center space-y-3'>
          <Link href='/login'>
            <Button className='w-full'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              {t('auth.forgotPassword.success.backToLoginButton')}
            </Button>
          </Link>

          <div className='text-xs text-muted-foreground'>
            {t('auth.forgotPassword.success.didntReceive')}{' '}
            <Link href='/contact' className='text-primary hover:text-primary/80 transition-colors'>
              {t('auth.forgotPassword.success.contactSupport')}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

interface ErrorDisplayProps {
  error: string
  t: (key: string, options?: any) => string
}

const ErrorDisplay = ({ error, t }: ErrorDisplayProps) => {
  const getErrorIcon = () => {
    if (error.includes('AUTH_037')) return <Clock className='w-4 h-4' />
    if (error.includes('AUTH_033')) return <ShieldAlert className='w-4 h-4' />
    if (error.includes('AUTH_034')) return <Mail className='w-4 h-4' />
    return <AlertCircle className='w-4 h-4' />
  }

  const getErrorStyle = () => {
    if (error.includes('AUTH_037')) {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400'
    }
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
  }

  return (
    <div className={`border rounded-md p-3 ${getErrorStyle()}`}>
      <div className='flex items-start gap-2'>
        {getErrorIcon()}
        <div className='space-y-1'>
          <p className='text-sm font-medium'>
            {error.includes('AUTH_037') && t('auth.forgotPassword.error.rateLimitTitle')}
            {error.includes('AUTH_033') && t('auth.forgotPassword.error.emailNotFoundTitle')}
            {error.includes('AUTH_034') && t('auth.forgotPassword.error.emailNotVerifiedTitle')}
            {!error.includes('AUTH_037') &&
              !error.includes('AUTH_033') &&
              !error.includes('AUTH_034') &&
              t('auth.forgotPassword.error.defaultTitle')}
          </p>
          <p className='text-xs'>{error}</p>

          {error.includes('AUTH_034') && (
            <div className='mt-2'>
              <Link href='/resend-verification'>
                <Button variant='outline' size='sm' className='text-xs h-7'>
                  {t('auth.forgotPassword.error.resendVerification')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  const { t } = useTranslation()

  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t])
  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const handleApiError = useCallback(
    (err: any) => {
      if (err?.response?.status === 404) {
        return t('auth.forgotPassword.error.emailNotFound')
      }
      if (err?.response?.status === 400) {
        return t('auth.forgotPassword.error.emailNotVerified')
      }
      if (err?.response?.status === 429) {
        const errorMessage = err?.response?.data?.error || err?.message || ''
        // Saat bilgisini mesajdan çıkar
        const hoursMatch = errorMessage.match(/(\d+)\s*saat/)
        const hours = hoursMatch ? hoursMatch[1] : '24'
        return t('auth.forgotPassword.error.rateLimitExceeded', { hours })
      }
      if (err?.response?.status === 503) {
        return t('auth.forgotPassword.error.emailServiceUnavailable')
      }

      return err instanceof Error ? err.message : t('auth.forgotPassword.error.default')
    },
    [t],
  )

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      if (isLoading) return

      setIsLoading(true)
      setError('')

      try {
        await authApi.forgotPassword(data.email)

        setEmailSent(data.email)
        setIsSuccess(true)
        reset()
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, reset, t, handleApiError],
  )

  if (isSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
        <div className='w-full max-w-md space-y-6'>
          <div className='flex justify-center items-center space-x-2'>
            <LanguageSwitcher variant='button' showLabel className='bg-card shadow-theme-sm border border-border' />
            <ThemeSwitcher variant='button' showLabel />
          </div>
          <SuccessScreen emailSent={emailSent} t={t} />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex justify-center items-center space-x-2'>
          <LanguageSwitcher variant='button' showLabel className='bg-card shadow-theme-sm border border-border' />
          <ThemeSwitcher variant='button' showLabel />
        </div>

        <Card>
          <CardHeader className='text-center'>
            <div className='mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4'>
              <Mail className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <CardTitle className='text-2xl font-bold'>{t('auth.forgotPassword.title')}</CardTitle>
            <CardDescription>{t('auth.forgotPassword.description')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>{t('auth.forgotPassword.emailLabel')}</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  autoComplete='email'
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className='text-sm text-red-500 flex items-center gap-1'>
                    <AlertCircle className='w-3 h-3' />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {error && <ErrorDisplay error={error} t={t} />}

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    {t('auth.forgotPassword.sending')}
                  </div>
                ) : (
                  <>
                    <Mail className='w-4 h-4 mr-2' />
                    {t('auth.forgotPassword.sendResetLink')}
                  </>
                )}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <Link
                href='/login'
                className='text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1'
              >
                <ArrowLeft className='w-3 h-3' />
                {t('auth.forgotPassword.backToLogin')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className='text-center space-y-2'>
          <div className='border-t pt-6'>
            <h3 className='text-sm font-medium text-foreground mb-2'>{t('auth.forgotPassword.help.title')}</h3>
            <p className='text-xs text-muted-foreground mb-3'>{t('auth.forgotPassword.help.description')}</p>
            <div className='flex justify-center gap-4'>
              <Link href='/contact' className='text-xs text-primary hover:text-primary/80 transition-colors'>
                {t('auth.forgotPassword.help.contact')}
              </Link>
              <Link href='/support' className='text-xs text-primary hover:text-primary/80 transition-colors'>
                {t('auth.forgotPassword.help.support')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
