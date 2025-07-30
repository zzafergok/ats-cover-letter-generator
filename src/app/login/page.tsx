/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useAuth } from '@/providers/AuthProvider'

import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ThemeSwitcher } from '@/components/ui/theme/theme-switcher'
import { LanguageSwitcher } from '@/components/ui/language/language-switcher'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { SessionTokenManager } from '@/lib/services/sessionTokenManager'

const LoginContent: React.FC = () => {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const savedRememberMe = SessionTokenManager.getRememberMeStatus()
    const rememberedEmail = SessionTokenManager.getRememberedEmail()
    const timeLeft = SessionTokenManager.getRememberMeTimeLeft()

    if (savedRememberMe && rememberedEmail) {
      setRememberMe(true)
      setEmail(rememberedEmail)
      console.log('💾 Remember me and email loaded from storage:', rememberedEmail, `(${timeLeft}h remaining)`)
    } else if (savedRememberMe) {
      setRememberMe(true)
      console.log('💾 Remember me status loaded from storage', `(${timeLeft}h remaining)`)
    }

    // Development modunda debug bilgisi göster
    if (process.env.NODE_ENV === 'development' && savedRememberMe) {
      console.log('🐛 Debug - Remember Me Status:', {
        isValid: savedRememberMe,
        email: rememberedEmail,
        hoursLeft: timeLeft,
        willExpireAt: new Date(Date.now() + timeLeft * 60 * 60 * 1000).toLocaleString(),
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError(t('auth.login.validation.emailRequired'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Login fonksiyonuna remember me durumunu da gönder
      await login(email, password, rememberMe)
      console.log('✅ Login successful, checking redirect URL')

      if (process.env.NODE_ENV === 'development') {
        SessionTokenManager.debugInfo()
      }

      // Check for saved redirect URL
      const redirectUrl = sessionStorage.getItem('auth_redirect_url')
      if (redirectUrl) {
        console.log('🔄 Redirecting to saved URL:', redirectUrl)
        sessionStorage.removeItem('auth_redirect_url')
        router.replace(redirectUrl)
      } else {
        console.log('🔄 No redirect URL, going to dashboard')
        router.replace('/dashboard')
      }
    } catch (err: any) {
      console.error('❌ Login error:', err)
      const errorMessage = err.message || t('auth.login.validation.loginError')
      setError(errorMessage)
      SessionTokenManager.clearTokens()
    } finally {
      setIsLoading(false)
    }
  }

  // Remember me checkbox change handler - email temizleme kontrolü eklendi
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setRememberMe(checked)

    // Eğer remember me devre dışı bırakılırsa kaydedilmiş email'i temizle
    if (!checked) {
      SessionTokenManager.clearRememberMe()
      console.log('🔄 Remember me disabled, cleared saved email')
    }

    console.log(`🔄 Remember me ${checked ? 'enabled' : 'disabled'}`)
  }

  // Email input change handler - manuel değişiklik durumunda remember me'yi güncelle
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    // Eğer email değiştirilirse ve remember me aktifse, yeni email'i kaydet
    if (rememberMe && newEmail) {
      console.log('🔄 Email changed while remember me is active:', newEmail)
    }
  }

  const fillDemoAccount = (type: 'ahmet' | 'admin' | 'mehmet') => {
    const demoAccounts = {
      ahmet: { email: 'ahmet.yilmaz@test.com', password: 'test123456' },
      admin: { email: 'admin@atscv.com', password: 'test123456' },
      mehmet: { email: 'mehmet.demir@test.com', password: 'test123456' },
    }

    const account = demoAccounts[type]
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Language & Theme Switchers */}
        <div className='flex justify-center items-center space-x-2'>
          <LanguageSwitcher variant='button' showLabel className='bg-card shadow-theme-sm border border-border' />
          <ThemeSwitcher variant='button' showLabel />
        </div>

        <Card className='w-full bg-card border-border shadow-theme-lg'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold text-foreground'>{t('auth.login.title')}</CardTitle>
            <CardDescription className='text-muted-foreground'>{t('auth.login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {error && <div className='error-state text-sm'>{error}</div>}

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
                  {t('auth.login.email.label')}
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  placeholder={t('auth.login.email.placeholder')}
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className='theme-transition-colors'
                />
              </div>

              <div>
                <label htmlFor='password' className='block text-sm font-medium text-foreground mb-2'>
                  {t('auth.login.password.label')}
                </label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  placeholder={t('auth.login.password.placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className='theme-transition-colors'
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='rememberMe'
                    name='rememberMe'
                    type='checkbox'
                    className='h-4 w-4 text-primary focus:ring-primary border-border rounded bg-background'
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    disabled={isLoading}
                  />
                  <label htmlFor='rememberMe' className='ml-2 block text-sm text-foreground'>
                    {t('auth.login.rememberMe')}
                  </label>
                </div>

                <Link href='/forgot-password' className='text-sm text-primary hover:text-primary/80 transition-colors'>
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>

              <Button type='submit' className='w-full theme-transition-colors' disabled={isLoading} size='lg'>
                {isLoading ? (
                  <div className='flex items-center justify-center space-x-2'>
                    <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin'></div>
                    <span>{t('auth.login.loggingIn')}</span>
                  </div>
                ) : (
                  t('auth.login.loginButton')
                )}
              </Button>

              {/* Demo Accounts */}
              <div className='space-y-3'>
                <div className='text-center'>
                  <span className='text-sm text-muted-foreground'>{t('auth.login.demoAccounts.title')}</span>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => fillDemoAccount('ahmet')}
                    disabled={isLoading}
                    className='text-xs theme-transition-colors'
                  >
                    {t('auth.login.demoAccounts.ortak')}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => fillDemoAccount('admin')}
                    disabled={isLoading}
                    className='text-xs theme-transition-colors'
                  >
                    {t('auth.login.demoAccounts.zafer')}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => fillDemoAccount('mehmet')}
                    disabled={isLoading}
                    className='text-xs theme-transition-colors'
                  >
                    {t('auth.login.demoAccounts.akin')}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            {t('auth.register.haveAccount')}{' '}
            <Link href='/register' className='text-primary hover:text-primary/80 transition-colors'>
              {t('auth.register.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginContent />
    </ProtectedRoute>
  )
}
