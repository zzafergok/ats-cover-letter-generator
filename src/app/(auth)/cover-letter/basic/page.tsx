/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
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
import { BasicCoverLetterCreator } from '@/components/ui/cover-letter/BasicCoverLetterCreator'
import { CVUpload } from '@/components/ui/cv/CVUpload'
import { useCVStore } from '@/store/cvStore'

export default function BasicCoverLetterPage() {
  const [activeTab, setActiveTab] = useState<string>('create')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cvToDelete, setCvToDelete] = useState<any>(null)
  const { uploadedCVs, getUploadedCVs, selectCV, clearSelectedCV, deleteUploadedCV, isLoading } = useCVStore()

  useEffect(() => {
    getUploadedCVs()
  }, [getUploadedCVs])

  // If no CVs are uploaded, default to upload tab
  useEffect(() => {
    if (uploadedCVs !== null && uploadedCVs.length === 0) {
      setActiveTab('upload')
    }
  }, [uploadedCVs])

  // Clear selected CV when switching to upload tab
  useEffect(() => {
    if (activeTab === 'upload') {
      clearSelectedCV()
    }
  }, [activeTab, clearSelectedCV])

  const handleDelete = (cv: any) => {
    setCvToDelete(cv)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!cvToDelete) return

    try {
      await deleteUploadedCV(cvToDelete.id)
      setDeleteDialogOpen(false)
      setCvToDelete(null)
    } catch (error) {
      console.error('CV deletion failed:', error)
    }
  }

  return (
    <div className='container mx-auto p-4 md:p-6 space-y-4 md:space-y-6'>
      {/* Header with back navigation */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
        <Link href='/cover-letter'>
          <Button variant='ghost' size='sm' className='gap-2 self-start'>
            <ArrowLeft className='w-4 h-4' />
            Geri Dön
          </Button>
        </Link>
        <div className='flex-1'>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Temel Ön Yazı Oluştur</h1>
          <p className='text-sm md:text-base text-muted-foreground'>
            CV'nizden bilgiler kullanarak hızlı ve etkili ön yazı oluşturun
          </p>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2 h-12'>
          <TabsTrigger value='upload' className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-10'>
            <Upload className='w-3 h-3 sm:w-4 sm:h-4' />
            <span className='hidden xs:inline'>CV Yükle</span>
            <span className='xs:hidden'>Yükle</span>
            {uploadedCVs !== null && uploadedCVs.length === 0 && (
              <span className='ml-1 h-2 w-2 bg-red-500 rounded-full' />
            )}
          </TabsTrigger>
          <TabsTrigger
            value='create'
            className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-10'
            disabled={uploadedCVs !== null && uploadedCVs.length === 0}
          >
            <FileText className='w-3 h-3 sm:w-4 sm:h-4' />
            <span className='hidden xs:inline'>Ön Yazı Oluştur</span>
            <span className='xs:hidden'>Oluştur</span>
            {uploadedCVs !== null && uploadedCVs.length > 0 && (
              <span className='ml-1 h-2 w-2 bg-green-500 rounded-full' />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='upload' className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <h2 className='text-xl font-semibold'>CV Dosyası Yükleyin</h2>
              <p className='text-muted-foreground'>
                Ön yazı oluşturmak için önce CV dosyanızı yüklemeniz gerekiyor. PDF, DOC veya DOCX formatlarında dosya
                yükleyebilirsiniz.
              </p>
            </div>

            <CVUpload
              onUploadSuccess={(cv) => {
                console.log('CV uploaded successfully:', cv)
                // Automatically switch to create tab after successful upload
                setTimeout(() => {
                  setActiveTab('create')
                }, 2500)
              }}
              className='w-full'
            />

            {/* Show uploaded CVs if any */}
            {uploadedCVs && uploadedCVs.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-lg font-medium mb-3'>Yüklenen CV Dosyaları</h3>
                <div className='space-y-2'>
                  {uploadedCVs.map((cv) => (
                    <div
                      key={cv.id}
                      className='flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg bg-muted/50'
                    >
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <FileText className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                        <div className='min-w-0 flex-1'>
                          <span className='font-medium text-sm block truncate'>{cv.originalName}</span>
                          <span className='text-xs text-muted-foreground block sm:inline'>
                            ({new Date(cv.uploadDate).toLocaleDateString('tr-TR')})
                          </span>
                        </div>
                      </div>
                      <div className='flex gap-2 w-full sm:w-auto'>
                        <Button
                          onClick={() => {
                            selectCV(cv)
                            setActiveTab('create')
                          }}
                          size='sm'
                          variant='outline'
                          className='flex-1 sm:flex-none'
                        >
                          <span className='hidden sm:inline'>Bu CV ile Ön Yazı Oluştur</span>
                          <span className='sm:hidden'>Ön Yazı Oluştur</span>
                        </Button>
                        <Button
                          onClick={() => handleDelete(cv)}
                          size='sm'
                          variant='outline'
                          className='text-destructive hover:text-destructive hover:bg-destructive/10'
                          disabled={isLoading}
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='sr-only'>CV'yi Sil</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value='create' className='space-y-6'>
          <BasicCoverLetterCreator
            onCreated={(coverLetter) => {
              console.log('Cover letter created:', coverLetter)
              // Show success message or additional actions here if needed
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>CV'yi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. "{cvToDelete?.originalName}" CV dosyasını kalıcı olarak silmek istediğinizden emin
              misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-destructive hover:bg-destructive/90'
              disabled={isLoading}
            >
              {isLoading ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
