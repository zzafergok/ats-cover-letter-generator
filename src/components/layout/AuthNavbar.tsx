'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, User, Settings, LogOut } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/core/Button/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle/LanguageToggle'
import { Avatar, AvatarFallback } from '@/components/core/Avatar/Avatar'
import { NavbarZIndexFix } from './NavbarZIndexFix'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/core/Dropdown/Dropdown'

export function AuthNavbar() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [logout, router])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const navigationItems = [
    { href: '/dashboard', label: t('navigation.dashboard') },
    { href: '/components', label: t('navigation.components') },
    { href: '/users', label: t('navigation.users') },
    { href: '/settings', label: t('navigation.settings') },
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
                href='/dashboard'
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

              {/* User Menu - Yüksek z-index */}
              <div className='relative z-[9998]'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-9 w-9 rounded-full p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback className='bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium'>
                          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56 z-[9999]' sideOffset={8}>
                    <DropdownMenuLabel className='font-normal'>
                      <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium'>{user?.username || 'Kullanıcı'}</p>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className='cursor-pointer'>
                      <User className='mr-2 h-4 w-4' />
                      {t('navigation.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')} className='cursor-pointer'>
                      <Settings className='mr-2 h-4 w-4' />
                      {t('navigation.settings')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className='cursor-pointer text-red-600 dark:text-red-400'>
                      <LogOut className='mr-2 h-4 w-4' />
                      {t('auth.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                {/* Mobile User Info */}
                <div className='px-3 py-2 mb-3'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium'>
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
                        {user?.username || 'Kullanıcı'}
                      </p>
                      <p className='text-xs text-neutral-500 dark:text-neutral-400'>{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className='space-y-2'>
                  <Link
                    href='/profile'
                    onClick={closeMobileMenu}
                    className='flex items-center px-3 py-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors'
                  >
                    <User className='mr-3 h-4 w-4' />
                    {t('navigation.profile')}
                  </Link>
                  <Link
                    href='/settings'
                    onClick={closeMobileMenu}
                    className='flex items-center px-3 py-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors'
                  >
                    <Settings className='mr-3 h-4 w-4' />
                    {t('navigation.settings')}
                  </Link>

                  <div className='flex items-center justify-between px-3 py-2'>
                    <div className='flex items-center space-x-3'>
                      <ThemeToggle />
                      <LanguageToggle />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      closeMobileMenu()
                      handleLogout()
                    }}
                    className='flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors'
                  >
                    <LogOut className='mr-3 h-4 w-4' />
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
