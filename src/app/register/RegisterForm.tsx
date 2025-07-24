'use client'

import { useRouter } from 'next/navigation'

import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react'

import { useLocale } from '@/hooks/useLocale'

import TermsModal from '@/components/ui/register/TermsModal'
import PrivacyModal from '@/components/ui/register/PrivacyModal'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import AuthApiService from '@/lib/services/authApiService'

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreements?: string
}

const RegisterForm = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { isReady } = useLocale()

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ad soyad gereklidir'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Ad soyad en az 2 karakter olmalıdır'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi gereklidir'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      newErrors.agreements = 'Kullanım şartları ve gizlilik politikasını kabul etmelisiniz'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await AuthApiService.registerUser({
        name: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      })

      if (!response.success) {
        throw new Error(response.message || 'Kayıt işlemi başarısız')
      }

      console.log('Registration successful:', response.data)
      alert(t('auth.register.success'))
      router.push('/login?registered=true')
    } catch (error) {
      console.error('Registration error:', error)
      alert(t('auth.register.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleTermsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowTermsModal(true)
  }

  const handlePrivacyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowPrivacyModal(true)
  }

  const handleLoginRedirect = () => {
    router.push('/login')
  }

  if (!isReady) {
    return <LoadingSpinner />
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-200'>
      <div className='w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden'>
        <div className='p-8'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4'>
              <UserPlus className='w-8 h-8 text-primary' />
            </div>
            <h1 className='text-2xl font-bold text-foreground mb-2'>{t('auth.register.title')}</h1>
            <p className='text-muted-foreground'>{t('auth.register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label htmlFor='fullName' className='block text-sm font-medium text-foreground mb-2'>
                {t('auth.register.fullName')}
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <input
                  type='text'
                  id='fullName'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50 ${
                    errors.fullName ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder={t('auth.register.fullNamePlaceholder')}
                  autoComplete='name'
                />
              </div>
              {errors.fullName && <p className='mt-2 text-sm text-red-600'>{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
                {t('auth.register.email')}
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50 ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder={t('auth.register.emailPlaceholder')}
                  autoComplete='email'
                />
              </div>
              {errors.email && <p className='mt-2 text-sm text-red-600'>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-foreground mb-2'>
                {t('auth.register.password')}
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50 ${
                    errors.password ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  autoComplete='new-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              {errors.password && <p className='mt-2 text-sm text-red-600'>{errors.password}</p>}
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-foreground mb-2'>
                {t('auth.register.confirmPassword')}
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  autoComplete='new-password'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              {errors.confirmPassword && <p className='mt-2 text-sm text-red-600'>{errors.confirmPassword}</p>}
            </div>

            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <input
                  type='checkbox'
                  id='terms-agreement'
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={isLoading}
                  className='mt-1 w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50 focus:ring-1 focus:ring-inset disabled:opacity-50'
                />
                <label htmlFor='terms-agreement' className='text-sm text-muted-foreground leading-relaxed'>
                  {t('auth.register.agreements.terms.prefix')}{' '}
                  <button
                    type='button'
                    onClick={handleTermsClick}
                    className='text-primary hover:text-primary/80 underline font-medium transition-colors'
                  >
                    {t('auth.register.agreements.terms.linkText')}
                  </button>{' '}
                  {t('auth.register.agreements.terms.suffix')}
                </label>
              </div>

              <div className='flex items-start gap-3'>
                <input
                  type='checkbox'
                  id='privacy-agreement'
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  disabled={isLoading}
                  className='mt-1 w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50 focus:ring-1 focus:ring-inset disabled:opacity-50'
                />
                <label htmlFor='privacy-agreement' className='text-sm text-muted-foreground leading-relaxed'>
                  {t('auth.register.agreements.privacy.prefix')}{' '}
                  <button
                    type='button'
                    onClick={handlePrivacyClick}
                    className='text-primary hover:text-primary/80 underline font-medium transition-colors'
                  >
                    {t('auth.register.agreements.privacy.linkText')}
                  </button>{' '}
                  {t('auth.register.agreements.privacy.suffix')}
                </label>
              </div>

              {errors.agreements && <p className='text-sm text-red-600'>{errors.agreements}</p>}

              <div className='bg-muted/30 rounded-lg p-3 border border-border'>
                <p className='text-xs text-muted-foreground'>{t('auth.register.agreements.note')}</p>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading || !agreedToTerms || !agreedToPrivacy}
              className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 focus:ring-1 focus:ring-primary/50 focus:ring-inset transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <div className='w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
                  {t('auth.register.loading')}
                </>
              ) : (
                <>
                  <UserPlus className='w-4 h-4' />
                  {t('auth.register.submitButton')}
                </>
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('auth.register.alreadyHaveAccount')}{' '}
              <button
                type='button'
                onClick={handleLoginRedirect}
                className='text-primary hover:text-primary/80 font-medium transition-colors'
              >
                {t('auth.register.loginLink')}
              </button>
            </p>
          </div>
        </div>

        <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
        <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      </div>
    </div>
  )
}

export default RegisterForm
