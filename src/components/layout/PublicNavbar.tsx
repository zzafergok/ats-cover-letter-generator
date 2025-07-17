'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Kanban, Home, FolderOpen, Menu, X, ChevronRight } from 'lucide-react'

import { Button } from '@/components/core/button'

import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

export function Header() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation: NavigationItem[] = [
    {
      name: t('navigation.home'),
      href: '/',
      icon: Home,
      description: t('navigation.homeDescription'),
    },
    {
      name: t('navigation.projects'),
      href: '/projects',
      icon: FolderOpen,
      description: t('navigation.projectsDescription'),
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-border/80' : 'bg-background border-border',
        )}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center'>
                <Kanban className='h-4 w-4 text-primary-foreground' />
              </div>
              <span className='text-xl font-bold text-foreground hidden sm:block'>{t('common.appTitle')}</span>
            </Link>

            <nav className='hidden md:flex items-center space-x-1'>
              {navigation.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className='flex items-center space-x-4'>
              <div className='hidden md:flex items-center space-x-2'>
                <Link href='/login'>
                  <Button variant='ghost' size='sm'>
                    {t('auth.signIn')}
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button size='sm'>{t('auth.signUp')}</Button>
                </Link>
              </div>

              <Button
                variant='ghost'
                size='icon'
                className='md:hidden'
                onClick={toggleMobileMenu}
                aria-label='Toggle menu'
              >
                {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-50 md:hidden'>
          <div className='fixed inset-0 bg-background/20 backdrop-blur-sm' onClick={closeMobileMenu} />

          <div className='fixed top-0 right-0 bottom-0 w-full max-w-sm bg-card shadow-xl'>
            <div className='flex items-center justify-between p-4 border-b border-border'>
              <h2 className='text-lg font-semibold text-foreground'>{t('navigation.menu')}</h2>
              <Button variant='ghost' size='icon' onClick={closeMobileMenu}>
                <X className='h-5 w-5' />
              </Button>
            </div>

            <div className='p-4'>
              <nav className='space-y-2'>
                {navigation.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      )}
                      onClick={closeMobileMenu}
                    >
                      <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                      <div className='flex-1'>
                        <span>{item.name}</span>
                        {item.description && <p className='text-xs text-muted-foreground mt-0.5'>{item.description}</p>}
                      </div>
                      <ChevronRight className='h-4 w-4 text-muted-foreground' />
                    </Link>
                  )
                })}
              </nav>

              <div className='mt-8 pt-6 border-t border-border space-y-2'>
                <Link href='/login' onClick={closeMobileMenu}>
                  <Button variant='outline' className='w-full'>
                    {t('auth.signIn')}
                  </Button>
                </Link>
                <Link href='/register' onClick={closeMobileMenu}>
                  <Button className='w-full'>{t('auth.signUp')}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
