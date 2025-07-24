'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import {
  LogOut,
  Settings,
  LayoutDashboard,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  FileText,
  Users,
  Layout,
} from 'lucide-react'

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
import { useUserProfileStore } from '@/store/userProfileStore'

import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string
  submenu?: {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    description?: string
  }[]
}

export function AuthHeader() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { profile, getProfile } = useUserProfileStore()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load profile data on component mount
  useEffect(() => {
    if (user && !profile) {
      getProfile()
    }
  }, [user, profile, getProfile])

  const navigation: NavigationItem[] = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      description: t('navigation.dashboardDescription'),
    },
    {
      name: t('navigation.coverLetter'),
      href: '/cover-letter',
      icon: FileText,
      description: t('navigation.coverLetterDescription'),
      submenu: [
        {
          name: t('navigation.coverLetterGenerator'),
          href: '/cover-letter',
          icon: FileText,
          description: t('navigation.coverLetterGeneratorDescription'),
        },
        {
          name: t('navigation.coverLetterTemplates'),
          href: '/cover-letter/template',
          icon: Layout,
          description: t('navigation.coverLetterTemplatesDescription'),
        },
      ],
    },
    {
      name: t('navigation.users'),
      href: '/users',
      icon: Users,
      description: t('navigation.usersDescription'),
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

  // Get avatar style based on hex color
  const getAvatarStyle = (hexColor?: string) => {
    const fallbackColor = '#3B82F6'
    const color = hexColor && hexColor !== '' ? hexColor : fallbackColor

    return {
      backgroundColor: color,
      color: '#ffffff',
    }
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
                <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden sm:block'>{t('common.appName')}</span>
              </Link>

              <nav className='hidden lg:flex items-center space-x-1'>
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                  if (item.submenu) {
                    return (
                      <DropdownMenu key={item.href}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            className={cn(
                              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                              isActive
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                            )}
                          >
                            <item.icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                            <span>{item.name}</span>
                            <ChevronDown className='h-3 w-3' />
                            {item.badge && (
                              <Badge variant='secondary' className='ml-1 h-5 text-xs'>
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='w-56'>
                          {item.submenu.map((subItem) => (
                            <DropdownMenuItem key={subItem.href} asChild>
                              <Link href={subItem.href} className='flex items-center cursor-pointer'>
                                <subItem.icon className='mr-2 h-4 w-4' />
                                <div className='flex-1'>
                                  <div className='font-medium text-sm'>{subItem.name}</div>
                                  <div className='text-xs text-muted-foreground'>{subItem.description}</div>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  }

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
                      <div
                        className='w-full h-full flex items-center justify-center text-sm font-semibold'
                        style={getAvatarStyle(profile?.avatarColor)}
                      >
                        {profile?.firstName?.charAt(0)?.toUpperCase() ||
                          user?.name?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toUpperCase() ||
                          'U'}
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
                      <div
                        className='w-full h-full flex items-center justify-center font-semibold'
                        style={getAvatarStyle(profile?.avatarColor)}
                      >
                        {profile?.firstName?.charAt(0)?.toUpperCase() ||
                          user?.name?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toUpperCase() ||
                          'U'}
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
                    <div key={item.href}>
                      <Link
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
                          {item.description && (
                            <p className='text-xs text-muted-foreground mt-0.5'>{item.description}</p>
                          )}
                        </div>
                      </Link>

                      {item.submenu && (
                        <div className='ml-8 mt-2 space-y-1'>
                          {item.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors',
                                  isSubActive
                                    ? 'bg-primary/5 text-primary border-l-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <subItem.icon
                                  className={cn('h-4 w-4', isSubActive ? 'text-primary' : 'text-muted-foreground')}
                                />
                                <div className='flex-1'>
                                  <div className='font-medium'>{subItem.name}</div>
                                  <div className='text-xs text-muted-foreground'>{subItem.description}</div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>

              <div className='mt-8 pt-6 border-t border-border'>
                <div className='flex items-center space-x-3 mb-4'>
                  <Avatar className='h-10 w-10'>
                    <div
                      className='w-full h-full flex items-center justify-center font-semibold'
                      style={getAvatarStyle(profile?.avatarColor)}
                    >
                      {profile?.firstName?.charAt(0)?.toUpperCase() ||
                        user?.name?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        'U'}
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
