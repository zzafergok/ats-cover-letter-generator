// src/app/dashboard/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Upload, Wand2, Download, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCVStore } from '@/store/cvStore'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { Badge } from '@/components/core/badge'
import { CVUpload } from '@/components/ui/cv/CVUpload'
import { CVGeneratorForm } from '@/components/ui/cv/CVGeneratorForm'
import { CoverLetterGenerator } from '@/components/ui/cover-letter/CoverLetterGenerator'
import { ContentViewer } from '@/components/ui/common/ContentViewer'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, getProfile } = useAuthStore()
  const { uploadedCVs, savedCVs, getUploadedCVs, getSavedCVs, saveCV, deleteSavedCV, downloadCV } = useCVStore()
  const { savedCoverLetters, getSavedCoverLetters, saveCoverLetter, deleteSavedCoverLetter, downloadCoverLetter } =
    useCoverLetterStore()

  const [generatedCV, setGeneratedCV] = useState<string>('')
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('cv-upload')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Load user data and saved content
    getProfile()
    getUploadedCVs()
    getSavedCVs()
    getSavedCoverLetters()
  }, [isAuthenticated, router, getProfile, getUploadedCVs, getSavedCVs, getSavedCoverLetters])

  const handleCVUploadSuccess = () => {
    setActiveTab('cv-generate')
  }

  const handleCVGenerate = (content: string) => {
    setGeneratedCV(content)
    setActiveTab('cv-preview')
  }

  const handleCoverLetterGenerate = (content: string) => {
    setGeneratedCoverLetter(content)
    setActiveTab('cover-letter-preview')
  }

  const handleSaveCV = async (data: { title: string; content: string }) => {
    await saveCV(data)
  }

  const handleSaveCoverLetter = async (data: { title: string; content: string }) => {
    await saveCoverLetter(data)
  }

  const handleDownloadCV = async (id: string, format: 'pdf' | 'docx') => {
    await downloadCV(id, format)
  }

  const handleDownloadCoverLetter = async (id: string, format: 'pdf' | 'docx') => {
    await downloadCoverLetter(id, format)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto py-6 px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>ATS CV & Ön Yazı Oluşturucu</h1>
          <p className='text-muted-foreground mt-2'>
            Hoş geldiniz, {user?.firstName}! Profesyonel CV ve ön yazılarınızı oluşturun.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <TabsList className='grid w-full grid-cols-6'>
            <TabsTrigger value='cv-upload' className='flex items-center gap-2'>
              <Upload className='h-4 w-4' />
              CV Yükle
            </TabsTrigger>
            <TabsTrigger value='cv-generate' className='flex items-center gap-2'>
              <Wand2 className='h-4 w-4' />
              CV Oluştur
            </TabsTrigger>
            <TabsTrigger value='cv-preview' className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              CV Önizleme
            </TabsTrigger>
            <TabsTrigger value='cover-letter-generate' className='flex items-center gap-2'>
              <Wand2 className='h-4 w-4' />
              Ön Yazı
            </TabsTrigger>
            <TabsTrigger value='cover-letter-preview' className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              Ön Yazı Önizleme
            </TabsTrigger>
            <TabsTrigger value='saved' className='flex items-center gap-2'>
              <Download className='h-4 w-4' />
              Kayıtlı
            </TabsTrigger>
          </TabsList>

          {/* CV Upload Tab */}
          <TabsContent value='cv-upload' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <CVUpload onUploadSuccess={handleCVUploadSuccess} />

              {/* Uploaded CVs */}
              <Card>
                <CardHeader>
                  <CardTitle>Yüklenmiş CV&apos;ler</CardTitle>
                  <CardDescription>Daha önce yüklediğiniz CV dosyaları</CardDescription>
                </CardHeader>
                <CardContent>
                  {uploadedCVs.length === 0 ? (
                    <p className='text-sm text-muted-foreground text-center py-4'>Henüz CV yüklememişsiniz</p>
                  ) : (
                    <div className='space-y-3'>
                      {uploadedCVs.map((cv) => (
                        <div key={cv.id} className='flex items-center justify-between p-3 border rounded-lg'>
                          <div className='flex items-center gap-3'>
                            <FileText className='h-5 w-5 text-muted-foreground' />
                            <div>
                              <p className='font-medium'>{cv.fileName}</p>
                              <p className='text-xs text-muted-foreground'>
                                {new Date(cv.uploadedAt).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>
                          <Badge variant='secondary'>{cv.keywords.length} anahtar kelime</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CV Generate Tab */}
          <TabsContent value='cv-generate'>
            <CVGeneratorForm onGenerate={handleCVGenerate} />
          </TabsContent>

          {/* CV Preview Tab */}
          <TabsContent value='cv-preview'>
            {generatedCV ? (
              <ContentViewer content={generatedCV} title='Oluşturulan CV' type='cv' onSave={handleSaveCV} />
            ) : (
              <Card>
                <CardContent className='text-center py-8'>
                  <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <p className='text-lg font-medium'>Henüz CV oluşturulmadı</p>
                  <p className='text-muted-foreground'>CV oluşturmak için &quot;CV Oluştur&quot; sekmesini kullanın</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cover Letter Generate Tab */}
          <TabsContent value='cover-letter-generate'>
            <CoverLetterGenerator onGenerate={handleCoverLetterGenerate} />
          </TabsContent>

          {/* Cover Letter Preview Tab */}
          <TabsContent value='cover-letter-preview'>
            {generatedCoverLetter ? (
              <ContentViewer
                content={generatedCoverLetter}
                title='Oluşturulan Ön Yazı'
                type='cover-letter'
                onSave={handleSaveCoverLetter}
              />
            ) : (
              <Card>
                <CardContent className='text-center py-8'>
                  <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <p className='text-lg font-medium'>Henüz ön yazı oluşturulmadı</p>
                  <p className='text-muted-foreground'>
                    Ön yazı oluşturmak için &quot;Ön Yazı&quot; sekmesini kullanın
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Saved Content Tab */}
          <TabsContent value='saved' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              {/* Saved CVs */}
              <Card>
                <CardHeader>
                  <CardTitle>Kayıtlı CV&apos;ler</CardTitle>
                  <CardDescription>Maksimum 5 CV kaydedebilirsiniz ({savedCVs.length}/5)</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedCVs.length === 0 ? (
                    <p className='text-sm text-muted-foreground text-center py-4'>Henüz kayıtlı CV&apost;iniz yok</p>
                  ) : (
                    <div className='space-y-3'>
                      {savedCVs.map((cv) => (
                        <div key={cv.id} className='border rounded-lg p-4'>
                          <div className='flex items-start justify-between mb-2'>
                            <h4 className='font-medium'>{cv.title}</h4>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => deleteSavedCV(cv.id)}
                              className='text-destructive hover:text-destructive'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                          <p className='text-xs text-muted-foreground mb-3'>
                            {new Date(cv.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                          <div className='flex gap-2'>
                            <Button variant='outline' size='sm' onClick={() => handleDownloadCV(cv.id, 'pdf')}>
                              PDF İndir
                            </Button>
                            <Button variant='outline' size='sm' onClick={() => handleDownloadCV(cv.id, 'docx')}>
                              DOCX İndir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Saved Cover Letters */}
              <Card>
                <CardHeader>
                  <CardTitle>Kayıtlı Ön Yazılar</CardTitle>
                  <CardDescription>Maksimum 5 ön yazı kaydedebilirsiniz ({savedCoverLetters.length}/5)</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedCoverLetters.length === 0 ? (
                    <p className='text-sm text-muted-foreground text-center py-4'>Henüz kayıtlı ön yazınız yok</p>
                  ) : (
                    <div className='space-y-3'>
                      {savedCoverLetters.map((letter) => (
                        <div key={letter.id} className='border rounded-lg p-4'>
                          <div className='flex items-start justify-between mb-2'>
                            <h4 className='font-medium'>{letter.title}</h4>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => deleteSavedCoverLetter(letter.id)}
                              className='text-destructive hover:text-destructive'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                          <p className='text-xs text-muted-foreground mb-3'>
                            {new Date(letter.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDownloadCoverLetter(letter.id, 'pdf')}
                            >
                              PDF İndir
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDownloadCoverLetter(letter.id, 'docx')}
                            >
                              DOCX İndir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
