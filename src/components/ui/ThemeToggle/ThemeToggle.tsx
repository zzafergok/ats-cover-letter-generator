'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Monitor, Moon, Sun, Check } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'
import { useDropdownPortal } from '@/hooks/useDropdownPortal'
import { Button } from '@/components/core/Button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/core/Dropdown/Dropdown'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, setTheme, isDisabled } = useTheme()

  // Portal z-index yönetimi
  useDropdownPortal({ zIndex: 10001, autoManage: true })

  const themeOptions = [
    {
      value: 'light',
      label: t('theme.light', 'Açık'),
      icon: Sun,
    },
    {
      value: 'dark',
      label: t('theme.dark', 'Koyu'),
      icon: Moon,
    },
  ] as const

  const currentTheme = themeOptions.find((option) => option.value === theme)
  const CurrentIcon = currentTheme?.icon || Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-9 w-9 rounded-md p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          disabled={isDisabled}
          aria-label={t('theme.toggle', 'Tema Değiştir')}
        >
          <CurrentIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-40 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg'
        sideOffset={8}
        zIndex={10001}
      >
        {themeOptions.map((option) => {
          const Icon = option.icon
          const isActive = theme === option.value

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              disabled={isDisabled}
              className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-neutral-700 dark:text-neutral-200'
              }`}
            >
              <Icon className='h-4 w-4' />
              <span className='flex-1'>{option.label}</span>
              {isActive && <Check className='h-4 w-4 text-primary-500' aria-hidden='true' />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
