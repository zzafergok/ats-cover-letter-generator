'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { HelpCircle, Send, Mail, MessageSquare, ArrowLeft, LogIn } from 'lucide-react'
import { contactApi } from '@/lib/api/api'

interface SupportFormData {
  name: string
  email: string
  subject: string
  message: string
}

const SupportPageContent = () => {
  const router = useRouter()
  const { t, i18n } = useTranslation()

  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [supportForm, setSupportForm] = useState<SupportFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const handleGoToLogin = () => {
    router.push('/login')
  }

  const handleSupportSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supportData = {
        type: 'SUPPORT' as const,
        name: supportForm.name,
        email: supportForm.email,
        subject: supportForm.subject,
        message: supportForm.message,
      }

      const result = await contactApi.send(supportData)
      console.log('🚀 ~ handleSupportSubmit ~ result:', result)

      if (result.success) {
        setSupportForm({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error(result.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Support request error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSupportForm((prev: SupportFormData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!mounted || !i18n.isInitialized) {
    return (
      <div className='min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-200'>
        <div className='w-full max-w-4xl bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden'>
          <div className='bg-primary text-primary-foreground p-8 text-center relative'>
            <div className='absolute top-4 left-4 flex gap-2'>
              <button
                onClick={handleGoBack}
                className='flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors text-sm'
              >
                <ArrowLeft className='w-4 h-4' />
                Önceki
              </button>
            </div>

            <div className='absolute top-4 right-4'>
              <button
                onClick={handleGoToLogin}
                className='flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors text-sm'
              >
                <LogIn className='w-4 h-4' />
                Çıkış Yap
              </button>
            </div>

            <HelpCircle className='w-16 h-16 mx-auto mb-4 opacity-90' />
            <h1 className='text-3xl font-bold mb-2'>Destek</h1>
            <p className='opacity-90'>Size nasıl yardımcı olabiliriz?</p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 p-8'>
            <div className='space-y-6'>
              <div className='flex items-center gap-3 mb-6'>
                <MessageSquare className='w-6 h-6 text-primary' />
                <h2 className='text-xl font-semibold text-foreground'>Destek Talebi Gönder</h2>
              </div>

              <form onSubmit={handleSupportSubmit} className='space-y-4'>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>Ad Soyad</label>
                    <input
                      type='text'
                      name='name'
                      value={supportForm.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                      placeholder='Adınız ve soyadınız'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>E-posta</label>
                    <input
                      type='email'
                      name='email'
                      value={supportForm.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                      placeholder='email@example.com'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>Konu</label>
                  <input
                    type='text'
                    name='subject'
                    value={supportForm.subject}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                    placeholder='Sorunun kısa açıklaması'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>Mesaj</label>
                  <textarea
                    name='message'
                    value={supportForm.message}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    rows={6}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all resize-none bg-background text-foreground disabled:opacity-50'
                    placeholder='Sorununuzu detaylı açıklayın...'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 focus:ring-1 focus:ring-primary/50 focus:ring-inset transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Send className='w-4 h-4' />
                  {isLoading ? 'Gönderiliyor...' : 'Destek Talebi Gönder'}
                </button>
              </form>
            </div>

            <div className='space-y-6'>
              <div className='flex items-center gap-3 mb-6'>
                <Mail className='w-6 h-6 text-primary' />
                <h2 className='text-xl font-semibold text-foreground'>Alternatif İletişim</h2>
              </div>

              <div className='space-y-4'>
                <div className='bg-muted/50 rounded-lg p-6 border border-border'>
                  <h3 className='font-semibold text-foreground mb-3'>Acil durumlar için doğrudan iletişim:</h3>
                  <div className='space-y-3'>
                    <a
                      href='mailto:gok.zaferr@gmail.com'
                      className='flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors'
                    >
                      <Mail className='w-4 h-4' />
                      <span>gok.zaferr@gmail.com</span>
                    </a>
                  </div>
                </div>

                <div className='bg-primary/5 border border-primary/20 rounded-lg p-4'>
                  <p className='text-sm text-foreground'>
                    <strong>💡 İpucu:</strong> Destek talebinizde sorununuzu detaylı açıklarsanız, size daha hızlı
                    yardımcı olabiliriz.
                  </p>
                </div>

                <div className='bg-muted/30 rounded-lg p-4 border border-border'>
                  <p className='text-sm text-muted-foreground'>
                    <strong>📋 Yanıt Süresi:</strong> Genellikle 24 saat içerisinde e-posta ile yanıt veriyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-muted px-8 py-4 text-center text-sm text-muted-foreground border-t border-border'>
            <p>Destek talebiniz gizli tutulur ve sadece teknik ekibimizle paylaşılır.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-200'>
      <div className='w-full max-w-4xl bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden'>
        <div className='bg-primary text-primary-foreground p-8 text-center relative'>
          <div className='absolute top-4 left-4 flex gap-2'>
            <button
              onClick={handleGoBack}
              className='flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors text-sm'
            >
              <ArrowLeft className='w-4 h-4' />
              {t('common.previous')}
            </button>
          </div>

          <div className='absolute top-4 right-4'>
            <button
              onClick={handleGoToLogin}
              className='flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors text-sm'
            >
              <LogIn className='w-4 h-4' />
              {t('navigation.login')}
            </button>
          </div>

          <HelpCircle className='w-16 h-16 mx-auto mb-4 opacity-90' />
          <h1 className='text-3xl font-bold mb-2'>{t('pages.support.title')}</h1>
          <p className='opacity-90'>{t('pages.support.subtitle')}</p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 p-8'>
          <div className='space-y-6'>
            <div className='flex items-center gap-3 mb-6'>
              <MessageSquare className='w-6 h-6 text-primary' />
              <h2 className='text-xl font-semibold text-foreground'>{t('pages.support.sendButton')}</h2>
            </div>

            <form onSubmit={handleSupportSubmit} className='space-y-4'>
              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.support.name')}</label>
                  <input
                    type='text'
                    name='name'
                    value={supportForm.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                    placeholder={t('pages.support.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.support.email')}</label>
                  <input
                    type='email'
                    name='email'
                    value={supportForm.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                    placeholder={t('pages.support.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.support.subject')}</label>
                <input
                  type='text'
                  name='subject'
                  value={supportForm.subject}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                  placeholder={t('pages.support.subjectPlaceholder')}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.support.message')}</label>
                <textarea
                  name='message'
                  value={supportForm.message}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  rows={6}
                  className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all resize-none bg-background text-foreground disabled:opacity-50'
                  placeholder={t('pages.support.messagePlaceholder')}
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 focus:ring-1 focus:ring-primary/50 focus:ring-inset transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Send className='w-4 h-4' />
                {isLoading ? t('pages.support.loading') : t('pages.support.sendButton')}
              </button>
            </form>
          </div>

          <div className='space-y-6'>
            <div className='flex items-center gap-3 mb-6'>
              <Mail className='w-6 h-6 text-primary' />
              <h2 className='text-xl font-semibold text-foreground'>{t('pages.support.contactInfo')}</h2>
            </div>

            <div className='space-y-4'>
              <div className='bg-muted/50 rounded-lg p-6 border border-border'>
                <h3 className='font-semibold text-foreground mb-3'>{t('pages.support.directContact')}</h3>
                <div className='space-y-3'>
                  <a
                    href='mailto:gok.zaferr@gmail.com'
                    className='flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors'
                  >
                    <Mail className='w-4 h-4' />
                    <span>gok.zaferr@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className='bg-primary/5 border border-primary/20 rounded-lg p-4'>
                <p className='text-sm text-foreground'>
                  <strong>💡 İpucu:</strong> {t('pages.support.tip')}
                </p>
              </div>

              <div className='bg-muted/30 rounded-lg p-4 border border-border'>
                <p className='text-sm text-muted-foreground'>
                  <strong>📋 Yanıt Süresi:</strong> {t('pages.support.responseTime')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-muted px-8 py-4 text-center text-sm text-muted-foreground border-t border-border'>
          <p>{t('pages.support.privacy')}</p>
        </div>
      </div>
    </div>
  )
}

// NoSSR wrapper kullanarak hydration sorununu çöz
const SupportPage = dynamic(() => Promise.resolve(SupportPageContent), {
  ssr: false,
  loading: () => (
    <div className='min-h-screen bg-background text-foreground flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden animate-pulse'>
        <div className='bg-primary/20 h-32'></div>
        <div className='p-8 space-y-4'>
          <div className='h-4 bg-muted rounded w-1/4'></div>
          <div className='h-4 bg-muted rounded w-3/4'></div>
          <div className='h-4 bg-muted rounded w-1/2'></div>
        </div>
      </div>
    </div>
  ),
})

export default SupportPage
