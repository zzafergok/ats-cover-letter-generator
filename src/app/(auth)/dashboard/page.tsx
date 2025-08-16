'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { FileText, Upload, Wand2, Calendar } from 'lucide-react'

import { useAuth } from '@/providers/AuthProvider'

import { useCVStore } from '@/store/cvStore'
import { useCoverLetterStore } from '@/store/coverLetterStore'

import { Button } from '@/components/core/button'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

import type { CoverLetterBasic } from '@/types/api.types'

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user, isAuthenticated, loading } = useAuth()
  const { basicCoverLetters = [], getBasicCoverLetters } = useCoverLetterStore()
  const { uploadedCVs = [], savedCVs = [], getUploadedCVs, getSavedCVs } = useCVStore()

  const [dataLoaded, setDataLoaded] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Safe stats calculation with fallbacks
  const getDashboardStats = () => {
    const safeUploadedCVs = Array.isArray(uploadedCVs) ? uploadedCVs : []
    const safeSavedCVs = Array.isArray(savedCVs) ? savedCVs : []
    const safeSavedCoverLetters = Array.isArray(basicCoverLetters) ? basicCoverLetters : []

    return {
      totalCVs: safeSavedCVs.length || 0,
      totalCoverLetters: safeSavedCoverLetters.length || 0,
      uploadedCVs: safeUploadedCVs.length || 0,
      recentActivity: Math.max(
        safeSavedCVs.length || 0,
        safeSavedCoverLetters.length || 0,
        safeUploadedCVs.length || 0,
      ),
    }
  }

  // Auth kontrolü için ayrı useEffect
  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, loading, router])

  // Data loading için ayrı useEffect
  useEffect(() => {
    if (!isAuthenticated || loading || dataLoaded) return

    const loadDashboardData = async () => {
      try {
        setIsDataLoading(true)
        await Promise.all([getUploadedCVs(), getSavedCVs(), getBasicCoverLetters()])
        setDataLoaded(true)
      } catch (error) {
        console.error('Dashboard veri yükleme hatası:', error)
      } finally {
        setIsDataLoading(false)
      }
    }

    loadDashboardData()
  }, [isAuthenticated, loading, dataLoaded, getUploadedCVs, getSavedCVs, getBasicCoverLetters])

  const stats = getDashboardStats()

  // Loading durumunda spinner göster
  if (loading || isDataLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center space-y-4'>
          <LoadingSpinner size='lg' />
          <p className='text-muted-foreground'>{t('dashboard.loading', 'Dashboard yükleniyor...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='max-h-screen bg-background'>
      <div className='container mx-auto px-4 lg:px-8 py-6 space-y-6'>
        <PageHeader
          title={t('dashboard.title', 'Dashboard')}
          subtitle={t('dashboard.subtitle', 'ATS uyumlu CV ve ön yazı oluşturma platformunuz')}
          breadcrumbs={[
            { title: t('navigation.home', 'Ana Sayfa'), href: '/' },
            { title: t('dashboard.title', 'Dashboard') },
          ]}
        />

        {/* Welcome Section */}
        <Card>
          <CardContent className='p-6'>
            <div className='text-center space-y-2'>
              <h2 className='text-2xl font-bold text-foreground'>
                {t('dashboard.welcome', { name: user?.name || 'Kullanıcı' })}
              </h2>
              <p className='text-muted-foreground'>Profesyonel CV ve ön yazılarınızı oluşturun</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Button className='h-24 flex-col gap-3' variant='outline' onClick={() => router.push('/cv/ats/upload')}>
            <Upload className='h-8 w-8' />
            CV Yükle
          </Button>
          <Button className='h-24 flex-col gap-3' onClick={() => router.push('/cv')}>
            <FileText className='h-8 w-8' />
            CV Oluştur
          </Button>
          <Button className='h-24 flex-col gap-3' variant='outline' onClick={() => router.push('/cover-letter')}>
            <Wand2 className='h-8 w-8' />
            Ön Yazı Oluştur
          </Button>
        </div>

        {/* Recent Content */}
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Son CV'ler ({stats.uploadedCVs})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedCVs.length > 0 ? (
                <div className='space-y-3'>
                  {uploadedCVs.slice(0, 3).map((cv) => (
                    <div key={cv.id} className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                      <div>
                        <p className='font-medium text-foreground text-sm'>{cv.originalName}</p>
                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {new Date(cv.uploadDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {uploadedCVs.length > 3 && (
                    <Button variant='ghost' size='sm' className='w-full' onClick={() => router.push('/cv/ats')}>
                      Tümünü Gör ({uploadedCVs.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className='text-center py-8 text-muted-foreground'>
                  <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p className='text-sm'>Henüz CV yüklemediniz</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Wand2 className='h-5 w-5' />
                Son Ön Yazılar ({stats.totalCoverLetters})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {basicCoverLetters.length > 0 ? (
                <div className='space-y-3'>
                  {basicCoverLetters.slice(0, 3).map((letter: CoverLetterBasic) => (
                    <div key={letter.id} className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                      <div>
                        <p className='font-medium text-foreground text-sm'>{letter.positionTitle}</p>
                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {new Date(letter.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {basicCoverLetters.length > 3 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full'
                      onClick={() => router.push('/cover-letter/list')}
                    >
                      Tümünü Gör ({basicCoverLetters.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className='text-center py-8 text-muted-foreground'>
                  <Wand2 className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p className='text-sm'>Henüz ön yazı oluşturmadınız</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
