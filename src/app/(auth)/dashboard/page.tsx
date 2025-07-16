'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/core/Button/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/Card/Card'
import { Badge } from '@/components/core/Badge/Badge'

import { useAuth } from '@/hooks/useAuth'
import { logAuthDebug } from '@/utils/authDebug'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // console.error('Logout failed:', error)
    }
  }

  const handleDebugAuth = () => {
    if (process.env.NODE_ENV === 'development') {
      logAuthDebug('Manual Debug - Dashboard')
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle className='text-center'>{t('pages.dashboard.userInfoNotLoaded')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Button onClick={handleLogout} variant='outline' className='w-full'>
              {t('auth.logout')}
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button onClick={handleDebugAuth} variant='ghost' size='sm' className='w-full'>
                Debug Auth State
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100/50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950/80'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Welcome Header */}
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold text-neutral-900 dark:text-neutral-50'>
              {t('pages.dashboard.welcome', { name: user.username })}
            </h1>
            <p className='text-neutral-600 dark:text-neutral-400 text-lg'>{t('pages.dashboard.description')}</p>
          </div>

          {/* User Info Card */}
          <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>Kullanıcı Bilgileri</span>
                <Badge className='bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50'>
                  {user.role}
                </Badge>
              </CardTitle>
              <CardDescription>Hesap detayları ve bilgileri</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Ad Soyad</label>
                  <p className='text-neutral-900 dark:text-neutral-100'>{user.username}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Kullanıcı Adı</label>
                  <p className='text-neutral-900 dark:text-neutral-100'>{user.username}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>E-posta</label>
                  <p className='text-neutral-900 dark:text-neutral-100'>{user.email}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Kayıt Tarihi</label>
                  <p className='text-neutral-900 dark:text-neutral-100'>
                    {(user as any).createdAt
                      ? new Date((user as any).createdAt).toLocaleDateString('tr-TR')
                      : 'Bilgi yok'}
                  </p>
                </div>
                {(user as any).lastLoginAt && (
                  <div className='space-y-1 md:col-span-2'>
                    <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Son Giriş</label>
                    <p className='text-neutral-900 dark:text-neutral-100'>
                      {new Date((user as any).lastLoginAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              onClick={() => (window.location.href = '/profile')}
              variant='outline'
              className='bg-white/70 dark:bg-neutral-800/70 border-neutral-200/80 dark:border-neutral-600/80'
            >
              {t('pages.dashboard.viewProfile')}
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant='default'
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {isLoading ? 'Çıkış yapılıyor...' : t('pages.dashboard.logout')}
            </Button>
          </div>

          {/* Debug Panel - Development Only */}
          {process.env.NODE_ENV === 'development' && (
            <Card className='bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/50'>
              <CardHeader>
                <CardTitle className='text-yellow-800 dark:text-yellow-200 text-sm'>
                  🔧 Development Debug Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex gap-2'>
                  <Button onClick={handleDebugAuth} variant='ghost' size='sm'>
                    Debug Auth State
                  </Button>
                  <Button onClick={() => console.log('User Object:', user)} variant='ghost' size='sm'>
                    Log User Object
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
