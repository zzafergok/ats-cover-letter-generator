// src/components/common/ContentViewer.tsx
'use client'

import React, { useState } from 'react'
import { Download, Save, Copy, Check, Edit } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Textarea } from '@/components/core/textarea'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/core/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

interface ContentViewerProps {
  content: string
  title: string
  type: 'cv' | 'cover-letter'
  onSave?: (data: { title: string; content: string }) => Promise<void>
  onDownload?: (format: 'pdf' | 'docx') => Promise<void>
  className?: string
}

export function ContentViewer({ content, title, type, onSave, onDownload, className }: ContentViewerProps) {
  const [editedContent, setEditedContent] = useState(content)
  const [saveTitle, setSaveTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx'>('pdf')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Kopyalama hatası:', error)
    }
  }

  const handleSave = async () => {
    if (!onSave || !saveTitle.trim()) return

    try {
      setIsSaving(true)
      await onSave({
        title: saveTitle,
        content: editedContent,
      })
      setSaveTitle('')
    } catch (error) {
      console.error('Kaydetme hatası:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!onDownload) return

    try {
      setIsDownloading(true)
      await onDownload(downloadFormat)
    } catch (error) {
      console.error('İndirme hatası:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {type === 'cv' ? 'Oluşturulan CV içeriği' : 'Oluşturulan ön yazı içeriği'}
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={() => setIsEditing(!isEditing)}>
              <Edit className='h-4 w-4 mr-1' />
              {isEditing ? 'Görüntüle' : 'Düzenle'}
            </Button>
            <Button variant='outline' size='sm' onClick={handleCopy} disabled={isCopied}>
              {isCopied ? <Check className='h-4 w-4 mr-1' /> : <Copy className='h-4 w-4 mr-1' />}
              {isCopied ? 'Kopyalandı' : 'Kopyala'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Content Display/Edit */}
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={20}
            className='font-mono text-sm'
            placeholder='İçerik...'
          />
        ) : (
          <div className='bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto'>
            <pre className='whitespace-pre-wrap text-sm font-mono'>{editedContent}</pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-2'>
          {/* Save Dialog */}
          {onSave && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>
                  <Save className='h-4 w-4 mr-1' />
                  Kaydet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{type === 'cv' ? "CV'yi Kaydet" : 'Ön Yazıyı Kaydet'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='saveTitle'>Başlık</Label>
                    <Input
                      id='saveTitle'
                      value={saveTitle}
                      onChange={(e) => setSaveTitle(e.target.value)}
                      placeholder={`${type === 'cv' ? 'CV' : 'Ön yazı'} başlığı girin`}
                    />
                  </div>
                  <Button onClick={handleSave} disabled={!saveTitle.trim() || isSaving} className='w-full'>
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Download Dialog */}
          {onDownload && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>
                  <Download className='h-4 w-4 mr-1' />
                  İndir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{type === 'cv' ? "CV'yi İndir" : 'Ön Yazıyı İndir'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='downloadFormat'>Format</Label>
                    <Select value={downloadFormat} onValueChange={(value: 'pdf' | 'docx') => setDownloadFormat(value)}>
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
      </CardContent>
    </Card>
  )
}
