'use client'

import Link from 'next/link'

import React from 'react'

import { useTranslation } from 'react-i18next'
import { Settings, ArrowLeft, User } from 'lucide-react'

import { useAuth } from '@/providers/AuthProvider'

import { Button } from '@/components/core/button'
import { SettingsThemeSection } from '@/components/ui/theme/settings-theme-section'
import SettingsPasswordSection from '@/components/ui/settings/settings-password-section'
import { SettingsLanguageSection } from '@/components/ui/language/settings-language-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>{t('settings.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center space-x-4 mb-4'>
            <Link href='/dashboard'>
              <Button variant='outline' size='sm' className='flex items-center space-x-2'>
                <ArrowLeft className='h-4 w-4' />
                <span>{t('settings.returnToDashboard')}</span>
              </Button>
            </Link>
          </div>

          <div className='flex items-center space-x-3'>
            <Settings className='h-8 w-8 text-primary' />
            <div>
              <h1 className='text-2xl font-bold text-foreground'>{t('settings.title')}</h1>
              <p className='text-muted-foreground'>{t('settings.description')}</p>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Hesap Bilgileri */}
          <Card>
            <CardHeader>
              <div className='flex items-center space-x-2'>
                <User className='h-5 w-5 text-primary' />
                <div>
                  <CardTitle>{t('settings.accountInfo')}</CardTitle>
                  <CardDescription>{t('settings.personalInformation')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <p className='text-sm font-medium text-foreground'>{t('settings.email')}</p>
                  <p className='text-sm text-muted-foreground'>{user?.email}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-foreground'>{t('settings.fullName')}</p>
                  <p className='text-sm text-muted-foreground'>{user?.name || t('settings.notSpecified')}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-foreground'>{t('settings.userId')}</p>
                  <p className='text-sm text-muted-foreground'>{user?.id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-foreground'>{t('settings.role')}</p>
                  <p className='text-sm text-muted-foreground'>{user?.role || t('settings.userRole')}</p>
                </div>
              </div>
              <div className='mt-4 pt-4 border-t border-border'>
                <Link href='/profile'>
                  <Button variant='outline' size='sm'>
                    {t('settings.editProfile')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Şifre Değiştirme */}
          <SettingsPasswordSection />

          {/* Tema ve Dil Ayarları - Responsive Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Tema ve Görünüm */}
            <SettingsThemeSection />

            {/* Dil ve Bölge */}
            <SettingsLanguageSection />
          </div>
        </div>
      </div>
    </div>
  )
}
