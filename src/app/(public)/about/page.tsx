'use client'

import React from 'react'

import { useTranslation } from 'react-i18next'
import { Users, Award, Globe, Rocket, Star, Target, Heart, Code, Shield } from 'lucide-react'

import { Badge } from '@/components/core/Badge/Badge'
import { Card, CardContent } from '@/components/core/Card/Card'

export default function AboutPage() {
  const { t } = useTranslation()

  const teamMembers = [
    {
      name: 'Zafer Gök',
      role: 'Kurucu & Baş Geliştirici',
      bio: '15+ yıllık deneyime sahip full-stack developer. React ekosisteminde uzman.',
      avatar: '👨‍💻',
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js'],
    },
    {
      name: 'Sarah Johnson',
      role: 'UX/UI Tasarımcısı',
      bio: 'Kullanıcı deneyimi konusunda 10 yıllık tecrübe. Erişilebilir tasarım uzmanı.',
      avatar: '👩‍🎨',
      skills: ['Figma', 'Design Systems', 'Accessibility', 'Prototyping'],
    },
    {
      name: 'Michael Chen',
      role: 'Backend Geliştirici',
      bio: 'Scalable sistemler ve API geliştirme konularında deneyimli.',
      avatar: '👨‍💼',
      skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    },
  ]

  const achievements = [
    { icon: Users, count: '10,000+', label: 'Aktif Kullanıcı' },
    { icon: Award, count: '50+', label: 'Tamamlanan Proje' },
    { icon: Globe, count: '25+', label: 'Ülke' },
    { icon: Star, count: '4.9/5', label: 'Kullanıcı Memnuniyeti' },
  ]

  const values = [
    {
      icon: Target,
      title: 'Kalite Odaklı',
      description: 'Her detayda mükemmellik arayışı ile kullanıcılarımıza en iyi deneyimi sunuyoruz.',
    },
    {
      icon: Heart,
      title: 'Kullanıcı Merkezli',
      description: 'Tüm kararlarımızı kullanıcı ihtiyaçları ve geri bildirimleri doğrultusunda alıyoruz.',
    },
    {
      icon: Rocket,
      title: 'İnovatif Yaklaşım',
      description: 'Teknolojinin öncüsü olmak için sürekli araştırma ve geliştirme yapıyoruz.',
    },
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: 'Projelerinizin güvenliği ve sürdürülebilirliği için en yüksek standartları uyguluyoruz.',
    },
  ]

  const technologies = [
    { name: 'React 18+', description: 'Modern React özellikleri' },
    { name: 'TypeScript', description: 'Type-safe geliştirme' },
    { name: 'Next.js 14+', description: 'Full-stack framework' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS' },
    { name: 'Radix UI', description: 'Erişilebilir komponentler' },
    { name: 'Redux Toolkit', description: 'State management' },
  ]

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-900'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-white via-primary-50 to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-800 py-24'>
        <div className='absolute inset-0 bg-grid-neutral-200/20 dark:bg-grid-neutral-700/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.2))]' />

        <div className='absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-700/20 rounded-full blur-3xl animate-pulse opacity-70' />
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 dark:bg-accent-700/20 rounded-full blur-3xl animate-pulse opacity-60' />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
              <span className='text-gradient bg-gradient-to-r from-primary-600 via-blue-500 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:via-blue-300 dark:to-accent-400'>
                {t('pages.about.title')}
              </span>
            </h1>
            <p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Modern web teknolojileri ile gelecek nesil uygulamalar geliştiren tutkulu bir ekibiz. Starkon Template ile
              developer deneyimini yeniden tanımlıyoruz.
            </p>
            <div className='flex justify-center'>
              <Badge variant='default' size='lg' className='px-6 py-2'>
                <Rocket className='h-4 w-4 mr-2' />
                2024&apos;ten beri güvenilen partner
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className='py-16 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div key={index} className='text-center group'>
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300'>
                    <Icon className='h-8 w-8 text-primary-600 dark:text-primary-400' />
                  </div>
                  <div className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1'>
                    {achievement.count}
                  </div>
                  <div className='text-sm font-medium text-neutral-600 dark:text-neutral-300'>{achievement.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>
              Misyonumuz & Değerlerimiz
            </h2>
            <p className='text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto'>
              Teknoloji ile hayatı kolaylaştırmak ve geliştiricilere güçlü araçlar sunmak temel amacımızdır.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className='group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300'>
                  <CardContent className='p-8'>
                    <div className='flex items-start space-x-4'>
                      <div className='flex-shrink-0'>
                        <div className='w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                          <Icon className='h-6 w-6 text-primary-600 dark:text-primary-400' />
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3'>
                          {value.title}
                        </h3>
                        <p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className='py-20 bg-neutral-50 dark:bg-neutral-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>
              Teknoloji Yığınımız
            </h2>
            <p className='text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto'>
              En güncel ve performanslı teknolojilerle projelerinizi hayata geçiriyoruz.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {technologies.map((tech, index) => (
              <Card
                key={index}
                className='group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              >
                <CardContent className='p-6 text-center'>
                  <div className='w-12 h-12 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/20 border border-accent-200 dark:border-accent-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                    <Code className='h-6 w-6 text-accent-600 dark:text-accent-400' />
                  </div>
                  <h3 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>{tech.name}</h3>
                  <p className='text-sm text-neutral-600 dark:text-neutral-300'>{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>Ekibimiz</h2>
            <p className='text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto'>
              Deneyimli ve tutkulu profesyonellerden oluşan ekibimizle projelerinizi başarıya taşıyoruz.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className='group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              >
                <CardContent className='p-8 text-center'>
                  <div className='text-6xl mb-4'>{member.avatar}</div>
                  <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>{member.name}</h3>
                  <Badge variant='secondary' className='mb-4'>
                    {member.role}
                  </Badge>
                  <p className='text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed'>{member.bio}</p>
                  <div className='flex flex-wrap justify-center gap-2'>
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant='outline' size='sm'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
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
              Birlikte Harika Projeler Yapalım
            </h2>
            <p className='text-lg text-white/95 mb-8 max-w-2xl mx-auto drop-shadow leading-relaxed'>
              Starkon Template ile projelerinizi bir üst seviyeye taşımaya hazır mısınız? Hemen başlayın ve farkı
              deneyimleyin.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-neutral-100 text-primary-600 dark:bg-neutral-100 dark:text-primary-700 dark:hover:bg-white shadow-lg hover:shadow-xl h-10 px-6 py-2 font-semibold'>
                <Rocket className='h-4 w-4 mr-2' />
                Hemen Başla
              </button>
              <button className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 border border-white/80 dark:border-white/60 text-white hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm h-10 px-6 py-2'>
                <Users className='h-4 w-4 mr-2' />
                Ekibimizle Tanış
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
