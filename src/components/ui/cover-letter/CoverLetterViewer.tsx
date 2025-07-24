'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Download, Save, Copy, Check, Edit, Mail, Eye, Star, Briefcase } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Textarea } from '@/components/core/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/core/dialog'
import { Badge } from '@/components/core/badge'
import { Separator } from '@/components/core/separator'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { ScrollArea } from '@/components/core/scroll-area'
import { useClipboard } from '@/hooks/useClipboard'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import type { CoverLetterBasic, CoverLetterDetailed } from '@/types/api.types'

// Types
type CoverLetterType = 'basic' | 'detailed'
type ViewMode = 'preview' | 'edit' | 'analysis'

interface CoverLetterViewerProps {
  coverLetter: CoverLetterBasic | CoverLetterDetailed
  type: CoverLetterType
  onEdit?: (content: string) => void
  onUpdate?: () => void
  className?: string
  readonly?: boolean
}

// Custom hooks
const useContentStats = (content: string) => {
  return useMemo(() => {
    const wordCount = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const characterCount = content.length
    const paragraphCount = content.split('\n\n').filter((p) => p.trim().length > 0).length
    const estimatedReadTime = Math.ceil(wordCount / 200) // 200 words per minute
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0).length

    return {
      wordCount,
      characterCount,
      paragraphCount,
      estimatedReadTime,
      sentences,
    }
  }, [content])
}

// Content renderer with better formatting for cover letters
const CoverLetterRenderer: React.FC<{ content: string; type: CoverLetterType }> = ({ content, type: _type }) => {
  const formattedContent = useMemo(() => {
    // Format the cover letter content
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') // Italic
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-primary">$1</h1>') // H1
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 text-primary">$1</h2>') // H2
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>') // H3
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>') // Bullet points
      .replace(/\n\n/g, '</p><p class="mb-4">') // Paragraphs
      .replace(/^\s*([^<])/gm, '<p class="mb-4">$1') // Start paragraphs
      .replace(/([^>])\s*$/gm, '$1</p>') // End paragraphs
  }, [content])

  return (
    <div className='prose prose-sm max-w-none dark:prose-invert'>
      <div className='leading-relaxed text-foreground' dangerouslySetInnerHTML={{ __html: formattedContent }} />
    </div>
  )
}

