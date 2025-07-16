'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'

import { useForm } from '@/hooks/useForm'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth'
import { Button } from '@/components/core/Button/Button'
import { Input } from '@/components/core/Input/Input'
import { Label } from '@/components/core/Label/Label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/core/Card/Card'
import { LoadingSpinner } from '@/components/core/Loading/LoadingSpinner'
import { useAppDispatch } from '@/store'
import { showToast } from '@/store/slices/toastSlice'

interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordFormValues) => Promise<void>
  variant?: 'default' | 'modal' | 'minimal'
  showBackLink?: boolean
  className?: string
}

export function ForgotPasswordForm({
  onSubmit,
  variant = 'default',
  showBackLink = true,
  className = '',
}: ForgotPasswordFormProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')

  const form = useForm(forgotPasswordSchema, {
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true)
      setEmailAddress(data.email)

      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Mock forgot password request
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      setIsEmailSent(true)

      dispatch(
        showToast({
          type: 'success',
          title: 'E-posta Gönderildi',
          message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
          duration: 5000,
        }),
      )
    } catch (error) {
      console.error('Forgot password failed:', error)
      dispatch(
        showToast({
          type: 'error',
          title: 'İşlem Başarısız',
          message: error instanceof Error ? error.message : 'Şifre sıfırlama isteği gönderilemedi',
          duration: 5000,
        }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendEmail = async () => {
    if (emailAddress) {
      await handleSubmit({ email: emailAddress })
    }
  }

  const SuccessContent = () => (
    <div className='text-center space-y-6'>
      <div className='w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto'>
        <CheckCircle className='h-8 w-8 text-green-600 dark:text-green-400' />
      </div>

      <div className='space-y-2'>
        <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>E-posta Gönderildi</h3>
        <p className='text-neutral-600 dark:text-neutral-300'>
          Şifre sıfırlama bağlantısı{' '}
          <span className='font-medium text-neutral-900 dark:text-neutral-100'>{emailAddress}</span> adresine
          gönderildi.
        </p>
        <p className='text-sm text-neutral-500 dark:text-neutral-400'>
          E-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
        </p>
      </div>

      <div className='space-y-4'>
        <Button onClick={handleResendEmail} variant='outline' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size='sm' className='mr-2' />
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className='h-4 w-4 mr-2' />
              Tekrar Gönder
            </>
          )}
        </Button>

        <Button onClick={() => router.push('/auth/login')} variant='ghost' className='w-full'>
          Giriş Sayfasına Dön
        </Button>
      </div>
    </div>
  )

  const FormContent = () => {
    if (isEmailSent) {
      return <SuccessContent />
    }

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <div className='text-center space-y-2'>
            <p className='text-sm text-neutral-600 dark:text-neutral-300'>
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>
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
              autoFocus
            />
            {form.formState.errors.email && (
              <p className='text-xs text-red-600 dark:text-red-400'>{form.formState.errors.email.message}</p>
            )}
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
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className='h-4 w-4 mr-2' />
              Sıfırlama Bağlantısı Gönder
            </>
          )}
        </Button>

        {/* Back to Login */}
        <div className='text-center'>
          <Link
            href='/auth/login'
            className='text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </form>
    )
  }

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
          <h2 className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>Şifremi Unuttum</h2>
          <p className='text-neutral-600 dark:text-neutral-300'>Şifrenizi sıfırlamak için e-posta adresinizi girin</p>
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
        {showBackLink && (
          <div className='flex justify-start'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/auth/login')}
              className='flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>Giriş Sayfasına Dön</span>
            </Button>
          </div>
        )}

        {/* Form Card */}
        <Card className='backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-lg'>
          <CardHeader className='text-center space-y-2'>
            <div className='w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-500 rounded-xl flex items-center justify-center mx-auto'>
              <Mail className='h-6 w-6 text-white' />
            </div>
            <CardTitle className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>Şifremi Unuttum</CardTitle>
            <CardDescription className='text-neutral-600 dark:text-neutral-300'>
              Hesabınıza erişim sağlamak için şifrenizi sıfırlayın
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
