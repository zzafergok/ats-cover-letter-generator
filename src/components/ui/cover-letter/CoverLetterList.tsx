/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useEffect, useState } from 'react'

import {
  Eye,
  Mail,
  Trash2,
  Search,
  Filter,
  Loader2,
  Calendar,
  Building,
  FileText,
  Download,
  Languages,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

import { Badge } from '@/components/core/badge'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Separator } from '@/components/core/separator'
import { ScrollArea } from '@/components/core/scroll-area'
import { Alert, AlertDescription } from '@/components/core/alert'
import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/core/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/core/dropdown'
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

import { useCoverLetterStore } from '@/store/coverLetterStore'

import type { CoverLetterBasic, CoverLetterDetailed } from '@/types/api.types'

type FilterType = 'all' | 'basic' | 'detailed'
type CoverLetter = CoverLetterBasic | CoverLetterDetailed
type SortType = 'newest' | 'oldest' | 'company' | 'position'

interface CoverLetterCardProps {
  coverLetter: CoverLetter
  onView: (coverLetter: CoverLetter) => void
  onDownload: (coverLetter: CoverLetter) => void
  onDelete: (coverLetter: CoverLetter) => void
  isLoading?: boolean
}

function CoverLetterCard({ coverLetter, onView, onDownload, onDelete, isLoading }: CoverLetterCardProps) {
  const isDetailed = 'whyPosition' in coverLetter || 'whyCompany' in coverLetter || 'workMotivation' in coverLetter

  return (
    <Card className='group hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-3 flex-1'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1'>
              <Mail className='h-5 w-5 text-primary' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='font-semibold text-base line-clamp-1'>{coverLetter.positionTitle}</h3>
                <Badge variant={isDetailed ? 'default' : 'secondary'} className='text-xs'>
                  {isDetailed ? 'Detaylı' : 'Temel'}
                </Badge>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                <Building className='h-4 w-4' />
                <span className='line-clamp-1'>{coverLetter.companyName}</span>
              </div>
              <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span>{format(new Date(coverLetter.createdAt), 'dd MMM yyyy HH:mm', { locale: tr })}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Languages className='h-3 w-3' />
                  <span>{coverLetter.language === 'TURKISH' ? 'Türkçe' : 'English'}</span>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem onClick={() => onView(coverLetter)}>
                <Eye className='h-4 w-4 mr-2' />
                Görüntüle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(coverLetter)} disabled={isLoading}>
                <Download className='h-4 w-4 mr-2' />
                PDF İndir
              </DropdownMenuItem>
              <Separator className='my-1' />
              <DropdownMenuItem
                onClick={() => onDelete(coverLetter)}
                className='text-destructive focus:text-destructive'
                disabled={isLoading}
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  )
}