// Analysis component for detailed insights
const CoverLetterAnalysis: React.FC<{
  coverLetter: CoverLetterBasic | CoverLetterDetailed
  stats: ReturnType<typeof useContentStats>
}> = ({ coverLetter, stats }) => {
  const analysisData = useMemo(() => {
    const isDetailed = 'whyPosition' in coverLetter
    const hasPersonalization = coverLetter.companyName && coverLetter.positionTitle
    const hasSpecificSkills = isDetailed && Boolean((coverLetter as CoverLetterDetailed).whyPosition)
    const hasExperience = isDetailed && Boolean((coverLetter as CoverLetterDetailed).whyCompany)

    return {
      isDetailed,
      hasPersonalization,
      hasSpecificSkills,
      hasExperience,
      completenessScore: Math.round(
        (Number(hasPersonalization) +
          Number(hasSpecificSkills) +
          Number(hasExperience) +
          Number(stats.wordCount >= 200)) *
          25,
      ),
    }
  }, [coverLetter, stats])

  return (
    <div className='space-y-6'>
      {/* Quick Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'>
          <CardContent className='p-4 text-center'>
            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{stats.wordCount}</div>
            <div className='text-sm text-blue-700 dark:text-blue-300'>Kelime</div>
          </CardContent>
        </Card>

        <Card className='bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'>
          <CardContent className='p-4 text-center'>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>{stats.paragraphCount}</div>
            <div className='text-sm text-green-700 dark:text-green-300'>Paragraf</div>
          </CardContent>
        </Card>

        <Card className='bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'>
          <CardContent className='p-4 text-center'>
            <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>{stats.estimatedReadTime}</div>
            <div className='text-sm text-purple-700 dark:text-purple-300'>Dk Okuma</div>
          </CardContent>
        </Card>

        <Card className='bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'>
          <CardContent className='p-4 text-center'>
            <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
              {analysisData.completenessScore}%
            </div>
            <div className='text-sm text-orange-700 dark:text-orange-300'>Tamamlanma</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5' />
            İçerik Analizi
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4'>
            <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
              <span className='text-sm'>Kişiselleştirme</span>
              <Badge variant={analysisData.hasPersonalization ? 'default' : 'secondary'}>
                {analysisData.hasPersonalization ? '✓ Var' : '✗ Yok'}
              </Badge>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
              <span className='text-sm'>Yeterli Kelime Sayısı (200+)</span>
              <Badge variant={stats.wordCount >= 200 ? 'default' : 'secondary'}>
                {stats.wordCount >= 200 ? '✓ Yeterli' : '✗ Yetersiz'}
              </Badge>
            </div>

            {analysisData.isDetailed && (
              <>
                <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
                  <span className='text-sm'>Özel Yetenekler</span>
                  <Badge variant={analysisData.hasSpecificSkills ? 'default' : 'secondary'}>
                    {analysisData.hasSpecificSkills ? '✓ Belirtilmiş' : '✗ Belirtilmemiş'}
                  </Badge>
                </div>

                <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
                  <span className='text-sm'>İlgili Deneyim</span>
                  <Badge variant={analysisData.hasExperience ? 'default' : 'secondary'}>
                    {analysisData.hasExperience ? '✓ Açıklanmış' : '✗ Açıklanmamış'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cover Letter Details */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Briefcase className='h-5 w-5' />
            Ön Yazı Detayları
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4'>
            <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
              <span className='text-sm font-medium'>Şirket</span>
              <span className='text-sm'>{coverLetter.companyName}</span>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
              <span className='text-sm font-medium'>Pozisyon</span>
              <span className='text-sm'>{coverLetter.positionTitle}</span>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
              <span className='text-sm font-medium'>Tür</span>
              <Badge variant='outline'>{analysisData.isDetailed ? 'Detaylı' : 'Temel'}</Badge>
            </div>

            {analysisData.isDetailed && (
              <div className='p-3 rounded-lg bg-muted/50'>
                <div className='text-sm font-medium mb-2'>Ek Bilgiler</div>
                <div className='text-xs text-muted-foreground'>
                  {(coverLetter as CoverLetterDetailed).whyPosition && 'Pozisyon tercihi açıklandı'}
                  {(coverLetter as CoverLetterDetailed).whyCompany && ', Şirket tercihi açıklandı'}
                  {(coverLetter as CoverLetterDetailed).workMotivation && ', İş motivasyonu belirtildi'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CoverLetterViewer({
  coverLetter,
  type,
  onEdit,
  onUpdate,
  className,
  readonly = false,
}: CoverLetterViewerProps) {
  // State management
  const [editedContent, setEditedContent] = useState(coverLetter.content || coverLetter.generatedContent || '')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)

  // Store actions
  const {
    updateBasicCoverLetter,
    updateDetailedCoverLetter,
    downloadBasicCoverLetterPdf,
    downloadDetailedCoverLetterPdf,
    isLoading,
  } = useCoverLetterStore()

  // Custom hooks
  const { isCopied, copyToClipboard } = useClipboard()
  const contentStats = useContentStats(editedContent || '')

  // Computed values
  const typeConfig = useMemo(
    () => ({
      icon: <Mail className='h-4 w-4' />,
      label: type === 'basic' ? 'Temel Ön Yazı' : 'Detaylı Ön Yazı',
      description: type === 'basic' ? 'Hızlı başvuru için temel ön yazı' : 'Kapsamlı başvuru için detaylı ön yazı',
      saveLabel: type === 'basic' ? 'Temel Ön Yazıyı Güncelle' : 'Detaylı Ön Yazıyı Güncelle',
      downloadLabel: type === 'basic' ? 'Temel Ön Yazıyı İndir' : 'Detaylı Ön Yazıyı İndir',
    }),
    [type],
  )

  // Event handlers
  const handleContentChange = useCallback(
    (newContent: string) => {
      setEditedContent(newContent)
      onEdit?.(newContent)
    },
    [onEdit],
  )

  const handleSave = useCallback(async () => {
    const currentContent = coverLetter.content || coverLetter.generatedContent || ''
    if (editedContent === currentContent) return

    try {
      if (type === 'basic') {
        await updateBasicCoverLetter(coverLetter.id, {
          updatedContent: editedContent,
        })
      } else {
        await updateDetailedCoverLetter(coverLetter.id, {
          updatedContent: editedContent,
        })
      }

      onUpdate?.()
      setSaveDialogOpen(false)
    } catch (error) {
      console.error('Save error:', error)
    }
  }, [
    editedContent,
    coverLetter.content,
    coverLetter.generatedContent,
    coverLetter.id,
    type,
    updateBasicCoverLetter,
    updateDetailedCoverLetter,
    onUpdate,
  ])

  const handleDownload = useCallback(async () => {
    try {
      if (type === 'basic') {
        await downloadBasicCoverLetterPdf(coverLetter.id)
      } else {
        await downloadDetailedCoverLetterPdf(coverLetter.id)
      }
      setDownloadDialogOpen(false)
    } catch (error) {
      console.error('Download error:', error)
    }
  }, [coverLetter.id, type, downloadBasicCoverLetterPdf, downloadDetailedCoverLetterPdf])

  const handleCopy = useCallback(() => {
    copyToClipboard(editedContent || '')
  }, [copyToClipboard, editedContent])

  // Content validation
  const content = coverLetter.content || coverLetter.generatedContent || ''
  const hasContent = content.trim().length > 0

  if (!hasContent) {
    return (
      <Card className={className}>
        <CardContent className='py-12'>
          <Alert>
            <AlertDescription className='text-center'>Bu ön yazı henüz içerik içermiyor.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-3'>
            <div className='mt-1'>{typeConfig.icon}</div>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                {coverLetter.companyName} - {coverLetter.positionTitle}
                <Badge variant='secondary' className='text-xs'>
                  {typeConfig.label}
                </Badge>
              </CardTitle>
              <CardDescription>{typeConfig.description}</CardDescription>

              {/* Metadata */}
              <div className='flex items-center gap-4 text-xs text-muted-foreground mt-2'>
                <span>Oluşturulma: {new Date(coverLetter.createdAt).toLocaleDateString('tr-TR')}</span>
                {coverLetter.updatedAt && (
                  <span>Güncelleme: {new Date(coverLetter.updatedAt).toLocaleDateString('tr-TR')}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex items-center gap-2'>
            {!readonly && (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                >
                  <Edit className='h-4 w-4 mr-1' />
                  {viewMode === 'edit' ? 'Görüntüle' : 'Düzenle'}
                </Button>
                <Button variant='outline' size='sm' onClick={handleCopy} disabled={isCopied}>
                  {isCopied ? <Check className='h-4 w-4 mr-1' /> : <Copy className='h-4 w-4 mr-1' />}
                  {isCopied ? 'Kopyalandı' : 'Kopyala'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content statistics */}
        <div className='flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t'>
          <span>{contentStats.wordCount} kelime</span>
          <span>{contentStats.characterCount} karakter</span>
          <span>{contentStats.paragraphCount} paragraf</span>
          <span>~{contentStats.estimatedReadTime} dk okuma</span>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Content tabs for different view modes */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='preview' className='flex items-center gap-2'>
              <Eye className='h-4 w-4' />
              Önizleme
            </TabsTrigger>
            {!readonly && (
              <TabsTrigger value='edit' className='flex items-center gap-2'>
                <Edit className='h-4 w-4' />
                Düzenle
              </TabsTrigger>
            )}
            <TabsTrigger value='analysis' className='flex items-center gap-2'>
              <Star className='h-4 w-4' />
              Analiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value='preview' className='mt-4'>
            <ScrollArea className='h-[500px] w-full rounded-md border p-4'>
              <CoverLetterRenderer content={editedContent || ''} type={type} />
            </ScrollArea>
          </TabsContent>

          {!readonly && (
            <TabsContent value='edit' className='mt-4'>
              <Textarea
                value={editedContent || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={20}
                className='font-mono text-sm'
                placeholder='Ön yazı içeriğinizi buraya yazın...'
              />
            </TabsContent>
          )}

          <TabsContent value='analysis' className='mt-4'>
            <CoverLetterAnalysis coverLetter={coverLetter} stats={contentStats} />
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        {!readonly && (
          <>
            <Separator />
            <div className='flex flex-wrap gap-2'>
              {/* Save button */}
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant='outline' disabled={editedContent === content}>
                    <Save className='h-4 w-4 mr-2' />
                    Değişiklikleri Kaydet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{typeConfig.saveLabel}</DialogTitle>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <p className='text-sm text-muted-foreground'>Yaptığınız değişiklikler kaydedilecek.</p>
                    <Button onClick={handleSave} disabled={isLoading} className='w-full'>
                      {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Download button */}
              <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant='outline'>
                    <Download className='h-4 w-4 mr-2' />
                    PDF İndir
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{typeConfig.downloadLabel}</DialogTitle>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <p className='text-sm text-muted-foreground'>Ön yazınız PDF formatında indirilecek.</p>
                    <Button onClick={handleDownload} disabled={isLoading} className='w-full'>
                      {isLoading ? 'İndiriliyor...' : 'PDF olarak İndir'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
