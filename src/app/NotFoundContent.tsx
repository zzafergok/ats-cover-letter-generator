'use client'

import Link from 'next/link'

import { ArrowLeft, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useLocale } from '@/hooks/useLocale'

import { Button } from '@/components/core/button'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

export default function NotFoundContent() {
  const { isReady } = useLocale()
  const { t } = useTranslation()

  if (!isReady) {
    return <LoadingSpinner />
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md'>
        <Card>
          <CardHeader className='text-center'>
            <div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
              <span className='text-2xl font-bold text-muted-foreground'>404</span>
            </div>
            <CardTitle className='text-2xl font-bold'>{t('notFound.title')}</CardTitle>
            <CardDescription>{t('notFound.description')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-3'>
              <Link href='/dashboard'>
                <Button className='w-full'>
                  <Home className='w-4 h-4 mr-2' />
                  {t('notFound.homeButton')}
                </Button>
              </Link>

              <Link href='/login'>
                <Button variant='outline' className='w-full'>
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  {t('notFound.loginButton')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
