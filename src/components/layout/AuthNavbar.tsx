'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { LogOut, Settings, FolderOpen, LayoutDashboard, UserCircle, Menu, X, ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/core/dropdown'
import { Badge } from '@/components/core/badge'
import { Avatar } from '@/components/core/avatar'
import { Button } from '@/components/core/button'
// import { Logo } from '@/components/ui/brand/logo'

import { useAuth } from '@/providers/AuthProvider'

import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string
}

export function AuthHeader() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation: NavigationItem[] = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      description: t('navigation.dashboardDescription'),
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

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
            <div className='flex items-center space-x-8'>
              <Link href='/dashboard' className='flex items-center space-x-2'>
                {/* <Logo size='sm' showText={false} className='hover:scale-105 transition-transform' /> */}
                <span className='text-xl font-bold text-foreground hidden sm:block'>{t('common.appName')}</span>
              </Link>

              <nav className='hidden lg:flex items-center space-x-1'>
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      )}
                    >
                      <item.icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant='secondary' className='ml-1 h-5 text-xs'>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className='flex items-center space-x-4'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='flex items-center space-x-2 h-10 px-2'>
                    <Avatar className='h-8 w-8'>
                      <div className='w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-sm font-semibold'>
                        {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </Avatar>
                    <div className='hidden sm:block text-left'>
                      <p className='text-sm font-medium text-foreground'>{user?.name || t('user.defaultName')}</p>
                      <p className='text-xs text-muted-foreground'>{user?.email}</p>
                    </div>
                    <ChevronDown className='h-4 w-4 text-muted-foreground hidden sm:block' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <div className='flex items-center space-x-2 p-2'>
                    <Avatar className='h-10 w-10'>
                      <div className='w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold'>
                        {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </Avatar>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-foreground'>{user?.name || t('user.defaultName')}</p>
                      <p className='text-xs text-muted-foreground'>{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href='/profile' className='flex items-center cursor-pointer'>
                      <UserCircle className='mr-2 h-4 w-4' />
                      {t('user.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/settings' className='flex items-center cursor-pointer'>
                      <Settings className='mr-2 h-4 w-4' />
                      {t('user.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='text-destructive focus:text-destructive cursor-pointer'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    {t('user.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden'
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
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div className='fixed inset-0 bg-background/20 backdrop-blur-sm' onClick={() => setIsMobileMenuOpen(false)} />

          <div className='fixed top-0 right-0 bottom-0 w-full max-w-sm bg-card shadow-xl'>
            <div className='flex items-center justify-between p-4 border-b border-border'>
              <h2 className='text-lg font-semibold text-foreground'>{t('navigation.menu')}</h2>
              <Button variant='ghost' size='icon' onClick={() => setIsMobileMenuOpen(false)}>
                <X className='h-5 w-5' />
              </Button>
            </div>

            <div className='p-4'>
              <nav className='space-y-2'>
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

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
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge variant='secondary' className='ml-2'>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && <p className='text-xs text-muted-foreground mt-0.5'>{item.description}</p>}
                      </div>
                    </Link>
                  )
                })}
              </nav>

              <div className='mt-8 pt-6 border-t border-border'>
                <div className='flex items-center space-x-3 mb-4'>
                  <Avatar className='h-10 w-10'>
                    <div className='w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold'>
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Avatar>
                  <div>
                    <p className='font-medium text-foreground'>{user?.name || t('user.defaultName')}</p>
                    <p className='text-xs text-muted-foreground'>{user?.email}</p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Link href='/profile' onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant='outline' className='w-full justify-start'>
                      <UserCircle className='mr-2 h-4 w-4' />
                      {t('user.profile')}
                    </Button>
                  </Link>
                  <Link href='/settings' onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant='outline' className='w-full justify-start'>
                      <Settings className='mr-2 h-4 w-4' />
                      {t('user.settings')}
                    </Button>
                  </Link>
                  <Button
                    variant='destructive'
                    className='w-full justify-start'
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    {t('user.logout')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
