'use client'

import React from 'react'
import { CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/core/alert-dialog'

interface GeneratedCV {
  id: string
  templateType: string
  fileName: string
  generatedAt: string
}

interface CVSuccessMessageProps {
  generatedCV: GeneratedCV
  downloadDialogOpen: boolean
  setDownloadDialogOpen: (open: boolean) => void
  onNewCV: () => void
  onDownload: () => void
}

export function CVSuccessMessage({
  generatedCV,
  downloadDialogOpen,
  setDownloadDialogOpen,
  onNewCV,
  onDownload,
}: CVSuccessMessageProps) {
  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-green-600 dark:text-green-400'>
              <CheckCircle className='h-6 w-6' />
              CV Başarıyla Oluşturuldu
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
              <h4 className='font-medium text-green-800 dark:text-green-200 mb-2'>CV Bilgileri</h4>
              <div className='space-y-2 text-sm'>
                <p>
                  <span className='font-medium'>Template:</span> {generatedCV.templateType}
                </p>
                <p>
                  <span className='font-medium'>Dosya Adı:</span> {generatedCV.fileName}
                </p>
                <p>
                  <span className='font-medium'>Oluşturulma:</span>{' '}
                  {new Date(generatedCV.generatedAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            <div className='flex gap-2'>
              <Button onClick={() => setDownloadDialogOpen(true)} className='flex-1 flex items-center gap-2'>
                <Download className='h-4 w-4' />
                PDF İndir
              </Button>

              <Button variant='outline' onClick={onNewCV} className='flex-1'>
                Yeni CV Oluştur
              </Button>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <Download className='h-5 w-5 text-primary' />
                PDF Olarak İndir
              </AlertDialogTitle>
              <AlertDialogDescription>
                CV'nizi PDF formatında indirmek için onaylayın. Dosya bilgisayarınıza indirilecektir.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={onDownload}>İndir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
