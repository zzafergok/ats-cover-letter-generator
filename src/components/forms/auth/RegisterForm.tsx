'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, User, Lock, ArrowLeft, Sparkles } from 'lucide-react'

import { useForm } from '@/hooks/useForm'
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Checkbox } from '@/components/core/checkbox'
import { Label } from '@/components/core/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/core/card'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { useAppDispatch } from '@/store'
import { showToast } from '@/store/slices/toastSlice'

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormValues) => Promise<void>
  redirectOnSuccess?: string
  showLoginLink?: boolean
  variant?: 'default' | 'modal' | 'minimal'
  className?: string
}

export function RegisterForm({
  onSubmit,
  redirectOnSuccess = '/dashboard',
  showLoginLink = true,
  variant = 'default',
  className = '',
}: RegisterFormProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm(registerSchema, {
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: true,
      newsletter: false,
    },
  })

  const handleSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true)

      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Mock registration
        await new Promise((resolve) => setTimeout(resolve, 2000))

        dispatch(
          showToast({
            type: 'success',
            title: t('common.success'),
            message: 'Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.',
            duration: 5000,
          }),
        )

        router.push(redirectOnSuccess)
      }
    } catch (error) {
      console.error('Registration failed:', error)
      dispatch(
        showToast({
          type: 'error',
          title: 'Kayıt Başarısız',
          message: error instanceof Error ? error.message : 'Kayıt işlemi sırasında bir hata oluştu',
          duration: 5000,
        }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const FormContent = () => (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      {/* Name Field */}
      <div className='space-y-2'>
        <Label htmlFor='name' required>
          {t('auth.name', 'Ad Soyad')}
        </Label>
        <Input
          id='name'
          type='text'
          placeholder='Adınızı ve soyadınızı girin'
          startIcon={<User className='h-4 w-4' />}
          error={form.formState.errors.name?.message}
          {...form.register('name')}
          disabled={isSubmitting}
        />
        {form.formState.errors.name && (
          <p className='text-xs text-red-600 dark:text-red-400'>{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className='space-y-2'>
        <Label htmlFor='email' required>
          {t('auth.email')}
        </Label>
        <Input
          id='email'
          type='email'
          placeholder='ornek@email.com'
          startIcon={<Mail className='h-4 w-4' />}
          error={form.formState.errors.email?.message}
          {...form.register('email')}
          disabled={isSubmitting}
        />
        {form.formState.errors.email && (
          <p className='text-xs text-red-600 dark:text-red-400'>{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className='space-y-2'>
        <Label htmlFor='password' required>
          {t('auth.password')}
        </Label>
        <Input
          id='password'
          type={showPassword ? 'text' : 'password'}
          placeholder='En az 8 karakter'
          startIcon={<Lock className='h-4 w-4' />}
          endIcon={
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          }
          error={form.formState.errors.password?.message}
          {...form.register('password')}
          disabled={isSubmitting}
        />
        {form.formState.errors.password && (
          <p className='text-xs text-red-600 dark:text-red-400'>{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className='space-y-2'>
        <Label htmlFor='confirmPassword' required>
          {t('auth.confirmPassword')}
        </Label>
        <Input
          id='confirmPassword'
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder='Şifrenizi tekrar girin'
          startIcon={<Lock className='h-4 w-4' />}
          endIcon={
            <button
              type='button'
              onClick={toggleConfirmPasswordVisibility}
              className='text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            >
              {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          }
          error={form.formState.errors.confirmPassword?.message}
          {...form.register('confirmPassword')}
          disabled={isSubmitting}
        />
        {form.formState.errors.confirmPassword && (
          <p className='text-xs text-red-600 dark:text-red-400'>{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms and Newsletter */}
      <div className='space-y-4'>
        <div className='flex items-start space-x-3'>
          <Checkbox id='terms' {...form.register('terms')} disabled={isSubmitting} />
          <div className='space-y-1'>
            <Label
              htmlFor='terms'
              className={`text-sm leading-5 ${form.formState.errors.terms ? 'text-red-600 dark:text-red-400' : ''}`}
            >
              <Link
                href='/terms'
                className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
              >
                Kullanım Şartları
              </Link>{' '}
              ve{' '}
              <Link
                href='/privacy'
                className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
              >
                Gizlilik Politikası
              </Link>
              &apos;nı kabul ediyorum
            </Label>
            {form.formState.errors.terms && (
              <p className='text-xs text-red-600 dark:text-red-400'>{form.formState.errors.terms.message}</p>
            )}
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <Checkbox id='newsletter' {...form.register('newsletter')} disabled={isSubmitting} />
          <Label htmlFor='newsletter' className='text-sm'>
            E-posta ile güncellemeler ve promosyonlar almak istiyorum
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        className='w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 dark:from-primary-600 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-400 text-white shadow-lg hover:shadow-primary-glow transition-all duration-300'
        disabled={isSubmitting || !form.formState.isValid}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size='sm' className='mr-2' />
            Hesap Oluşturuluyor...
          </>
        ) : (
          <>
            <Sparkles className='h-4 w-4 mr-2' />
            {t('auth.register')}
          </>
        )}
      </Button>

      {/* Login Link */}
      {showLoginLink && (
        <div className='text-center space-y-2'>
          <p className='text-sm text-neutral-600 dark:text-neutral-300'>
            Zaten hesabınız var mı?{' '}
            <Link
              href='/auth/login'
              className='font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      )}
    </form>
  )

  if (variant === 'minimal') {
    return (
      <div className={`w-full max-w-md ${className}`}>
        <FormContent />
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className={`w-full max-w-md space-y-6 ${className}`}>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>Hesap Oluşturun</h2>
          <p className='text-neutral-600 dark:text-neutral-300'>Starkon Template&apos;e hoş geldiniz</p>
        </div>
        <FormContent />
      </div>
    )
  }

  // Default variant - Full page layout
  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className='w-full max-w-md space-y-8'>
        {/* Back Button */}
        <div className='flex justify-start'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push('/')}
            className='flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Ana Sayfaya Dön</span>
          </Button>
        </div>

        {/* Form Card */}
        <Card className='backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-lg'>
          <CardHeader className='text-center space-y-2'>
            <div className='w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-500 rounded-xl flex items-center justify-center mx-auto'>
              <Sparkles className='h-6 w-6 text-white' />
            </div>
            <CardTitle className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>Hesap Oluşturun</CardTitle>
            <CardDescription className='text-neutral-600 dark:text-neutral-300'>
              Starkon Template&apos;e katılın ve modern uygulamalar geliştirmeye başlayın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormContent />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
