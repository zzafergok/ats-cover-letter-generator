'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React, { useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

import { useForm } from '@/hooks/useForm'

import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Checkbox } from '@/components/core/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { loginSchema, LoginFormValues } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>
  redirectOnSuccess?: string
  variant?: 'default' | 'card' | 'minimal'
  showRememberMe?: boolean
  showForgotPassword?: boolean
  showRegisterLink?: boolean
  className?: string
}

const DEMO_ACCOUNTS = [
  {
    type: 'Admin Kullanıcı',
    email: 'admin@example.com',
    password: 'Admin123!',
    description: 'Tam yetki',
  },
  {
    type: 'Standart Kullanıcı',
    email: 'user@example.com',
    password: 'User123!',
    description: 'Sınırlı yetki',
  },
  {
    type: 'Demo Kullanıcı',
    email: 'demo@example.com',
    password: 'Demo123!',
    description: 'Test hesabı',
  },
]

export function LoginForm({
  onSubmit,
  redirectOnSuccess = '/dashboard',
  variant = 'default',
  showRememberMe = true,
  showForgotPassword = true,
  showRegisterLink = true,
  className,
}: LoginFormProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    setValue,
  } = useForm(loginSchema, {
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const handleFormSubmit = async (data: LoginFormValues) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await onSubmit(data)

      // Başarılı giriş durumunda yönlendirme
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess)
      }
    } catch (error: any) {
      console.error('Login error:', error)

      // Form hatası gösterimi
      if (error?.message) {
        setError('root', { message: error.message })
      } else {
        setError('root', { message: t('auth.loginFailed') })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoAccount = useCallback(
    (account: (typeof DEMO_ACCOUNTS)[0]) => {
      console.log('Filling demo account:', account.email)

      // setValue kullanarak değerleri set et ve validasyonu tetikle
      setValue('email', account.email, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      })
      setValue('password', account.password, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      })
    },
    [setValue],
  )

  const FormContent = () => (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* Email Field */}
      <div className='space-y-2'>
        <label
          htmlFor='email'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-900 dark:text-neutral-100'
        >
          {t('auth.email')}
          <span className='text-red-500 dark:text-red-400 ml-1'>*</span>
        </label>
        <Input
          {...register('email')}
          id='email'
          type='email'
          placeholder='ornek@email.com'
          startIcon={<Mail className='h-4 w-4' />}
          error={errors.email?.message}
          className='transition-colors'
        />
      </div>

      {/* Password Field */}
      <div className='space-y-2'>
        <label
          htmlFor='password'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-900 dark:text-neutral-100'
        >
          {t('auth.password')}
          <span className='text-red-500 dark:text-red-400 ml-1'>*</span>
        </label>
        <Input
          {...register('password')}
          id='password'
          type={showPassword ? 'text' : 'password'}
          placeholder='••••••••'
          startIcon={<Lock className='h-4 w-4' />}
          endIcon={
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none'
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          }
          error={errors.password?.message}
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className='flex items-center justify-between'>
        {showRememberMe && (
          <div className='flex items-center space-x-2'>
            <Checkbox {...register('rememberMe')} id='rememberMe' />
            <label
              htmlFor='rememberMe'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-700 dark:text-neutral-300'
            >
              {t('auth.rememberMe')}
            </label>
          </div>
        )}

        {showForgotPassword && (
          <Link
            href='/auth/forgot-password'
            className='text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'
          >
            {t('auth.forgotPassword')}
          </Link>
        )}
      </div>

      {/* Form Error */}
      {errors.root && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'>
          {errors.root.message}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
        className='w-full transition-all'
      >
        {isSubmitting ? t('common.pleaseWait') : t('auth.login')}
      </Button>

      {/* Register Link */}
      {showRegisterLink && (
        <div className='text-center'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            {t('auth.dontHaveAccount')}{' '}
            <Link
              href='/auth/register'
              className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors'
            >
              {t('auth.signUpHere')}
            </Link>
          </p>
        </div>
      )}
    </form>
  )

  if (variant === 'card') {
    return (
      <div
        className={`flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900 ${className}`}
      >
        <Card className='w-full max-w-md'>
          <CardHeader className='space-y-1 text-center'>
            <CardTitle className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>
              {t('auth.welcomeBack')}
            </CardTitle>
            <CardDescription className='text-neutral-600 dark:text-neutral-400'>
              {t('auth.pleaseLogin')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormContent />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={`w-full max-w-sm mx-auto ${className}`}>
        <FormContent />
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900 ${className}`}
    >
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100'>{t('auth.welcomeBack')}</h2>
          <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400'>{t('auth.pleaseLogin')}</p>
        </div>
        <Card className='bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 w-full md:p-8'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-blue-800 dark:text-blue-200'>Demo Hesapları (Development)</CardTitle>
            <CardDescription className='text-blue-600 dark:text-blue-300'>
              Devam etmek için lütfen giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                  'hover:bg-blue-100 dark:hover:bg-blue-900/30',
                  'border-blue-200 dark:border-blue-700',
                  'bg-blue-25 dark:bg-blue-950/10',
                )}
                onClick={() => fillDemoAccount(account)}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-medium text-blue-900 dark:text-blue-100'>{account.type}</p>
                    <p className='text-sm text-blue-700 dark:text-blue-300'>{account.email}</p>
                    <p className='text-xs text-blue-600 dark:text-blue-400 mt-1'>Şifre: {account.password}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className='bg-white dark:bg-neutral-800 py-8 px-6 shadow-lg rounded-lg border border-neutral-200 dark:border-neutral-700'>
          <FormContent />
        </div>
      </div>
    </div>
  )
}
