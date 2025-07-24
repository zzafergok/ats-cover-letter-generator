/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Download, Copy, Check, Edit, FileText, Mail, Eye, ChevronDown } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Textarea } from '@/components/core/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/core/alert-dialog'
import { Badge } from '@/components/core/badge'
import { Separator } from '@/components/core/separator'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { ScrollArea } from '@/components/core/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/core/dropdown'
import { useClipboard } from '@/hooks/useClipboard'

// Types
type ContentType = 'cv' | 'cover-letter' | 'cover-letter-basic' | 'cover-letter-detailed'
type ViewMode = 'preview' | 'edit' | 'raw'
type DownloadFormat = 'pdf'
type DownloadType = 'original' | 'edited'

interface SaveData {
  title: string
  content: string
}

interface ContentViewerProps {
  content: string
  title: string
  type: ContentType
  metadata?: {
    createdAt?: string
    updatedAt?: string
    wordCount?: number
    characterCount?: number
    estimatedReadTime?: number
    companyName?: string
    positionTitle?: string
    language?: 'TURKISH' | 'ENGLISH'
  }
  onSave?: (data: SaveData) => Promise<void>
  onDownload?: (format: DownloadFormat, downloadType?: DownloadType, editedContent?: string) => Promise<void>
  onEdit?: (content: string) => void
  className?: string
  readonly?: boolean
}

const useContentStats = (content: string) => {
  return useMemo(() => {
    if (!content || typeof content !== 'string') {
      return {
        wordCount: 0,
        characterCount: 0,
        characterCountNoSpaces: 0,
        estimatedReadTime: 0,
        paragraphCount: 0,
      }
    }

    // Daha doğru kelime sayısı hesaplama
    const cleanText = content
      .replace(/[^\w\s\u00C0-\u017F\u0100-\u024F\u1E00-\u1EFF]/g, ' ') // Sadece harfler ve boşluklar
      .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluk yap
      .trim()

    const wordCount = cleanText ? cleanText.split(' ').filter((word) => word.length > 0).length : 0
    const characterCount = content.length
    const characterCountNoSpaces = content.replace(/\s/g, '').length

    // Daha doğru okuma süresi hesaplama (Türkçe için 180-200 kelime/dk)
    const estimatedReadTime = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 180)) : 0

    // Daha doğru paragraf sayısı hesaplama
    const paragraphCount = content.split(/\n\s*\n/).filter((p) => p.trim().length > 10).length // En az 10 karakter olan paragrafları say

    return {
      wordCount,
      characterCount,
      characterCountNoSpaces,
      estimatedReadTime,
      paragraphCount,
    }
  }, [content])
}

// Content renderer for better formatting
const ContentRenderer: React.FC<{ content: string; type: ContentType }> = ({ content, type: _type }) => {
  const formattedContent = useMemo(() => {
    if (!content || typeof content !== 'string') {
      return 'İçerik bulunamadı.'
    }

    // Basic markdown-like formatting with improved line break handling
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>') // H1
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>') // H2
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>') // H3
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>') // Bullet points
      .replace(/\n\n/g, '</p><p class="mb-4">') // Paragraph breaks
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/^/, '<p class="mb-4">') // Start with paragraph
      .replace(/$/, '</p>') // End with paragraph
  }, [content])

  return (
    <div
      className='prose prose-sm max-w-none dark:prose-invert'
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  )
}

