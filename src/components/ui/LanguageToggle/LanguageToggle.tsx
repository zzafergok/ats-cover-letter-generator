'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

import { useLocale } from '@/hooks/useLocale'
import { useDropdownPortal } from '@/hooks/useDropdownPortal'
import { Button } from '@/components/core/Button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/core/Dropdown/Dropdown'

const languages = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Turkish', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
]

export function LanguageToggle() {
  const { t } = useTranslation()
  const { currentLocale, changeLocale, isChangingLanguage } = useLocale()

  // Portal z-index yönetimi
  useDropdownPortal({ zIndex: 10000, autoManage: true })

  const currentLanguage = languages.find((lang) => lang.code === currentLocale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-9 w-9 rounded-md p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          disabled={isChangingLanguage}
          aria-label={t('navigation.language', 'Dil Seçimi')}
        >
          <span className='text-base' role='img' aria-label={currentLanguage?.name}>
            {currentLanguage?.flag || '🌐'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-48 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg'
        sideOffset={8}
        zIndex={10000}
      >
        {languages.map((language) => {
          const isActive = currentLocale === language.code
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLocale(language.code as any)}
              disabled={isChangingLanguage}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-neutral-700 dark:text-neutral-200'
              }`}
            >
              <span className='text-base' role='img' aria-label={language.name}>
                {language.flag}
              </span>
              <div className='flex-1'>
                <div className='font-medium'>{language.name}</div>
                <div className='text-xs text-neutral-500 dark:text-neutral-400'>{language.nativeName}</div>
              </div>
              {isActive && <Check className='h-4 w-4 text-primary-500' aria-hidden='true' />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
