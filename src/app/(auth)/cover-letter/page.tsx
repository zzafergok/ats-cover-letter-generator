/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Plus,
  Eye,
  Download,
  Trash2,
  Calendar,
  Building,
  User,
  Sparkles,
  ArrowRight,
  LayoutTemplate,
  Grid,
  TrendingUp,
} from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/core/dialog'

import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { useAuth } from '@/providers/AuthProvider'

export default function CoverLetterDashboardPage() {
  const router = useRouter()

  const { isAuthenticated, loading } = useAuth()
  const {
    savedCoverLetters = [],
    getSavedCoverLetters,
    deleteSavedCoverLetter,
    downloadCoverLetter,
    isLoading: coverLetterLoading,
  } = useCoverLetterStore()

  const [selectedCoverLetter, setSelectedCoverLetter] = useState<any>(null)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      getSavedCoverLetters()
    }
  }, [isAuthenticated, getSavedCoverLetters])

  const handleViewCoverLetter = (coverLetter: any) => {
    setSelectedCoverLetter(coverLetter)
  }

  const handleDownload = async (coverLetter: any, format: 'pdf' | 'docx') => {
    try {
      setIsDownloading(coverLetter.id)
      await downloadCoverLetter(coverLetter, format, 'pdf')
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(null)
    }
  }

  const handleDelete = async (coverLetterId: string) => {
    if (window.confirm("Bu cover letter'ı silmek istediğinizden emin misiniz?")) {
      try {
        setIsDeletingId(coverLetterId)
        await deleteSavedCoverLetter(coverLetterId)
      } catch (error) {
        console.error('Delete error:', error)
      } finally {
        setIsDeletingId(null)
      }
    }
  }

  const navigateToTemplate = () => {
    router.push('/cover-letter/template')
  }

  const navigateToGenerator = () => {
    router.push('/dashboard') // Mevcut CV generator sayfası
  }

  if (loading || !isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  const stats = {
    totalCoverLetters: Array.isArray(savedCoverLetters) ? savedCoverLetters.length : 0,
    thisMonthCount: Array.isArray(savedCoverLetters)
      ? savedCoverLetters.filter((cl) => {
          const created = new Date(cl.createdAt)
          const now = new Date()
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        }).length
      : 0,
    categories: Array.isArray(savedCoverLetters) ? [...new Set(savedCoverLetters.map((cl) => cl.category))].length : 0,
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      <PageHeader title='Cover Letter Yönetimi' />

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Toplam Cover Letter</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalCoverLetters}</div>
            <p className='text-xs text-muted-foreground'>Kayıtlı cover letter sayısı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Bu Ay Oluşturulan</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.thisMonthCount}</div>
            <p className='text-xs text-muted-foreground'>Bu ay oluşturulan cover letter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Farklı Kategori</CardTitle>
            <Grid className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.categories}</div>
            <p className='text-xs text-muted-foreground'>Kullanılan kategori sayısı</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='hover:shadow-lg transition-shadow cursor-pointer' onClick={navigateToTemplate}>
          <CardHeader>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <LayoutTemplate className='h-6 w-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-lg'>Template ile Oluştur</CardTitle>
                <CardDescription>Hazır template'lerden cover letter oluşturun</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>
                  Profesyonel template'ler kullanarak hızlı ve etkili cover letter'lar oluşturun
                </p>
                <Badge variant='secondary' className='bg-primary/10 text-primary'>
                  <Sparkles className='h-3 w-3 mr-1' />
                  Yeni Özellik
                </Badge>
              </div>
              <ArrowRight className='h-5 w-5 text-muted-foreground' />
            </div>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow cursor-pointer' onClick={navigateToGenerator}>
          <CardHeader>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-secondary/10 rounded-lg'>
                <FileText className='h-6 w-6 text-secondary-foreground' />
              </div>
              <div>
                <CardTitle className='text-lg'>CV ile Oluştur</CardTitle>
                <CardDescription>CV'niz temel alınarak cover letter oluşturun</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>
                  Yüklediğiniz CV'nizi kullanarak özelleştirilmiş cover letter'lar oluşturun
                </p>
              </div>
              <ArrowRight className='h-5 w-5 text-muted-foreground' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Cover Letters */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Kayıtlı Cover Letter'lar</CardTitle>
              <CardDescription>Daha önce oluşturduğunuz cover letter'larınızı görüntüleyin ve yönetin</CardDescription>
            </div>
            <Button onClick={navigateToTemplate}>
              <Plus className='h-4 w-4 mr-2' />
              Yeni Oluştur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coverLetterLoading ? (
            <div className='flex items-center justify-center py-8'>
              <LoadingSpinner />
            </div>
          ) : Array.isArray(savedCoverLetters) && savedCoverLetters.length === 0 ? (
            <div className='text-center py-12'>
              <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Henüz cover letter oluşturmadınız</h3>
              <p className='text-muted-foreground mb-6'>
                İlk cover letter'ınızı oluşturmak için template'leri kullanabilir veya CV'nizden yararlanabilirsiniz
              </p>
              <div className='flex justify-center space-x-4'>
                <Button onClick={navigateToTemplate}>
                  <LayoutTemplate className='h-4 w-4 mr-2' />
                  Template ile Başla
                </Button>
                <Button variant='outline' onClick={navigateToGenerator}>
                  <FileText className='h-4 w-4 mr-2' />
                  CV ile Başla
                </Button>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {Array.isArray(savedCoverLetters) &&
                savedCoverLetters.map((coverLetter) => (
                  <Card key={coverLetter.id} className='hover:shadow-md transition-shadow'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-1'>
                          <CardTitle className='text-base line-clamp-1'>{coverLetter.title}</CardTitle>
                          <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                            <Building className='h-3 w-3' />
                            <span className='line-clamp-1'>{coverLetter.companyName}</span>
                          </div>
                          <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                            <User className='h-3 w-3' />
                            <span className='line-clamp-1'>{coverLetter.positionTitle}</span>
                          </div>
                        </div>
                        <Badge variant='secondary' className='text-xs'>
                          {coverLetter.category.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='flex items-center justify-between text-xs text-muted-foreground mb-4'>
                        <div className='flex items-center space-x-1'>
                          <Calendar className='h-3 w-3' />
                          <span>{new Date(coverLetter.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>

                      <div className='flex space-x-2'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='outline'
                              size='sm'
                              className='flex-1'
                              onClick={() => handleViewCoverLetter(coverLetter)}
                            >
                              <Eye className='h-3 w-3 mr-1' />
                              Görüntüle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
                            <DialogHeader>
                              <DialogTitle>{selectedCoverLetter?.title}</DialogTitle>
                              <DialogDescription>
                                {selectedCoverLetter?.companyName} - {selectedCoverLetter?.positionTitle}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCoverLetter && (
                              <ContentViewer
                                content={selectedCoverLetter.content}
                                title={selectedCoverLetter.title}
                                type={selectedCoverLetter.type}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDownload(coverLetter, 'pdf')}
                          disabled={isDownloading === coverLetter.id}
                        >
                          {isDownloading === coverLetter.id ? (
                            <LoadingSpinner size='sm' />
                          ) : (
                            <Download className='h-3 w-3' />
                          )}
                        </Button>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDelete(coverLetter.id)}
                          disabled={isDeletingId === coverLetter.id}
                          className='text-destructive hover:text-destructive'
                        >
                          {isDeletingId === coverLetter.id ? (
                            <LoadingSpinner size='sm' />
                          ) : (
                            <Trash2 className='h-3 w-3' />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
