'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Save, FileText } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/core/dialog'
import { LoadingSpinner } from '@/components/core/loading-spinner'

import { TemplateSelector } from '@/components/ui/template/TemplateSelector'
import { TemplateForm } from '@/components/ui/template/TemplateForm'
import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'

import { useTemplateSelectors, useTemplateActions } from '@/store/templateStore'
import { useGenerateCoverLetter } from '@/hooks/useCoverLetterTemplates'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { type GenerateCoverLetterFromTemplateData } from '@/lib/api/api'

export default function TemplateCoverLetterPage() {
  const router = useRouter()

  const { selectedTemplate, selectedTemplateDetail, generatedContent, isGenerating, error } = useTemplateSelectors()

  const { setSelectedTemplate, clearGeneratedContent } = useTemplateActions()

  const generateMutation = useGenerateCoverLetter()
  const { saveCoverLetter } = useCoverLetterStore()

  const [activeTab, setActiveTab] = useState<string>('select')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setActiveTab('form')
  }

  const handleFormSubmit = async (formData: GenerateCoverLetterFromTemplateData) => {
    try {
      const result = await generateMutation.mutateAsync(formData)
      if (result) {
        setActiveTab('preview')
      }
    } catch (error) {
      console.error('Generation error:', error)
    }
  }

  const handlePreview = (formData: GenerateCoverLetterFromTemplateData) => {
    console.log('🚀 ~ handlePreview ~ formData:', formData)
    setShowPreview(true)
  }

  const handleSave = async () => {
    if (!generatedContent) return

    try {
      setIsSaving(true)
      await saveCoverLetter({
        title: `${generatedContent.generatedFor.companyName} - ${generatedContent.generatedFor.positionTitle}`,
        content: generatedContent.content,
        category: generatedContent.templateUsed.category,
        positionTitle: generatedContent.generatedFor.positionTitle,
        companyName: generatedContent.generatedFor.companyName,
        contactPerson: generatedContent.generatedFor.contactPerson,
      })

      // Başarı durumunda dashboard'a yönlendir
      router.push('/cover-letter')
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (!generatedContent) return

    try {
      setIsDownloading(true)
      // Download işlemi burada yapılacak
      const blob = new Blob([generatedContent.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cover-letter-${generatedContent.generatedFor.companyName}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleBackToDashboard = () => {
    clearGeneratedContent()
    router.push('/cover-letter')
  }

  const handleRestart = () => {
    clearGeneratedContent()
    setSelectedTemplate(null)
    setActiveTab('select')
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Template ile Cover Letter Oluştur' />
        <Button variant='outline' onClick={handleBackToDashboard}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Cover Letter Dashboard
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='select' disabled={activeTab === 'preview'}>
            1. Template Seç
          </TabsTrigger>
          <TabsTrigger value='form' disabled={!selectedTemplate || activeTab === 'preview'}>
            2. Bilgileri Doldur
          </TabsTrigger>
          <TabsTrigger value='preview' disabled={!generatedContent}>
            3. Önizleme & İndirme
          </TabsTrigger>
        </TabsList>

        <TabsContent value='select' className='space-y-6'>
          <TemplateSelector onTemplateSelect={handleTemplateSelect} />
        </TabsContent>

        <TabsContent value='form' className='space-y-6'>
          {selectedTemplate && <TemplateForm onSubmit={handleFormSubmit} onPreview={handlePreview} />}
        </TabsContent>

        <TabsContent value='preview' className='space-y-6'>
          {generatedContent && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Content Preview */}
              <div className='lg:col-span-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <FileText className='h-5 w-5' />
                      <span>Cover Letter Önizleme</span>
                    </CardTitle>
                    <CardDescription>Oluşturulan cover letter&apos;ınızın son hali</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContentViewer
                      content={generatedContent.content}
                      title={generatedContent.templateUsed?.title || 'Cover Letter'}
                      type='cover-letter'
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Actions & Info */}
              <div className='space-y-6'>
                {/* Generation Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Oluşturma Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div>
                      <p className='text-sm font-medium'>Template</p>
                      <p className='text-sm text-muted-foreground'>{generatedContent.templateUsed.title}</p>
                    </div>
                    <div>
                      <p className='text-sm font-medium'>Şirket</p>
                      <p className='text-sm text-muted-foreground'>{generatedContent.generatedFor.companyName}</p>
                    </div>
                    <div>
                      <p className='text-sm font-medium'>Pozisyon</p>
                      <p className='text-sm text-muted-foreground'>{generatedContent.generatedFor.positionTitle}</p>
                    </div>
                    <div>
                      <p className='text-sm font-medium'>İletişim Kişisi</p>
                      <p className='text-sm text-muted-foreground'>{generatedContent.generatedFor.contactPerson}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>İstatistikler</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Kelime Sayısı</span>
                      <span className='text-sm font-medium'>{generatedContent.statistics.wordCount}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Karakter Sayısı</span>
                      <span className='text-sm font-medium'>{generatedContent.statistics.characterCount}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Tahmini Okuma Süresi</span>
                      <span className='text-sm font-medium'>{generatedContent.statistics.estimatedReadingTime} dk</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <Button onClick={handleSave} disabled={isSaving} className='w-full'>
                      {isSaving ? (
                        <>
                          <LoadingSpinner size='sm' className='mr-2' />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className='h-4 w-4 mr-2' />
                          Kaydet
                        </>
                      )}
                    </Button>

                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        variant='outline'
                        onClick={() => handleDownload('pdf')}
                        disabled={isDownloading}
                        size='sm'
                      >
                        {isDownloading ? (
                          <LoadingSpinner size='sm' />
                        ) : (
                          <>
                            <Download className='h-3 w-3 mr-1' />
                            PDF
                          </>
                        )}
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => handleDownload('docx')}
                        disabled={isDownloading}
                        size='sm'
                      >
                        {isDownloading ? (
                          <LoadingSpinner size='sm' />
                        ) : (
                          <>
                            <Download className='h-3 w-3 mr-1' />
                            DOCX
                          </>
                        )}
                      </Button>
                    </div>

                    <Button variant='outline' onClick={handleRestart} className='w-full'>
                      Yeni Cover Letter Oluştur
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className='border-destructive'>
              <CardContent className='pt-6'>
                <p className='text-sm text-destructive'>{error}</p>
                <Button variant='outline' onClick={handleRestart} className='mt-4'>
                  Tekrar Dene
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isGenerating && (
            <Card>
              <CardContent className='pt-6 text-center'>
                <LoadingSpinner size='lg' className='mx-auto mb-4' />
                <p className='text-muted-foreground'>Cover letter oluşturuluyor...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Template Önizleme</DialogTitle>
            <DialogDescription>
              {selectedTemplateDetail?.title || 'Template'} önizlemesini kontrol edin
            </DialogDescription>
          </DialogHeader>
          {selectedTemplateDetail && (
            <ContentViewer
              content={selectedTemplateDetail?.content || ''}
              title={selectedTemplateDetail?.title || 'Template Önizleme'}
              type='cover-letter'
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
