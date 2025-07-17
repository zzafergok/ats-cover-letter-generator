'use client'

import React from 'react'

import { useTranslation } from 'react-i18next'
import { Heart, Github, HelpCircle } from 'lucide-react'

import { Button } from '@/components/core/button'

export function AuthFooter() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0'>
            {/* Left Side - Copyright */}
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400'>
                <span>© {currentYear} Starkon Template.</span>
                <span>{t('pages.home.footer.copyright')}</span>
              </div>
            </div>

            {/* Center - Made with Love */}
            <div className='flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400'>
              <span>{t('navigation.madeWith')}</span>
              <Heart className='h-4 w-4 text-red-500 fill-current' />
            </div>

            {/* Right Side - Links */}
            <div className='flex items-center space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => window.open('https://github.com/zzafergok/sea-ui-kit', '_blank')}
                className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
              >
                <Github className='h-4 w-4' />
                GitHub
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => window.open('https://github.com/zzafergok/sea-ui-kit/issues', '_blank')}
                className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
              >
                <HelpCircle className='h-4 w-4' />
                {t('navigation.help')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
