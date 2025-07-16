'use client'

import React from 'react'

import { useTranslation } from 'react-i18next'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

import { Button } from '@/components/core/Button/Button'

const footerLinks = {
  quickLinks: [
    { href: '/', labelKey: 'navigation.home' },
    { href: '/about', labelKey: 'navigation.about' },
    { href: '/contact', labelKey: 'navigation.contact' },
    { href: '/pricing', labelKey: 'navigation.pricing' },
  ],
  legal: [
    { href: '/privacy', labelKey: 'navigation.privacy' },
    { href: '/terms', labelKey: 'navigation.terms' },
    { href: '/cookies', labelKey: 'navigation.cookies' },
  ],
  support: [
    { href: '/help', labelKey: 'navigation.help', external: false },
    { href: '/support', labelKey: 'navigation.support', external: false },
    { href: 'https://github.com/zzafergok/sea-ui-kit/issues', labelKey: 'GitHub Issues', external: true },
  ],
} as const

const socialLinks = [
  { href: 'https://github.com/zzafergok/sea-ui-kit', icon: Github, label: 'GitHub' },
  { href: 'https://twitter.com/zzafergok', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com/in/zzafergok', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:contact@seauikit.com', icon: Mail, label: 'Email' },
] as const

export function PublicFooter() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const handleLinkClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = href
    }
  }

  return (
    <footer className='bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {/* Brand Section */}
            <div className='lg:col-span-1'>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent'>
                  Starkon Template
                </div>
              </div>
              <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm'>
                Modern React uygulamaları için tasarlanmış kapsamlı bileşen kütüphanesi. Radix UI tabanlı, erişilebilir
                ve özelleştirilebilir komponentler.
              </p>
              <div className='flex space-x-3'>
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Button
                      key={social.href}
                      variant='ghost'
                      size='sm'
                      onClick={() => handleLinkClick(social.href, true)}
                      className='p-2 h-auto hover:text-primary-600 dark:hover:text-primary-400'
                      aria-label={social.label}
                    >
                      <Icon className='h-4 w-4' />
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4'>
                {t('navigation.quickLinks')}
              </h3>
              <ul className='space-y-3'>
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className='text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200'
                    >
                      {t(link.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className='text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4'>
                {t('navigation.support')}
              </h3>
              <ul className='space-y-3'>
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleLinkClick(link.href, link.external)}
                      className='text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200'
                    >
                      {link.external ? link.labelKey : t(link.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className='text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4'>
                {t('navigation.legal')}
              </h3>
              <ul className='space-y-3'>
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className='text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200'
                    >
                      {t(link.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='border-t border-neutral-200 dark:border-neutral-800 py-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0'>
            <div className='flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400'>
              <span>© {currentYear} Starkon Template.</span>
              <span>{t('pages.home.footer.copyright')}</span>
            </div>

            <div className='flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400'>
              <span>{t('navigation.madeWith')}</span>
              <Heart className='h-4 w-4 text-red-500 fill-current' />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
