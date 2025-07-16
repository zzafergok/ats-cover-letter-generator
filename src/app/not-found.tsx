'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/core/Button/Button'
import { Card, CardContent } from '@/components/core/Card/Card'

export default function NotFound() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className='min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 px-4'>
      <Card className='w-full max-w-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 backdrop-blur-sm'>
        <CardContent className='p-8 text-center'>
          {/* 404 Visual */}
          <div className='mb-8'>
            <div className='text-8xl font-bold text-primary-500 dark:text-primary-400 mb-4'>
              {t('pages.notFound.title')}
            </div>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary-100/60 to-accent-100/60 dark:from-primary-800/20 dark:to-accent-800/20 rounded-full blur-3xl opacity-60' />
              <div className='relative p-6 bg-gradient-to-br from-primary-50/80 to-accent-50/80 dark:from-neutral-700/50 dark:to-neutral-600/50 border border-primary-200/50 dark:border-neutral-600/50 rounded-full inline-block'>
                <Search className='h-16 w-16 text-primary-400 dark:text-primary-500' />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>
              {t('pages.notFound.heading')}
            </h1>
            <p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>{t('pages.notFound.description')}</p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              onClick={() => router.push('/')}
              className='flex items-center gap-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white'
            >
              <Home className='h-4 w-4' />
              {t('pages.notFound.goHome')}
            </Button>
            <Button
              variant='outline'
              onClick={() => router.back()}
              className='flex items-center gap-2 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            >
              <ArrowLeft className='h-4 w-4' />
              {t('pages.notFound.goBack')}
            </Button>
          </div>

          {/* Additional Help */}
          <div className='mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700'>
            <p className='text-sm text-neutral-600 dark:text-neutral-300 mb-4'>Aradığınızı bulamadınız mı?</p>
            <div className='flex flex-wrap gap-2 justify-center text-sm'>
              <button
                onClick={() => router.push('/about')}
                className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors'
              >
                Hakkımızda
              </button>
              <span className='text-neutral-300 dark:text-neutral-600'>•</span>
              <button
                onClick={() => router.push('/contact')}
                className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors'
              >
                İletişim
              </button>
              <span className='text-neutral-300 dark:text-neutral-600'>•</span>
              <button
                onClick={() => router.push('/components')}
                className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors'
              >
                Bileşenler
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
