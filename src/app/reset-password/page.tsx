/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { useState, useCallback, useMemo, useEffect } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { ThemeSwitcher } from '@/components/ui/theme/theme-switcher'
import { LanguageSwitcher } from '@/components/ui/language/language-switcher'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { authApi } from '@/lib/api/api'
import { createResetPasswordSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const SuccessScreen = ({ t }: { t: (key: string) => string }) => (
  <div className='w-full max-w-md'>
    <Card>
      <CardHeader className='text-center'>
        <div className='mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4'>
          <CheckCircle className='w-6 h-6 text-green-600 dark:text-green-400' />
        </div>
        <CardTitle className='text-xl font-semibold'>{t('auth.resetPassword.success.title')}</CardTitle>
        <CardDescription>{t('auth.resetPassword.success.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href='/login'>
          <Button className='w-full'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('auth.resetPassword.success.loginButton')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  </div>
)

const ErrorScreen = ({ error, t }: { error: string; t: (key: string) => string }) => (
  <div className='w-full max-w-md'>
    <Card>
      <CardHeader className='text-center'>
        <div className='mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4'>
          <AlertCircle className='w-6 h-6 text-red-600 dark:text-red-400' />
        </div>
        <CardTitle className='text-xl font-semibold'>{t('auth.resetPassword.error.invalidToken')}</CardTitle>
        <CardDescription>{error}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href='/forgot-password'>
          <Button className='w-full'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('auth.resetPassword.backToLogin')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  </div>
)

export default function ResetPasswordPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false })

  const token = searchParams.get('token')

  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t])
  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    if (!token) {
      setError(t('auth.resetPassword.error.tokenRequired'))
    }
  }, [token, t])

  const togglePasswordVisibility = useCallback((field: 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }, [])

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      if (isLoading || !token) return

      setIsLoading(true)
      setError('')

      try {
        await authApi.resetPassword({ token, newPassword: data.newPassword, confirmPassword: data.confirmPassword })
        setIsSuccess(true)
        reset()

        // 2 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (err: any) {
        const errorMessage =
          err?.response?.status === 400
            ? t('auth.resetPassword.error.invalidToken')
            : err?.response?.status === 429
              ? t('auth.resetPassword.error.rateLimitExceeded')
              : t('auth.resetPassword.error.default')
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, token, t, reset, router],
  )

  if (!token || error) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
        <div className='w-full max-w-md space-y-6'>
          <div className='flex justify-center items-center space-x-2'>
            <LanguageSwitcher variant='button' showLabel className='bg-card shadow-theme-sm border border-border' />
            <ThemeSwitcher variant='button' showLabel />
          </div>
          <ErrorScreen error={error} t={t} />
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
        <div className='w-full max-w-md space-y-6'>
          <div className='flex justify-center items-center space-x-2'>
            <LanguageSwitcher variant='button' showLabel className='bg-card shadow-theme-sm border border-border' />
            <ThemeSwitcher variant='button' showLabel />
          </div>
          <SuccessScreen t={t} />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
      <div className='absolute top-4 right-4 flex items-center gap-2'>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className='w-full max-w-md space-y-6'>
        <Card>
          <CardHeader className='text-center'>
            <div className='mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4'>
              <Lock className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <CardTitle className='text-2xl font-bold'>{t('auth.resetPassword.title')}</CardTitle>
            <CardDescription>{t('auth.resetPassword.description')}</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className='mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <div className='flex items-center gap-2 text-red-700 dark:text-red-300'>
                  <AlertCircle className='w-4 h-4' />
                  <span className='text-sm'>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='newPassword'>{t('auth.resetPassword.newPasswordLabel')}</Label>
                <div className='relative'>
                  <Input
                    id='newPassword'
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                    {...register('newPassword')}
                    className={errors.newPassword ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={isLoading}
                  >
                    {showPasswords.new ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </Button>
                </div>
                {errors.newPassword && <p className='text-sm text-destructive'>{errors.newPassword.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>{t('auth.resetPassword.confirmPasswordLabel')}</Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword.message}</p>}
              </div>

              <div className='bg-muted/50 p-3 rounded-md'>
                <h4 className='text-sm font-medium mb-2'>{t('auth.resetPassword.requirements.title')}</h4>
                <ul className='text-xs text-muted-foreground space-y-1'>
                  <li>• {t('auth.resetPassword.requirements.minLength')}</li>
                  <li>• {t('auth.resetPassword.requirements.hasLetter')}</li>
                  <li>• {t('auth.resetPassword.requirements.hasNumber')}</li>
                </ul>
              </div>

              <Button type='submit' className='w-full' disabled={isLoading} size='lg'>
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    {t('auth.resetPassword.resetting')}
                  </div>
                ) : (
                  <>
                    <Lock className='w-4 h-4 mr-2' />
                    {t('auth.resetPassword.resetButton')}
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
                {t('auth.resetPassword.backToLogin')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
