'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Download, Save, Copy, Check, Edit, FileText, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Textarea } from '@/components/core/textarea'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/core/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Badge } from '@/components/core/badge'
import { Separator } from '@/components/core/separator'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { ScrollArea } from '@/components/core/scroll-area'
import { useClipboard } from '@/hooks/useClipboard'

// Types
type ContentType = 'cv' | 'cover-letter' | 'cover-letter-basic' | 'cover-letter-detailed'
type ViewMode = 'preview' | 'edit' | 'raw'
type DownloadFormat = 'pdf' | 'docx'

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
  }
  onSave?: (data: SaveData) => Promise<void>
  onDownload?: (format: DownloadFormat) => Promise<void>
  onEdit?: (content: string) => void
  className?: string
  readonly?: boolean
}

const useContentStats = (content: string) => {
  return useMemo(() => {
    const wordCount = content
      .trim()
      .split(/\\s+/)
      .filter((word) => word.length > 0).length
    const characterCount = content.length
    const characterCountNoSpaces = content.replace(/\\s/g, '').length
    const estimatedReadTime = Math.ceil(wordCount / 200) // 200 words per minute
    const paragraphCount = content.split('\\n\\n').filter((p) => p.trim().length > 0).length

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
  onSave,
  onDownload,
  onEdit,
  className,
  readonly = false,
}: ContentViewerProps) {
  // State management
  const [editedContent, setEditedContent] = useState(content)
  const [saveTitle, setSaveTitle] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('pdf')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
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

  const handleSave = useCallback(async () => {
    if (!onSave || !saveTitle.trim()) return

    try {
      setIsSaving(true)
      await onSave({
        title: saveTitle,
        content: editedContent,
      })
      setSaveTitle('')
      setSaveDialogOpen(false)
    } catch (error) {
      console.error('Save error:', error)
      // Handle error (could add toast notification here)
    } finally {
      setIsSaving(false)
    }
  }, [onSave, saveTitle, editedContent])

  const handleDownload = useCallback(async () => {
    if (!onDownload) return

    try {
      setIsDownloading(true)
      await onDownload(downloadFormat)
      setDownloadDialogOpen(false)
    } catch (error) {
      console.error('Download error:', error)
      // Handle error (could add toast notification here)
    } finally {
      setIsDownloading(false)
    }
  }, [onDownload, downloadFormat])

  const handleCopy = useCallback(() => {
    copyToClipboard(editedContent)
  }, [copyToClipboard, editedContent])

  // Content validation
  const hasContent = content.trim().length > 0

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
    <Card className={className}>
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-3'>
            <div className='mt-1'>{typeConfig.icon}</div>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                {title}
                <Badge variant='secondary' className='text-xs'>
                  {typeConfig.label}
                </Badge>
              </CardTitle>
              <CardDescription>{typeConfig.description}</CardDescription>

              {/* Metadata */}
              {metadata && (
                <div className='flex items-center gap-4 text-xs text-muted-foreground mt-2'>
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
            <TabsTrigger value='raw' className='flex items-center gap-2'>
              <EyeOff className='h-4 w-4' />
              Ham Metin
            </TabsTrigger>
          </TabsList>

          <TabsContent value='preview' className='mt-4'>
            <ScrollArea className='h-[500px] w-full rounded-md border p-4'>
              <ContentRenderer content={editedContent} type={type} />
            </ScrollArea>
          </TabsContent>

          {!readonly && (
            <TabsContent value='edit' className='mt-4'>
              <Textarea
                value={editedContent}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={20}
                className='font-mono text-sm'
                placeholder={`${typeConfig.label} içeriğinizi buraya yazın...`}
              />
            </TabsContent>
          )}

          <TabsContent value='raw' className='mt-4'>
            <ScrollArea className='h-[500px] w-full rounded-md border'>
              <div className='bg-muted/50 p-4'>
                <pre className='whitespace-pre-wrap text-sm font-mono'>{editedContent}</pre>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        {!readonly && (
          <>
            <Separator />
            <div className='flex flex-wrap gap-2'>
              {/* Save button */}
              {onSave && (
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      <Save className='h-4 w-4 mr-2' />
                      Kaydet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{typeConfig.saveLabel}</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='saveTitle'>Başlık</Label>
                        <Input
                          id='saveTitle'
                          value={saveTitle}
                          onChange={(e) => setSaveTitle(e.target.value)}
                          placeholder={`${typeConfig.label} başlığı girin`}
                        />
                      </div>
                      <Button onClick={handleSave} disabled={!saveTitle.trim() || isSaving} className='w-full'>
                        {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Download button */}
              {onDownload && (
                <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      <Download className='h-4 w-4 mr-2' />
                      İndir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{typeConfig.downloadLabel}</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='downloadFormat'>Format</Label>
                        <Select
                          value={downloadFormat}
                          onValueChange={(value: DownloadFormat) => setDownloadFormat(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='pdf'>PDF</SelectItem>
                            <SelectItem value='docx'>Word (DOCX)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleDownload} disabled={isDownloading} className='w-full'>
                        {isDownloading ? 'İndiriliyor...' : `${downloadFormat.toUpperCase()} olarak İndir`}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
