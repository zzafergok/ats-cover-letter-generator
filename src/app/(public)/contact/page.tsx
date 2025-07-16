'use client'

import React, { useState } from 'react'

import {
  Mail,
  Send,
  Globe,
  Phone,
  Clock,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  CheckCircle,
  MessageCircle,
} from 'lucide-react'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/core/Input/Input'
import { Label } from '@/components/core/Label/Label'
import { Badge } from '@/components/core/Badge/Badge'
import { Button } from '@/components/core/Button/Button'
import { Textarea } from '@/components/core/Textarea/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/Card/Card'

import { useForm } from '@/hooks/useForm'

const contactSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  subject: z.string().min(5, 'Konu en az 5 karakter olmalıdır'),
  message: z.string().min(20, 'Mesaj en az 20 karakter olmalıdır'),
  company: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  const { t } = useTranslation()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm(contactSchema, {
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      company: '',
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Contact form submitted:', data)
      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'E-posta',
      value: 'hello@seauikit.com',
      description: '24 saat içinde yanıtlıyoruz',
    },
    {
      icon: Phone,
      label: 'Telefon',
      value: '+90 (555) 123 45 67',
      description: 'Pazartesi - Cuma, 09:00 - 18:00',
    },
    {
      icon: MapPin,
      label: 'Adres',
      value: 'İstanbul, Türkiye',
      description: 'Remote-first çalışma modelimiz var',
    },
    {
      icon: Clock,
      label: 'Çalışma Saatleri',
      value: '09:00 - 18:00',
      description: 'GMT+3 Türkiye saati',
    },
  ]

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/seauikit' },
    { icon: Github, label: 'GitHub', url: 'https://github.com/zzafergok/sea-ui-kit' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/seauikit' },
    { icon: Globe, label: 'Website', url: 'https://seauikit.com' },
  ]

  const faqItems = [
    {
      question: 'Starkon Template ücretsiz mi?',
      answer: 'Evet, Starkon Template tamamen ücretsiz ve açık kaynak kodludur. MIT lisansı altında kullanabilirsiniz.',
    },
    {
      question: 'Teknik destek sağlıyor musunuz?',
      answer: 'GitHub üzerinden community desteği sağlıyoruz. Enterprise destek için iletişime geçebilirsiniz.',
    },
    {
      question: 'Özel projeler için yardım alabilir miyim?',
      answer: 'Evet, özel proje danışmanlığı ve geliştirme hizmetleri sunuyoruz. Detaylar için iletişime geçin.',
    },
  ]

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md text-center'>
          <CardContent className='p-8'>
            <div className='w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='h-8 w-8 text-green-600 dark:text-green-400' />
            </div>
            <h2 className='text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>Mesajınız İletildi!</h2>
            <p className='text-neutral-600 dark:text-neutral-300 mb-6'>
              En kısa sürede size geri dönüş yapacağız. Sabırlı olduğunuz için teşekkürler.
            </p>
            <Button onClick={() => setIsSubmitted(false)} className='w-full'>
              Yeni Mesaj Gönder
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-900'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-white via-primary-50 to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-800 py-24'>
        <div className='absolute inset-0 bg-grid-neutral-200/20 dark:bg-grid-neutral-700/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.2))]' />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
              <span className='text-gradient bg-gradient-to-r from-primary-600 via-blue-500 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:via-blue-300 dark:to-accent-400'>
                {t('pages.contact.title')}
              </span>
            </h1>
            <p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçin. Size yardımcı
              olmaktan mutluluk duyarız.
            </p>
            <Badge variant='default' size='lg' className='px-6 py-2'>
              <MessageCircle className='h-4 w-4 mr-2' />
              Genellikle 24 saat içinde yanıtlıyoruz
            </Badge>
          </div>
        </div>
      </section>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <Card className='border-neutral-200 dark:border-neutral-700'>
              <CardHeader>
                <CardTitle className='text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center'>
                  <Send className='h-6 w-6 mr-3 text-primary-600 dark:text-primary-400' />
                  Bize Mesaj Gönderin
                </CardTitle>
                <p className='text-neutral-600 dark:text-neutral-300'>
                  Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz.
                </p>
              </CardHeader>
              <CardContent className='space-y-6'>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' required>
                        Ad Soyad
                      </Label>
                      <Input
                        id='name'
                        placeholder='Adınızı ve soyadınızı girin'
                        {...form.register('name')}
                        error={form.formState.errors.name?.message}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email' required>
                        E-posta
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='ornek@email.com'
                        startIcon={<Mail className='h-4 w-4' />}
                        {...form.register('email')}
                        error={form.formState.errors.email?.message}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='company'>Şirket (Opsiyonel)</Label>
                    <Input id='company' placeholder='Şirket adınız' {...form.register('company')} />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject' required>
                      Konu
                    </Label>
                    <Input
                      id='subject'
                      placeholder='Mesajınızın konusu'
                      {...form.register('subject')}
                      error={form.formState.errors.subject?.message}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message' required>
                      Mesaj
                    </Label>
                    <Textarea
                      id='message'
                      placeholder='Mesajınızı detaylı olarak yazın...'
                      rows={6}
                      {...form.register('message')}
                      error={form.formState.errors.message?.message}
                    />
                  </div>

                  <Button type='submit' className='w-full' disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className='h-4 w-4 mr-2' />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className='space-y-8'>
            {/* Contact Information */}
            <Card className='border-neutral-200 dark:border-neutral-700'>
              <CardHeader>
                <CardTitle className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>
                  İletişim Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div key={index} className='flex items-start space-x-4'>
                      <div className='w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <Icon className='h-5 w-5 text-primary-600 dark:text-primary-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>{info.label}</h3>
                        <p className='text-sm text-neutral-900 dark:text-neutral-100 font-medium'>{info.value}</p>
                        <p className='text-xs text-neutral-600 dark:text-neutral-400 mt-1'>{info.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className='border-neutral-200 dark:border-neutral-700'>
              <CardHeader>
                <CardTitle className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>Sosyal Medya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group'
                      >
                        <Icon className='h-5 w-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors' />
                        <span className='ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                          {social.label}
                        </span>
                      </a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className='border-neutral-200 dark:border-neutral-700'>
              <CardHeader>
                <CardTitle className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>
                  Sık Sorulan Sorular
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {faqItems.map((faq, index) => (
                  <div
                    key={index}
                    className='border-b border-neutral-200 dark:border-neutral-700 last:border-0 pb-4 last:pb-0'
                  >
                    <h4 className='text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2'>{faq.question}</h4>
                    <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Alternative Contact Methods */}
      <section className='py-16 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>Diğer İletişim Yolları</h2>
            <p className='text-lg text-neutral-600 dark:text-neutral-300'>
              Size en uygun iletişim kanalını seçebilirsiniz
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className='text-center hover:shadow-lg dark:hover:shadow-xl transition-all duration-300'>
              <CardContent className='p-8'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Github className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                </div>
                <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3'>GitHub Issues</h3>
                <p className='text-neutral-600 dark:text-neutral-300 mb-6'>
                  Bug raporları ve özellik istekleri için GitHub kullanın
                </p>
                <Button variant='outline' className='w-full'>
                  GitHub&apos;da Aç
                </Button>
              </CardContent>
            </Card>

            <Card className='text-center hover:shadow-lg dark:hover:shadow-xl transition-all duration-300'>
              <CardContent className='p-8'>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <MessageCircle className='h-8 w-8 text-purple-600 dark:text-purple-400' />
                </div>
                <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3'>Discord Community</h3>
                <p className='text-neutral-600 dark:text-neutral-300 mb-6'>
                  Toplulukla sohbet edin ve anlık yardım alın
                </p>
                <Button variant='outline' className='w-full'>
                  Discord&apos;a Katıl
                </Button>
              </CardContent>
            </Card>

            <Card className='text-center hover:shadow-lg dark:hover:shadow-xl transition-all duration-300'>
              <CardContent className='p-8'>
                <div className='w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Phone className='h-8 w-8 text-green-600 dark:text-green-400' />
                </div>
                <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3'>Telefon Görüşmesi</h3>
                <p className='text-neutral-600 dark:text-neutral-300 mb-6'>
                  Karmaşık projeler için telefon görüşmesi planlayın
                </p>
                <Button variant='outline' className='w-full'>
                  Randevu Al
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