export function ContentViewer({
  content,
  title,
  type,
  metadata,
  onDownload,
  onEdit,
  className,
  readonly = false,
}: ContentViewerProps) {
  // State management
  const [editedContent, setEditedContent] = useState(content)
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadFormat] = useState<DownloadFormat>('pdf')
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)

  // Custom hooks
  const { isCopied, copyToClipboard } = useClipboard()
  const contentStats = useContentStats(editedContent)

  // Computed values
  const typeConfig = useMemo(() => {
    switch (type) {
      case 'cv':
        return {
          icon: <FileText className='h-4 w-4' />,
          label: 'CV',
          description: 'Oluşturulan CV içeriği',
          saveLabel: "CV'yi Kaydet",
          downloadLabel: "CV'yi İndir",
        }
      case 'cover-letter-basic':
        return {
          icon: <Mail className='h-4 w-4' />,
          label: 'Temel Ön Yazı',
          description: 'Hızlı başvuru için temel ön yazı',
          saveLabel: 'Temel Ön Yazıyı Kaydet',
          downloadLabel: 'Temel Ön Yazıyı İndir',
        }
      case 'cover-letter-detailed':
        return {
          icon: <Mail className='h-4 w-4' />,
          label: 'Detaylı Ön Yazı',
          description: 'Kapsamlı başvuru için detaylı ön yazı',
          saveLabel: 'Detaylı Ön Yazıyı Kaydet',
          downloadLabel: 'Detaylı Ön Yazıyı İndir',
        }
      default: // cover-letter
        return {
          icon: <Mail className='h-4 w-4' />,
          label: 'Ön Yazı',
          description: 'Oluşturulan ön yazı içeriği',
          saveLabel: 'Ön Yazıyı Kaydet',
          downloadLabel: 'Ön Yazıyı İndir',
        }
    }
  }, [type])

  // Event handlers
  const handleContentChange = useCallback(
    (newContent: string) => {
      setEditedContent(newContent)
      onEdit?.(newContent)
    },
    [onEdit],
  )

  const handleDownload = useCallback(
    async (downloadType: DownloadType = 'original') => {
      if (!onDownload) return

      try {
        setIsDownloading(true)
        if (downloadType === 'edited') {
          await onDownload(downloadFormat, downloadType, editedContent)
        } else {
          await onDownload(downloadFormat, downloadType)
        }
        setDownloadDialogOpen(false)
      } catch (error) {
        console.error('Download error:', error)
        // Handle error (could add toast notification here)
      } finally {
        setIsDownloading(false)
      }
    },
    [onDownload, downloadFormat, editedContent],
  )

  const handleOriginalDownload = useCallback(() => handleDownload('original'), [handleDownload])
  const handleEditedDownload = useCallback(() => handleDownload('edited'), [handleDownload])

  const handleCopy = useCallback(() => {
    copyToClipboard(editedContent)
  }, [copyToClipboard, editedContent])

  // Content validation
  const hasContent = content.trim().length > 0
  const hasContentChanged = editedContent !== content
  const canDownloadEdited =
    hasContentChanged && (type.includes('cover-letter-detailed') || type.includes('cover-letter-basic'))

  // Debug logging removed

  if (!hasContent) {
    return (
      <Card className={className}>
        <CardContent className='py-12'>
          <Alert>
            <AlertDescription className='text-center'>
              Henüz {typeConfig.label.toLowerCase()} içeriği oluşturulmamış.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} bg-gradient-to-br from-background to-muted/30`}>
      <CardHeader className='pb-6 space-y-4'>
        <div className='flex items-start justify-between flex-col-reverse gap-4'>
          <div className='flex items-start gap-3'>
            <div className='mt-1 p-2 rounded-lg bg-primary/10 text-primary'>{typeConfig.icon}</div>
            <div className='space-y-2'>
              <CardTitle className='flex items-center gap-2 text-xl'>
                {title}
                <Badge variant='secondary' className='text-xs px-2 py-1'>
                  {typeConfig.label}
                </Badge>
              </CardTitle>
              <CardDescription className='text-sm'>{typeConfig.description}</CardDescription>

              {/* Metadata */}
              {metadata && (
                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                  {metadata.createdAt && (
                    <span>Oluşturulma: {new Date(metadata.createdAt).toLocaleDateString('tr-TR')}</span>
                  )}
                  {metadata.updatedAt && (
                    <span>Güncelleme: {new Date(metadata.updatedAt).toLocaleDateString('tr-TR')}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content statistics - Fresh design */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/50 rounded-lg border'>
          <div className='text-center space-y-1'>
            <div className='text-lg font-semibold text-primary'>{contentStats.wordCount}</div>
            <div className='text-xs text-muted-foreground font-medium'>Kelime</div>
          </div>
          <div className='text-center space-y-1'>
            <div className='text-lg font-semibold text-primary'>{contentStats.characterCount}</div>
            <div className='text-xs text-muted-foreground font-medium'>Karakter</div>
          </div>
          <div className='text-center space-y-1'>
            <div className='text-lg font-semibold text-primary'>{contentStats.paragraphCount}</div>
            <div className='text-xs text-muted-foreground font-medium'>Paragraf</div>
          </div>
          <div className='text-center space-y-1'>
            <div className='text-lg font-semibold text-primary'>{contentStats.estimatedReadTime}</div>
            <div className='text-xs text-muted-foreground font-medium'>Dk Okuma</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Content tabs for different view modes */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className='w-full'>
          <TabsList className={`grid w-full h-11 ${readonly ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <TabsTrigger
              value='preview'
              className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <Eye className='h-4 w-4' />
              Önizleme
            </TabsTrigger>
            {!readonly && (
              <TabsTrigger
                value='edit'
                className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
              >
                <Edit className='h-4 w-4' />
                Düzenle
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value='preview' className='mt-6'>
            <div className='relative'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCopy}
                disabled={isCopied}
                className='absolute top-3 right-5 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 border'
              >
                {isCopied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
              </Button>
              <ScrollArea className='h-[500px] w-full rounded-lg border bg-background p-6'>
                <ContentRenderer content={editedContent} type={type} />
              </ScrollArea>
            </div>
          </TabsContent>

          {!readonly && (
            <TabsContent value='edit' className='mt-6'>
              <Textarea
                value={editedContent}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={20}
                className='font-mono text-sm resize-none'
                placeholder={`${typeConfig.label} içeriğinizi buraya yazın...`}
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Action buttons */}
        {!readonly && (
          <>
            <Separator />
            <div className='flex items-center justify-end pt-2'>
              {/* Download button */}
              {onDownload && (
                <>
                  {canDownloadEdited ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='default' size='lg' className='px-6'>
                          <Download className='h-4 w-4 mr-2' />
                          PDF İndir
                          <ChevronDown className='h-4 w-4 ml-2' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-56'>
                        <DropdownMenuItem onClick={() => setDownloadDialogOpen(true)}>
                          <FileText className='h-4 w-4 mr-2' />
                          Orijinal Ön Yazıyı İndir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEditedDownload}>
                          <Edit className='h-4 w-4 mr-2' />
                          Düzenlenmiş Ön Yazıyı İndir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <AlertDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant='default' size='lg' className='px-6'>
                          <Download className='h-4 w-4 mr-2' />
                          PDF İndir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className='flex items-center gap-2'>
                            <Download className='h-5 w-5 text-primary' />
                            PDF Olarak İndir
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            "{title}" dosyasını PDF olarak indirmek istediğinizden emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg my-4'>
                          <div className='w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center'>
                            <FileText className='h-5 w-5 text-red-600 dark:text-red-400' />
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium text-sm'>PDF Formatında İndirilecek</p>
                            <p className='text-xs text-muted-foreground'>
                              Dosya otomatik olarak indirme klasörünüze kaydedilecektir
                            </p>
                          </div>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleOriginalDownload} disabled={isDownloading}>
                            {isDownloading ? (
                              <>
                                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
                                İndiriliyor...
                              </>
                            ) : (
                              <>
                                <Download className='h-4 w-4 mr-2' />
                                İndir
                              </>
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
