'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { ArrowLeft, Github, Linkedin, LogIn, Mail, Send, User } from 'lucide-react'

import { contactApi } from '@/lib/api/api'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const ContactPageContent = () => {
  const router = useRouter()
  const { t, i18n } = useTranslation()

  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const contactData = {
        type: 'CONTACT' as const,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }

      const result = await contactApi.send(contactData)

      if (result.success) {
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error(result.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Contact form error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'gok.zaferr@gmail.com',
      href: 'mailto:gok.zaferr@gmail.com',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/zafergok',
      href: 'https://www.linkedin.com/in/zafergok/',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/zzafergok',
      href: 'https://github.com/zzafergok',
    },
  ]

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

            <User className='w-16 h-16 mx-auto mb-4 opacity-90' />
            <h1 className='text-3xl font-bold mb-2'>İletişim</h1>
            <p className='opacity-90'>Bizimle iletişime geçin</p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 p-8'>
            <div className='space-y-6'>
              <h2 className='text-xl font-semibold text-foreground mb-6'>İletişim Bilgileri</h2>

              <div className='space-y-4'>
                {contactLinks.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={contact.label !== 'Email' ? '_blank' : undefined}
                    rel={contact.label !== 'Email' ? 'noopener noreferrer' : undefined}
                    className='flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 group bg-card'
                  >
                    <div className='p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors'>
                      <contact.icon className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                      <div className='font-medium text-foreground'>{contact.label}</div>
                      <div className='text-sm text-muted-foreground'>{contact.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className='space-y-6'>
              <h2 className='text-xl font-semibold text-foreground mb-6'>Mesaj Gönder</h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>Ad Soyad</label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
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
                      value={formData.email}
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
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                    placeholder='Mesajınızın konusu'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>Mesaj</label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    rows={5}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all resize-none bg-background text-foreground disabled:opacity-50'
                    placeholder='Mesajınızı buraya yazın...'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 focus:ring-1 focus:ring-primary/50 focus:ring-inset transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Send className='w-4 h-4' />
                  {isLoading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            </div>
          </div>

          <div className='bg-muted px-8 py-4 text-center text-sm text-muted-foreground border-t border-border'>
            <p>Tüm mesajlar gizli tutulur ve sadece gerekli kişilerle paylaşılır.</p>
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

          <User className='w-16 h-16 mx-auto mb-4 opacity-90' />
          <h1 className='text-3xl font-bold mb-2'>{t('pages.contact.title')}</h1>
          <p className='opacity-90'>{t('pages.contact.subtitle')}</p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 p-8'>
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-foreground mb-6'>{t('pages.contact.contactInfo')}</h2>

            <div className='space-y-4'>
              {contactLinks.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.label !== 'Email' ? '_blank' : undefined}
                  rel={contact.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className='flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 group bg-card'
                >
                  <div className='p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors'>
                    <contact.icon className='w-5 h-5 text-primary' />
                  </div>
                  <div>
                    <div className='font-medium text-foreground'>{contact.label}</div>
                    <div className='text-sm text-muted-foreground'>{contact.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-foreground mb-6'>{t('pages.contact.sendButton')}</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.contact.name')}</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                    placeholder={t('pages.contact.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.contact.email')}</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                    placeholder={t('pages.contact.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.contact.subject')}</label>
                <input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all bg-background text-foreground disabled:opacity-50'
                  placeholder={t('pages.contact.subjectPlaceholder')}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>{t('pages.contact.message')}</label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  rows={5}
                  className='w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:ring-inset focus:border-transparent transition-all resize-none bg-background text-foreground disabled:opacity-50'
                  placeholder={t('pages.contact.messagePlaceholder')}
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 focus:ring-1 focus:ring-primary/50 focus:ring-inset transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Send className='w-4 h-4' />
                {isLoading ? t('pages.contact.loading') : t('pages.contact.sendButton')}
              </button>
            </form>
          </div>
        </div>

        <div className='bg-muted px-8 py-4 text-center text-sm text-muted-foreground border-t border-border'>
          <p>{t('pages.contact.privacy')}</p>
        </div>
      </div>
    </div>
  )
}

// NoSSR wrapper kullanarak hydration sorununu çöz
const ContactPage = dynamic(() => Promise.resolve(ContactPageContent), {
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

export default ContactPage
