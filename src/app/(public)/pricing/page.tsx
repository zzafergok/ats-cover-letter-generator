'use client'

import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Check, X, Star, Zap, Shield, Users, Rocket, Crown, Heart, Headphones, Clock, CheckCircle } from 'lucide-react'

import { Badge } from '@/components/core/Badge/Badge'
import { Button } from '@/components/core/Button/Button'
import { Switch } from '@/components/core/Switch/Switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/Card/Card'

export default function PricingPage() {
  const { t } = useTranslation()

  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Open Source',
      description: 'Bireysel geliştiriciler ve küçük projeler için',
      price: 0,
      annualPrice: 0,
      popular: false,
      icon: Heart,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20',
      borderColor: 'border-green-200 dark:border-green-700',
      features: [
        { name: 'Tüm UI bileşenleri', included: true },
        { name: 'TypeScript desteği', included: true },
        { name: 'Dark mode desteği', included: true },
        { name: 'Responsive tasarım', included: true },
        { name: 'Açık kaynak lisansı', included: true },
        { name: 'Community desteği', included: true },
        { name: 'Temel dokümantasyon', included: true },
        { name: 'GitHub deposu erişimi', included: true },
        { name: 'Öncelikli destek', included: false },
        { name: 'Özel bileşenler', included: false },
        { name: 'Figma tasarım dosyaları', included: false },
        { name: 'Video eğitimler', included: false },
      ],
    },
    {
      name: 'Pro',
      description: 'Profesyonel geliştiriciler ve küçük ekipler için',
      price: 29,
      annualPrice: 290,
      popular: true,
      icon: Zap,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20',
      borderColor: 'border-primary-200 dark:border-primary-700',
      features: [
        { name: 'Tüm Open Source özellikler', included: true },
        { name: 'Öncelikli e-posta desteği', included: true },
        { name: 'Gelişmiş bileşenler', included: true },
        { name: 'Figma tasarım dosyaları', included: true },
        { name: 'Video eğitim serisi', included: true },
        { name: 'Özel temalar', included: true },
        { name: 'API entegrasyonları', included: true },
        { name: 'Performans optimizasyonları', included: true },
        { name: 'Özel hooks kütüphanesi', included: true },
        { name: 'Haftalık office hours', included: true },
        { name: 'Enterprise destek', included: false },
        { name: 'Özel geliştirme', included: false },
      ],
    },
    {
      name: 'Enterprise',
      description: 'Büyük ekipler ve şirketler için',
      price: 99,
      annualPrice: 990,
      popular: false,
      icon: Crown,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      features: [
        { name: 'Tüm Pro özellikler', included: true },
        { name: '24/7 öncelikli destek', included: true },
        { name: 'Özel bileşen geliştirme', included: true },
        { name: 'Özel tasarım sistemi', included: true },
        { name: 'Kod review hizmeti', included: true },
        { name: 'Mimarı danışmanlığı', included: true },
        { name: 'Özel eğitim programları', included: true },
        { name: 'SLA garantisi', included: true },
        { name: 'Unlimited kullanıcı', included: true },
        { name: 'Özel lisanslama', included: true },
        { name: 'White-label çözümler', included: true },
        { name: 'Özel entegrasyonlar', included: true },
      ],
    },
  ]

  const testimonials = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Frontend Lead, TechCorp',
      avatar: '👨‍💻',
      quote:
        'Starkon Template sayesinde geliştirme süremizi %60 kısalttık. Bileşenler gerçekten kaliteli ve kullanımı çok kolay.',
    },
    {
      name: 'Elif Kaya',
      role: 'Product Manager, StartupXYZ',
      avatar: '👩‍💼',
      quote: 'Figma entegrasyonu harika! Tasarımdan koda geçiş hiç bu kadar sorunsuz olmamıştı.',
    },
    {
      name: 'Mehmet Demir',
      role: 'CTO, InnovateLab',
      avatar: '👨‍🔬',
      quote: 'Enterprise desteği sayesinde özel ihtiyaçlarımızı hızla karşıladık. Ekip gerçekten profesyonel.',
    },
  ]

  const faqs = [
    {
      question: 'Planımı istediğim zaman değiştirebilir miyim?',
      answer: 'Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Değişiklik hemen etkili olur.',
    },
    {
      question: 'Para iade garantiniz var mı?',
      answer: 'Evet, satın alma tarihinden itibaren 30 gün içinde koşulsuz para iade garantisi sunuyoruz.',
    },
    {
      question: 'Enterprise plan için özel fiyatlandırma var mı?',
      answer: 'Büyük ekipler için özel fiyatlandırma seçeneklerimiz mevcuttur. Bizimle iletişime geçin.',
    },
    {
      question: 'Lisans nasıl çalışıyor?',
      answer: 'Pro ve Enterprise planlar geliştirici başına lisanslanır. Sınırsız proje kullanımı mevcuttur.',
    },
  ]

  const calculatePrice = (basePrice: number, annualPrice: number) => {
    if (basePrice === 0) return 0
    return isAnnual ? Math.round(annualPrice / 12) : basePrice
  }

  const calculateSavings = (basePrice: number, annualPrice: number) => {
    if (basePrice === 0) return 0
    return Math.round(((basePrice * 12 - annualPrice) / (basePrice * 12)) * 100)
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
                {t('pages.pricing.title')}
              </span>
            </h1>
            <p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              İhtiyacınıza uygun planı seçin ve Starkon Template&apos;in tüm gücünden yararlanın. Her bütçeye uygun
              çözümlerimiz var.
            </p>

            {/* Billing Toggle */}
            <div className='flex items-center justify-center space-x-4 mb-8'>
              <span
                className={`text-sm font-medium ${!isAnnual ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}
              >
                Aylık
              </span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span
                className={`text-sm font-medium ${isAnnual ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}
              >
                Yıllık
              </span>
              {isAnnual && (
                <Badge
                  variant='default'
                  size='sm'
                  className='bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                >
                  %17 tasarruf
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className='py-20 bg-white dark:bg-neutral-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const price = calculatePrice(plan.price, plan.annualPrice)
              const savings = calculateSavings(plan.price, plan.annualPrice)

              return (
                <Card
                  key={index}
                  className={`relative ${plan.popular ? 'ring-2 ring-primary-500 dark:ring-primary-400 scale-105' : ''} hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                      <Badge variant='default' className='px-4 py-1'>
                        <Star className='h-3 w-3 mr-1' />
                        En Popüler
                      </Badge>
                    </div>
                  )}

                  <CardHeader className='text-center pb-8'>
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${plan.bgColor} border ${plan.borderColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <Icon className={`h-8 w-8 ${plan.color}`} />
                    </div>

                    <CardTitle className='text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
                      {plan.name}
                    </CardTitle>
                    <p className='text-neutral-600 dark:text-neutral-300 mb-6'>{plan.description}</p>

                    <div className='space-y-2'>
                      <div className='flex items-baseline justify-center'>
                        <span className='text-5xl font-bold text-neutral-900 dark:text-neutral-100'>${price}</span>
                        <span className='text-neutral-600 dark:text-neutral-300 ml-2'>
                          {price === 0 ? 'Ücretsiz' : '/ay'}
                        </span>
                      </div>

                      {isAnnual && price > 0 && (
                        <div className='text-sm text-neutral-600 dark:text-neutral-300'>
                          <span className='line-through'>${plan.price}/ay</span>
                          <Badge
                            variant='default'
                            size='sm'
                            className='ml-2 bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                          >
                            %{savings} tasarruf
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-6'>
                    <Button
                      className={`w-full ${plan.popular ? 'bg-primary-600 hover:bg-primary-700 text-white' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.price === 0 ? 'Hemen Başla' : 'Planı Seç'}
                    </Button>

                    <div className='space-y-4'>
                      <h4 className='font-semibold text-neutral-900 dark:text-neutral-100'>Özellikler:</h4>
                      <ul className='space-y-3'>
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className='flex items-start space-x-3'>
                            {feature.included ? (
                              <Check className='h-5 w-5 text-green-500 flex-shrink-0 mt-0.5' />
                            ) : (
                              <X className='h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5' />
                            )}
                            <span
                              className={`text-sm ${feature.included ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'}`}
                            >
                              {feature.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className='py-20 bg-neutral-50 dark:bg-neutral-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>
              Detaylı Özellik Karşılaştırması
            </h2>
            <p className='text-lg text-neutral-600 dark:text-neutral-300'>
              Hangi planın size uygun olduğunu görmek için özellikleri karşılaştırın
            </p>
          </div>

          <div className='bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[640px]'>
                <thead className='bg-neutral-50 dark:bg-neutral-800'>
                  <tr>
                    <th className='text-left py-4 px-6 font-semibold text-neutral-900 dark:text-neutral-100'>
                      Özellikler
                    </th>
                    <th className='text-center py-4 px-6 font-semibold text-neutral-900 dark:text-neutral-100'>
                      Open Source
                    </th>
                    <th className='text-center py-4 px-6 font-semibold text-neutral-900 dark:text-neutral-100'>Pro</th>
                    <th className='text-center py-4 px-6 font-semibold text-neutral-900 dark:text-neutral-100'>
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-neutral-200 dark:divide-neutral-700'>
                  {[
                    { name: 'UI Bileşenleri', open: '50+', pro: '100+', enterprise: '150+' },
                    { name: 'TypeScript Desteği', open: true, pro: true, enterprise: true },
                    { name: 'Figma Dosyaları', open: false, pro: true, enterprise: true },
                    { name: 'Video Eğitimler', open: false, pro: '10+ saat', enterprise: '20+ saat' },
                    { name: 'Destek', open: 'Community', pro: 'Email', enterprise: '24/7' },
                    { name: 'Özel Bileşenler', open: false, pro: false, enterprise: true },
                  ].map((feature, index) => (
                    <tr key={index}>
                      <td className='py-4 px-6 font-medium text-neutral-900 dark:text-neutral-100'>{feature.name}</td>
                      <td className='py-4 px-6 text-center'>
                        {typeof feature.open === 'boolean' ? (
                          feature.open ? (
                            <CheckCircle className='h-5 w-5 text-green-500 mx-auto' />
                          ) : (
                            <X className='h-5 w-5 text-neutral-400 mx-auto' />
                          )
                        ) : (
                          <span className='text-sm text-neutral-600 dark:text-neutral-400'>{feature.open}</span>
                        )}
                      </td>
                      <td className='py-4 px-6 text-center'>
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <CheckCircle className='h-5 w-5 text-green-500 mx-auto' />
                          ) : (
                            <X className='h-5 w-5 text-neutral-400 mx-auto' />
                          )
                        ) : (
                          <span className='text-sm text-neutral-600 dark:text-neutral-400'>{feature.pro}</span>
                        )}
                      </td>
                      <td className='py-4 px-6 text-center'>
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? (
                            <CheckCircle className='h-5 w-5 text-green-500 mx-auto' />
                          ) : (
                            <X className='h-5 w-5 text-neutral-400 mx-auto' />
                          )
                        ) : (
                          <span className='text-sm text-neutral-600 dark:text-neutral-400'>{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>Müşterilerimiz Ne Diyor?</h2>
            <p className='text-lg text-neutral-600 dark:text-neutral-300'>
              Binlerce geliştirici Starkon Template ile projelerini hayata geçiriyor
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className='hover:shadow-lg dark:hover:shadow-xl transition-all duration-300'>
                <CardContent className='p-8'>
                  <div className='flex items-center mb-6'>
                    <div className='text-4xl mr-4'>{testimonial.avatar}</div>
                    <div>
                      <h4 className='font-semibold text-neutral-900 dark:text-neutral-100'>{testimonial.name}</h4>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote className='text-neutral-700 dark:text-neutral-300 italic leading-relaxed'>
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className='flex items-center mt-4'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='h-4 w-4 text-yellow-400 fill-current' />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='py-20 bg-neutral-50 dark:bg-neutral-800'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>Sık Sorulan Sorular</h2>
            <p className='text-lg text-neutral-600 dark:text-neutral-300'>
              Aklınıza takılan soruların cevapları burada
            </p>
          </div>

          <div className='space-y-8'>
            {faqs.map((faq, index) => (
              <Card key={index} className='border-neutral-200 dark:border-neutral-700'>
                <CardContent className='p-8'>
                  <h3 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4'>{faq.question}</h3>
                  <p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative overflow-hidden bg-gradient-to-r from-primary-500 via-blue-500 to-accent-500 dark:from-primary-700 dark:via-blue-700 dark:to-accent-700 py-20'>
        <div className='absolute inset-0 bg-grid-white/10 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]' />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='text-center'>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6 drop-shadow-md'>
              Hemen Başlamaya Hazır mısınız?
            </h2>
            <p className='text-lg text-white/95 mb-8 max-w-2xl mx-auto drop-shadow leading-relaxed'>
              Starkon Template ile projelerinizi bir sonraki seviyeye taşıyın. Bugün başlayın ve farkı hemen görün.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button className='bg-white hover:bg-neutral-100 text-primary-600 dark:bg-neutral-100 dark:text-primary-700 dark:hover:bg-white shadow-lg hover:shadow-xl font-semibold'>
                <Rocket className='h-4 w-4 mr-2' />
                Ücretsiz Başla
              </Button>
              <Button
                variant='outline'
                className='border-white/80 dark:border-white/60 text-white hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm'
              >
                <Headphones className='h-4 w-4 mr-2' />
                Demo Talep Et
              </Button>
            </div>

            <div className='mt-8 flex items-center justify-center space-x-8 text-white/80'>
              <div className='flex items-center space-x-2'>
                <Shield className='h-5 w-5' />
                <span className='text-sm'>30 gün para iade</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Clock className='h-5 w-5' />
                <span className='text-sm'>Anında erişim</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Users className='h-5 w-5' />
                <span className='text-sm'>10K+ geliştirici</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
