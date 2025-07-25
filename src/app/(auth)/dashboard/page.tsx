'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { FileText, Upload, Wand2, Download, Trash2, Plus, Eye, Save, Calendar, TrendingUp } from 'lucide-react'

import { useCVStore } from '@/store/cvStore'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import type { CoverLetterBasic } from '@/types/api.types'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { Badge } from '@/components/core/badge'
import { LoadingSpinner } from '@/components/core/loading-spinner'

import { CVUpload } from '@/components/ui/cv/CVUpload'
import { CVGeneratorForm } from '@/components/ui/cv/CVGeneratorForm'
import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { useAuth } from '@/providers/AuthProvider'

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const { user, isAuthenticated, loading } = useAuth()
  const {
    uploadedCVs = [],
    savedCVs = [],
    getUploadedCVs,
    getSavedCVs,
    saveCV,
    deleteSavedCV,
    downloadSavedCV,
    isLoading: cvLoading,
  } = useCVStore()

  const {
    basicCoverLetters = [],
    getBasicCoverLetters,
    deleteBasicCoverLetter,
    downloadBasicCoverLetterPdf,
    isLoading: _coverLetterLoading,
  } = useCoverLetterStore()

  const [generatedCV, setGeneratedCV] = useState<string>('')
  // const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

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

  const handleCVUploadSuccess = () => {
    setActiveTab('cv-generate')
  }

  const handleCVGenerate = (content: string) => {
    setGeneratedCV(content)
    setActiveTab('cv-preview')
  }

  // const handleCoverLetterGenerate = (content: string) => {
  //   setGeneratedCoverLetter(content)
  //   setActiveTab('cover-letter-preview')
  // }

  const handleSaveCV = async () => {
    if (!generatedCV) return

    try {
      await saveCV({
        title: `CV - ${new Date().toLocaleDateString('tr-TR')}`,
        content: generatedCV,
        cvType: 'ATS_OPTIMIZED',
      })
      setActiveTab('saved-content')
    } catch (error) {
      console.error('CV kaydetme hatası:', error)
    }
  }

  // const handleSaveCoverLetter = async () => {
  //   if (!generatedCoverLetter) return

  //   try {
  //     await saveCoverLetter({
  //       title: `Ön Yazı - ${new Date().toLocaleDateString('tr-TR')}`,
  //       content: generatedCoverLetter,
  //       category: 'GENERAL',
  //       positionTitle: 'Genel Pozisyon',
  //       companyName: 'Şirket',
  //     })
  //     setActiveTab('saved-content')
  //   } catch (error) {
  //     console.error('Ön yazı kaydetme hatası:', error)
  //   }
  // }

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
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <PageHeader
          title={t('dashboard.title', 'Dashboard')}
          subtitle={t('dashboard.subtitle', 'ATS uyumlu CV ve ön yazı oluşturma platformunuz')}
          breadcrumbs={[
            { title: t('navigation.home', 'Ana Sayfa'), href: '/' },
            { title: t('dashboard.title', 'Dashboard') },
          ]}
          actions={[
            {
              label: 'Yeni CV Yükle',
              onClick: () => setActiveTab('cv-upload'),
              icon: <Upload className='h-4 w-4' />,
              variant: 'outline',
            },
            {
              label: 'CV Oluştur',
              onClick: () => setActiveTab('cv-generate'),
              icon: <Plus className='h-4 w-4' />,
            },
          ]}
        />

        {/* Welcome Section */}
        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-foreground'>
                {t('dashboard.welcome', { name: user?.name || 'Kullanıcı' })}
              </h2>
              <p className='text-muted-foreground mt-1'>
                Profesyonel CV ve ön yazılarınızı oluşturarak iş başvurularınızda öne çıkın
              </p>
            </div>
            <div className='hidden md:flex items-center gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{stats.totalCVs}</div>
                <div className='text-sm text-muted-foreground'>Kayıtlı CV</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600 dark:text-green-400'>{stats.totalCoverLetters}</div>
                <div className='text-sm text-muted-foreground'>Ön Yazı</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>{stats.uploadedCVs}</div>
                <div className='text-sm text-muted-foreground'>Yüklenen</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Toplam CV</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-foreground'>{stats.totalCVs}</div>
              <p className='text-xs text-muted-foreground'>Kayıtlı CV sayınız</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Ön Yazılar</CardTitle>
              <Wand2 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-foreground'>{stats.totalCoverLetters}</div>
              <p className='text-xs text-muted-foreground'>Hazır ön yazı sayınız</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Yüklenen CV</CardTitle>
              <Upload className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-foreground'>{stats.uploadedCVs}</div>
              <p className='text-xs text-muted-foreground'>Analiz için yüklenen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Son Aktivite</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-foreground'>{stats.recentActivity}</div>
              <p className='text-xs text-muted-foreground'>Bu ay oluşturulan</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card>
          <CardContent className='p-6'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
              <TabsList className='grid w-full grid-cols-2 lg:grid-cols-6'>
                <TabsTrigger value='overview'>Genel Bakış</TabsTrigger>
                <TabsTrigger value='cv-upload'>CV Yükle</TabsTrigger>
                <TabsTrigger value='cv-generate'>CV Oluştur</TabsTrigger>
                <TabsTrigger value='cover-letter'>Ön Yazı</TabsTrigger>
                <TabsTrigger value='cv-preview'>Önizleme</TabsTrigger>
                <TabsTrigger value='saved-content'>Kayıtlı İçerik</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-3'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Son CV&apos;ler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {savedCVs.length > 0 ? (
                        <div className='space-y-3'>
                          {savedCVs.slice(0, 3).map((cv) => (
                            <div key={cv.id} className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                              <div>
                                <p className='font-medium text-foreground'>{cv.title}</p>
                                <p className='text-sm text-muted-foreground flex items-center gap-1'>
                                  <Calendar className='h-3 w-3' />
                                  {new Date(cv.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                              </div>
                              <div className='flex gap-2'>
                                <Button size='sm' variant='outline'>
                                  <Eye className='h-3 w-3' />
                                </Button>
                                <Button size='sm' variant='outline' onClick={() => downloadSavedCV(cv.id)}>
                                  <Download className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-muted-foreground'>
                          <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                          <p>Henüz kayıtlı CV bulunmuyor</p>
                          <Button className='mt-3' onClick={() => setActiveTab('cv-generate')} size='sm'>
                            İlk CV&apos;nizi Oluşturun
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Wand2 className='h-5 w-5' />
                        Son Ön Yazılar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {basicCoverLetters.length > 0 ? (
                        <div className='space-y-3'>
                          {basicCoverLetters.slice(0, 3).map((letter: CoverLetterBasic) => (
                            <div
                              key={letter.id}
                              className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
                            >
                              <div>
                                <p className='font-medium text-foreground'>{letter.positionTitle}</p>
                                <p className='text-sm text-muted-foreground flex items-center gap-1'>
                                  <Calendar className='h-3 w-3' />
                                  {new Date(letter.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                              </div>
                              <div className='flex gap-2'>
                                <Button size='sm' variant='outline'>
                                  <Eye className='h-3 w-3' />
                                </Button>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => downloadBasicCoverLetterPdf(letter.id)}
                                >
                                  <Download className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-muted-foreground'>
                          <Wand2 className='h-12 w-12 mx-auto mb-4 opacity-50' />
                          <p>Henüz kayıtlı ön yazı bulunmuyor</p>
                          <Button className='mt-3' onClick={() => setActiveTab('cover-letter')} size='sm'>
                            İlk Ön Yazınızı Oluşturun
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Upload className='h-5 w-5' />
                        Yüklenmiş CV&apos;ler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* {uploadedCVs.length > 0 ? (
                        <div className='space-y-3'>
                          {uploadedCVs.slice(0, 3).map((cv) => (
                            <div key={cv.id} className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                              <div className='flex-1'>
                                <h4 className='text-sm font-medium'>{cv.originalName}</h4>
                                <div className='flex items-center gap-2 mt-1'>
                                  <p className='text-xs text-muted-foreground'>
                                    {cv.uploadDate ? new Date(cv.uploadDate).toLocaleDateString('tr-TR') : ''}
                                  </p>
                                  <Badge variant='outline' className='text-xs'>
                                    {cv.mimeType === 'application/pdf'
                                      ? 'PDF'
                                      : cv.mimeType?.includes('word')
                                        ? 'DOC'
                                        : 'Dosya'}
                                  </Badge>
                                  {cv.fileSize && (
                                    <span className='text-xs text-muted-foreground'>
                                      {(cv.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button size='sm' variant='outline'>
                                <Eye className='h-3 w-3' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-muted-foreground'>
                          <Upload className='h-12 w-12 mx-auto mb-4 opacity-50' />
                          <p>Henüz CV yüklenmemiş</p>
                          <Button className='mt-3' onClick={() => setActiveTab('cv-upload')} size='sm'>
                            İlk CV&apos;nizi Yükleyin
                          </Button>
                        </div>
                      )} */}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                    <CardDescription>En sık kullanılan özelliklerle hızlı başlayın</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-4 md:grid-cols-3'>
                      <Button
                        className='h-24 flex-col gap-2'
                        variant='outline'
                        onClick={() => setActiveTab('cv-upload')}
                      >
                        <Upload className='h-6 w-6' />
                        CV Yükle
                      </Button>
                      <Button
                        className='h-24 flex-col gap-2'
                        variant='outline'
                        onClick={() => setActiveTab('cv-generate')}
                      >
                        <FileText className='h-6 w-6' />
                        CV Oluştur
                      </Button>
                      <Button
                        className='h-24 flex-col gap-2'
                        variant='outline'
                        onClick={() => setActiveTab('cover-letter')}
                      >
                        <Wand2 className='h-6 w-6' />
                        Ön Yazı Oluştur
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='cv-upload'>
                <CVUpload onUploadSuccess={handleCVUploadSuccess} />
              </TabsContent>

              <TabsContent value='cv-generate'>
                <CVGeneratorForm onGenerate={handleCVGenerate} />
              </TabsContent>

              <TabsContent value='cover-letter'>boş</TabsContent>

              <TabsContent value='cv-preview'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                      <span className='flex items-center gap-2'>
                        <Eye className='h-5 w-5' />
                        CV Önizleme
                      </span>
                      {generatedCV && (
                        <div className='flex gap-2'>
                          <Button variant='outline' onClick={handleSaveCV} disabled={cvLoading}>
                            {cvLoading ? <LoadingSpinner size='sm' /> : <Save className='h-4 w-4' />}
                            Kaydet
                          </Button>
                          <Button
                            onClick={() => {
                              /* Generated CV download logic needs implementation */
                            }}
                            disabled={cvLoading}
                          >
                            <Download className='h-4 w-4' />
                            İndir
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedCV ? (
                      <ContentViewer content={generatedCV} title='CV Önizleme' type='cv' />
                    ) : (
                      <div className='text-center py-12 text-muted-foreground'>
                        <FileText className='h-16 w-16 mx-auto mb-4 opacity-50' />
                        <h3 className='text-lg font-medium mb-2 text-foreground'>Henüz CV oluşturulmamış</h3>
                        <p className='mb-4'>Önizlemek için önce bir CV oluşturun</p>
                        <Button onClick={() => setActiveTab('cv-generate')}>CV Oluşturmaya Başla</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='cover-letter-preview'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                      <span className='flex items-center gap-2'>
                        <Eye className='h-5 w-5' />
                        Ön Yazı Önizleme
                      </span>
                      {/* {generatedCoverLetter && (
                        <div className='flex gap-2'>
                          <Button variant='outline' onClick={handleSaveCoverLetter} disabled={coverLetterLoading}>
                            {coverLetterLoading ? <LoadingSpinner size='sm' /> : <Save className='h-4 w-4' />}
                            Kaydet
                          </Button>
                          <Button
                            onClick={() => downloadBasicCoverLetterPdf(generatedCoverLetter, 'cover-letter', 'pdf')}
                            disabled={coverLetterLoading}
                          >
                            <Download className='h-4 w-4' />
                            İndir
                          </Button>
                        </div>
                      )} */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* {generatedCoverLetter ? (
                      <ContentViewer content={generatedCoverLetter} title='Ön Yazı Önizleme' type='cover-letter' />
                    ) : (
                      <div className='text-center py-12 text-muted-foreground'>
                        <Wand2 className='h-16 w-16 mx-auto mb-4 opacity-50' />
                        <h3 className='text-lg font-medium mb-2 text-foreground'>Henüz ön yazı oluşturulmamış</h3>
                        <p className='mb-4'>Önizlemek için önce bir ön yazı oluşturun</p>
                        <Button onClick={() => setActiveTab('cover-letter')}>Ön Yazı Oluşturmaya Başla</Button>
                      </div>
                    )} */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='saved-content'>
                <div className='grid gap-6 lg:grid-cols-2'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Kayıtlı CV&apos;ler ({savedCVs.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {savedCVs.length > 0 ? (
                        <div className='space-y-4'>
                          {savedCVs.map((cv) => (
                            <div
                              key={cv.id}
                              className='flex items-center justify-between p-4 border border-border rounded-lg'
                            >
                              <div className='flex-1'>
                                <h4 className='font-medium text-foreground'>{cv.title}</h4>
                                <div className='flex items-center gap-4 mt-1 text-sm text-muted-foreground'>
                                  <span className='flex items-center gap-1'>
                                    <Calendar className='h-3 w-3' />
                                    {new Date(cv.createdAt).toLocaleDateString('tr-TR')}
                                  </span>
                                  <Badge variant='secondary'>{cv.cvType}</Badge>
                                </div>
                              </div>
                              <div className='flex gap-2'>
                                <Button size='sm' variant='outline' onClick={() => downloadSavedCV(cv.id)}>
                                  <Download className='h-3 w-3' />
                                </Button>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => deleteSavedCV(cv.id)}
                                  className='text-destructive hover:text-destructive'
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-muted-foreground'>
                          <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                          <p>Henüz kayıtlı CV bulunmuyor</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Wand2 className='h-5 w-5' />
                        Kayıtlı Ön Yazılar ({basicCoverLetters.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {basicCoverLetters.length > 0 ? (
                        <div className='space-y-4'>
                          {basicCoverLetters.map((letter: CoverLetterBasic) => (
                            <div
                              key={letter.id}
                              className='flex items-center justify-between p-4 border border-border rounded-lg'
                            >
                              <div className='flex-1'>
                                <h4 className='font-medium text-foreground'>{letter.positionTitle}</h4>
                                <div className='flex items-center gap-4 mt-1 text-sm text-muted-foreground'>
                                  <span className='flex items-center gap-1'>
                                    <Calendar className='h-3 w-3' />
                                    {new Date(letter.createdAt).toLocaleDateString('tr-TR')}
                                  </span>
                                  <Badge variant='secondary'>{letter.language}</Badge>
                                </div>
                                <p className='text-sm text-muted-foreground mt-1'>
                                  {letter.positionTitle} - {letter.companyName}
                                </p>
                              </div>
                              <div className='flex gap-2'>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => downloadBasicCoverLetterPdf(letter.id)}
                                >
                                  <Download className='h-3 w-3' />
                                </Button>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => deleteBasicCoverLetter(letter.id)}
                                  className='text-destructive hover:text-destructive'
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-muted-foreground'>
                          <Wand2 className='h-12 w-12 mx-auto mb-4 opacity-50' />
                          <p>Henüz kayıtlı ön yazı bulunmuyor</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
