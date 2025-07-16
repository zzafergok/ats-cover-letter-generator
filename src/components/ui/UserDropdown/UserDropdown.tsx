'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/core/Button/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/core/Avatar/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/core/Dropdown/Dropdown'
import { useAuth } from '@/hooks/useAuth'
import { useDropdownState } from '@/hooks/useDropdownState'

export function UserDropdown() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { isOpen, setIsOpen } = useDropdownState({
    scrollbarCompensation: true,
    preventBodyScroll: false,
  })

  if (!user) return null

  const userInitials = user.username ? user.username.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNavigation = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  const menuItems = [
    {
      label: t('navigation.profile'),
      icon: User,
      action: () => handleNavigation('/profile'),
      shortcut: '⌘P',
    },
    {
      label: t('navigation.settings'),
      icon: Settings,
      action: () => handleNavigation('/settings'),
      shortcut: '⌘,',
    },
  ]

  if (user.role === 'admin') {
    menuItems.push({
      label: t('navigation.users'),
      icon: Shield,
      action: () => handleNavigation('/users'),
      shortcut: '⌘U',
    })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-9 w-9 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          aria-label={`${t('navigation.userMenu')}: ${user.username || user.email}`}
        >
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.avatar} alt={user.username || user.email} />
            <AvatarFallback className='bg-primary-500 text-white text-xs'>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-56 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg'
        sideOffset={8}
      >
        <DropdownMenuLabel className='px-3 py-2'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
              {user.username || user.email.split('@')[0]}
            </p>
            <p className='text-xs text-neutral-500 dark:text-neutral-400'>{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className='bg-neutral-200 dark:bg-neutral-700' />

        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem
              key={index}
              onClick={item.action}
              className='flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-200'
            >
              <Icon className='h-4 w-4' />
              <span className='flex-1'>{item.label}</span>
              <span className='text-xs text-neutral-500 dark:text-neutral-400'>{item.shortcut}</span>
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator className='bg-neutral-200 dark:bg-neutral-700' />

        <DropdownMenuItem
          onClick={handleLogout}
          className='flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400'
        >
          <LogOut className='h-4 w-4' />
          <span>{t('auth.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
