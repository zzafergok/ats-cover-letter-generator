'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, LogIn } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/core/Button/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle/LanguageToggle'
import { NavbarZIndexFix } from './NavbarZIndexFix'

export function PublicNavbar() {
  const router = useRouter()
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const navigationItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/about', label: t('navigation.about') },
    { href: '/contact', label: t('navigation.contact') },
    { href: '/pricing', label: t('navigation.pricing') },
  ]

  return (
    <>
      <NavbarZIndexFix />
      <nav className='sticky top-0 z-[9999] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-900/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link
                href='/'
                className='text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors'
              >
                Starkon Template
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-8'>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors relative group'
                >
                  {item.label}
                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300' />
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className='hidden md:flex items-center space-x-4'>
              {/* Theme Toggle - En yüksek z-index */}
              <div className='relative z-[10000]'>
                <ThemeToggle />
              </div>

              {/* Language Toggle - Yüksek z-index */}
              <div className='relative z-[9999]'>
                <LanguageToggle />
              </div>

              {/* Auth Buttons */}
              <div className='flex items-center space-x-3'>
                {isAuthenticated ? (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant='default'
                    size='sm'
                    className='bg-primary-500 hover:bg-primary-600 text-white'
                  >
                    {t('pages.home.goToDashboard')}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => router.push('/auth/login')}
                      variant='ghost'
                      size='sm'
                      className='text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
                    >
                      <LogIn className='mr-2 h-4 w-4' />
                      {t('auth.login')}
                    </Button>
                    <Button
                      onClick={() => router.push('/auth/register')}
                      variant='default'
                      size='sm'
                      className='bg-primary-500 hover:bg-primary-600 text-white'
                    >
                      {t('auth.register')}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <Button variant='ghost' size='sm' onClick={toggleMobileMenu} className='h-9 w-9 p-0' aria-label='Menü'>
                {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'>
            <div className='px-4 py-4 space-y-3'>
              {/* Mobile Navigation Links */}
              <div className='space-y-2'>
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className='block px-3 py-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md font-medium transition-colors'
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className='border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3'>
                {/* Mobile Theme and Language */}
                <div className='flex items-center justify-between px-3 py-2 mb-3'>
                  <div className='flex items-center space-x-3'>
                    <ThemeToggle />
                    <LanguageToggle />
                  </div>
                </div>

                {/* Mobile Auth Actions */}
                <div className='space-y-2'>
                  {isAuthenticated ? (
                    <Button
                      onClick={() => {
                        closeMobileMenu()
                        router.push('/dashboard')
                      }}
                      variant='default'
                      size='sm'
                      className='w-full bg-primary-500 hover:bg-primary-600 text-white'
                    >
                      {t('pages.home.goToDashboard')}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          closeMobileMenu()
                          router.push('/auth/login')
                        }}
                        variant='outline'
                        size='sm'
                        className='w-full'
                      >
                        <LogIn className='mr-2 h-4 w-4' />
                        {t('auth.login')}
                      </Button>
                      <Button
                        onClick={() => {
                          closeMobileMenu()
                          router.push('/auth/register')
                        }}
                        variant='default'
                        size='sm'
                        className='w-full bg-primary-500 hover:bg-primary-600 text-white'
                      >
                        {t('auth.register')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