export function CoverLetterList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState<SortType>('newest')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null)
  const [coverLetterToDelete, setCoverLetterToDelete] = useState<CoverLetter | null>(null)
  const [coverLetterToDownload, setCoverLetterToDownload] = useState<CoverLetter | null>(null)

  const {
    basicCoverLetters,
    detailedCoverLetters,
    getBasicCoverLetters,
    getDetailedCoverLetters,
    deleteBasicCoverLetter,
    deleteDetailedCoverLetter,
    downloadBasicCoverLetterPdf,
    downloadDetailedCoverLetterPdf,
    downloadBasicCoverLetterCustomPdf,
    downloadDetailedCoverLetterCustomPdf,
    isLoading,
    error,
  } = useCoverLetterStore()

  useEffect(() => {
    getBasicCoverLetters()
    getDetailedCoverLetters()
  }, [getBasicCoverLetters, getDetailedCoverLetters])

  // Combine and filter cover letters
  const allCoverLetters: CoverLetter[] = React.useMemo(() => {
    let combined: CoverLetter[] = []

    if (filterType === 'all' || filterType === 'basic') {
      combined = [...combined, ...basicCoverLetters]
    }
    if (filterType === 'all' || filterType === 'detailed') {
      combined = [...combined, ...detailedCoverLetters]
    }

    // Search filter
    if (searchTerm) {
      combined = combined.filter(
        (letter) =>
          letter.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    combined.sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'company':
          return a.companyName.localeCompare(b.companyName, 'tr')
        case 'position':
          return a.positionTitle.localeCompare(b.positionTitle, 'tr')
        default:
          return 0
      }
    })

    return combined
  }, [basicCoverLetters, detailedCoverLetters, searchTerm, filterType, sortType])

  const handleView = (coverLetter: CoverLetter) => {
    setSelectedCoverLetter(coverLetter)
  }

  const handleDownload = (coverLetter: CoverLetter) => {
    setCoverLetterToDownload(coverLetter)
    setDownloadDialogOpen(true)
  }

  const confirmDownload = async () => {
    if (!coverLetterToDownload) return

    try {
      // Check if this is a detailed cover letter by looking for detailed-specific fields
      const isDetailed =
        'whyPosition' in coverLetterToDownload ||
        'whyCompany' in coverLetterToDownload ||
        'workMotivation' in coverLetterToDownload

      if (isDetailed) {
        await downloadDetailedCoverLetterPdf(coverLetterToDownload.id)
      } else {
        await downloadBasicCoverLetterPdf(coverLetterToDownload.id)
      }
      setDownloadDialogOpen(false)
      setCoverLetterToDownload(null)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDelete = (coverLetter: CoverLetter) => {
    setCoverLetterToDelete(coverLetter)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!coverLetterToDelete) return

    try {
      // Check if this is a detailed cover letter by looking for detailed-specific fields
      const isDetailed =
        'whyPosition' in coverLetterToDelete ||
        'whyCompany' in coverLetterToDelete ||
        'workMotivation' in coverLetterToDelete

      if (isDetailed) {
        await deleteDetailedCoverLetter(coverLetterToDelete.id)
      } else {
        await deleteBasicCoverLetter(coverLetterToDelete.id)
      }
      setDeleteDialogOpen(false)
      setCoverLetterToDelete(null)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setSortType('newest')
  }

  if (isLoading && allCoverLetters.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground' />
          <p className='text-muted-foreground'>Ön yazılar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Filters and Search */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg'>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                  placeholder='Pozisyon veya şirket adına göre ara...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                <SelectTrigger className='w-32'>
                  <Filter className='h-4 w-4 mr-2' />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tümü</SelectItem>
                  <SelectItem value='basic'>Temel</SelectItem>
                  <SelectItem value='detailed'>Detaylı</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortType} onValueChange={(value: SortType) => setSortType(value)}>
                <SelectTrigger className='w-36'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>En Yeni</SelectItem>
                  <SelectItem value='oldest'>En Eski</SelectItem>
                  <SelectItem value='company'>Şirket A-Z</SelectItem>
                  <SelectItem value='position'>Pozisyon A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' onClick={resetFilters} size='sm'>
                Temizle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Toplam</p>
                <p className='text-2xl font-bold'>{allCoverLetters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-blue-600' />
              <div>
                <p className='text-sm font-medium'>Temel</p>
                <p className='text-2xl font-bold'>{basicCoverLetters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-purple-600' />
              <div>
                <p className='text-sm font-medium'>Detaylı</p>
                <p className='text-2xl font-bold'>{detailedCoverLetters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cover Letters Grid */}
      {allCoverLetters.length === 0 ? (
        <Card>
          <CardContent className='py-12'>
            <div className='text-center'>
              <Mail className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-semibold mb-2'>Henüz ön yazı oluşturulmamış</h3>
              <p className='text-muted-foreground mb-4'>
                İlk ön yazınızı oluşturmak için aşağıdaki butonları kullanabilirsiniz.
              </p>
              <div className='flex gap-2 justify-center'>
                <a href='/cover-letter/basic'>
                  <Button>Temel Ön Yazı Oluştur</Button>
                </a>
                <a href='/cover-letter/template'>
                  <Button variant='outline'>Detaylı Ön Yazı Oluştur</Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {allCoverLetters.map((coverLetter) => (
            <CoverLetterCard
              key={coverLetter.id}
              coverLetter={coverLetter}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!selectedCoverLetter} onOpenChange={() => setSelectedCoverLetter(null)}>
        <DialogContent className='max-w-4xl max-h-[80vh]'>
          <DialogHeader>
            <DialogTitle>Ön Yazı Görüntüle</DialogTitle>
            <DialogDescription>
              {selectedCoverLetter?.positionTitle} - {selectedCoverLetter?.companyName}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='max-h-[60vh]'>
            {selectedCoverLetter &&
              (() => {
                const content = selectedCoverLetter.generatedContent || selectedCoverLetter.content || ''
                return (
                  <ContentViewer
                    content={content}
                    title={`${selectedCoverLetter.positionTitle} - ${selectedCoverLetter.companyName}`}
                    type={
                      'whyPosition' in selectedCoverLetter ||
                      'whyCompany' in selectedCoverLetter ||
                      'workMotivation' in selectedCoverLetter
                        ? 'cover-letter-detailed'
                        : 'cover-letter-basic'
                    }
                    metadata={{
                      createdAt: selectedCoverLetter.createdAt,
                      updatedAt: selectedCoverLetter.updatedAt,
                      wordCount: content.split(' ').length || 0,
                      characterCount: content.length || 0,
                      estimatedReadTime: Math.ceil((content.split(' ').length || 0) / 200),
                      companyName: selectedCoverLetter.companyName,
                      positionTitle: selectedCoverLetter.positionTitle,
                      language: selectedCoverLetter.language,
                    }}
                    onDownload={async (_format, downloadType, editedContent) => {
                      if (downloadType === 'edited' && editedContent) {
                        // Download edited version using custom PDF endpoint
                        const isDetailed =
                          'whyPosition' in selectedCoverLetter ||
                          'whyCompany' in selectedCoverLetter ||
                          'workMotivation' in selectedCoverLetter

                        if (isDetailed) {
                          // Detailed cover letter
                          await downloadDetailedCoverLetterCustomPdf({
                            content: editedContent,
                            positionTitle: selectedCoverLetter.positionTitle,
                            companyName: selectedCoverLetter.companyName,
                            language: selectedCoverLetter.language,
                          })
                        } else {
                          // Basic cover letter
                          await downloadBasicCoverLetterCustomPdf({
                            content: editedContent,
                            positionTitle: selectedCoverLetter.positionTitle,
                            companyName: selectedCoverLetter.companyName,
                            language: selectedCoverLetter.language,
                          })
                        }
                      } else {
                        // Download original version directly without opening another dialog
                        const isDetailed =
                          'whyPosition' in selectedCoverLetter ||
                          'whyCompany' in selectedCoverLetter ||
                          'workMotivation' in selectedCoverLetter

                        try {
                          if (isDetailed) {
                            await downloadDetailedCoverLetterPdf(selectedCoverLetter.id)
                          } else {
                            await downloadBasicCoverLetterPdf(selectedCoverLetter.id)
                          }
                        } catch (error) {
                          console.error('Download failed:', error)
                        }
                      }
                    }}
                    readonly={false}
                  />
                )
              })()}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Download Confirmation Dialog */}
      <AlertDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <Download className='h-5 w-5 text-primary' />
              PDF Olarak İndir
            </AlertDialogTitle>
            <AlertDialogDescription>
              "{coverLetterToDownload?.positionTitle} - {coverLetterToDownload?.companyName}" ön yazısını PDF olarak
              indirmek istediğinizden emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg my-4'>
            <div className='w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center'>
              <FileText className='h-5 w-5 text-red-600 dark:text-red-400' />
            </div>
            <div className='flex-1'>
              <p className='font-medium text-sm'>PDF Formatında İndirilecek</p>
              <p className='text-xs text-muted-foreground'>Dosya otomatik olarak indirme klasörünüze kaydedilecektir</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDownload} disabled={isLoading}>
              {isLoading ? (
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ön Yazıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. "{coverLetterToDelete?.positionTitle} - {coverLetterToDelete?.companyName}" ön
              yazısını kalıcı olarak silmek istediğinizden emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className='bg-destructive hover:bg-destructive/90'>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
