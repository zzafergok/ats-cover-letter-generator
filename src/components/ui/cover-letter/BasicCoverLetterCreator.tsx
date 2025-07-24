'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, User, Briefcase, Loader2, AlertCircle, FileText } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { useCVStore } from '@/store/cvStore'
import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { coverLetterApi } from '@/lib/api/api'
import type { CoverLetterBasic, CoverLetterBasicGenerateData, CVUpload, Language } from '@/types/api.types'

// Validation schema matching API CoverLetterBasicGenerateData
const basicCoverLetterSchema = z.object({
  cvUploadId: z.string().min(1, 'CV seçimi gereklidir'),
  positionTitle: z
    .string()
    .min(2, 'Pozisyon başlığı en az 2 karakter olmalı')
    .max(100, 'Pozisyon başlığı maksimum 100 karakter olabilir'),
  companyName: z
    .string()
    .min(2, 'Şirket adı en az 2 karakter olmalı')
    .max(100, 'Şirket adı maksimum 100 karakter olabilir'),
  jobDescription: z
    .string()
    .min(20, 'İş tanımı en az 20 karakter olmalı')
    .max(5000, 'İş tanımı maksimum 5000 karakter olabilir'),
  language: z.enum(['TURKISH', 'ENGLISH']),
}) satisfies z.ZodType<CoverLetterBasicGenerateData>

type BasicCoverLetterForm = z.infer<typeof basicCoverLetterSchema>

interface BasicCoverLetterCreatorProps {
  onCreated?: (coverLetter: CoverLetterBasic) => void
  className?: string
}

export function BasicCoverLetterCreator({ onCreated, className }: BasicCoverLetterCreatorProps) {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<CoverLetterBasic | null>(null)

  const { createBasicCoverLetter, isGenerating, isLoading, error, clearError } = useCoverLetterStore()
  const { uploadedCVs, getUploadedCVs, selectedCV } = useCVStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = useForm<BasicCoverLetterForm>({
    resolver: zodResolver(basicCoverLetterSchema),
    defaultValues: {
      cvUploadId: '',
      positionTitle: '',
      companyName: '',
      jobDescription: '',
      language: 'TURKISH',
    },
  })

  useEffect(() => {
    getUploadedCVs()
  }, [getUploadedCVs])

  // Auto-select CV when selectedCV changes
  useEffect(() => {
    if (selectedCV) {
      setValue('cvUploadId', selectedCV.id)
    }
  }, [selectedCV, setValue])

  const onSubmit = async (data: BasicCoverLetterForm) => {
    try {
      clearError()
      // Reset preview content before generating new cover letter
      setGeneratedContent(null)
      setGeneratedCoverLetter(null)

      const coverLetterData: CoverLetterBasicGenerateData = {
        cvUploadId: data.cvUploadId,
        positionTitle: data.positionTitle,
        companyName: data.companyName,
        jobDescription: data.jobDescription,
        language: data.language as Language,
      }

      const createdLetter = await createBasicCoverLetter(coverLetterData)
      console.log('Created cover letter:', createdLetter)

      // Create a proper CoverLetterBasic object with all required fields
      const fullCoverLetter: CoverLetterBasic = {
        id: createdLetter.id,
        content: createdLetter.content || createdLetter.generatedContent || '',
        generatedContent: createdLetter.generatedContent,
        positionTitle: data.positionTitle,
        companyName: data.companyName,
        language: data.language as Language,
        generationStatus: createdLetter.generationStatus || 'COMPLETED',
        createdAt: createdLetter.createdAt,
        updatedAt: createdLetter.updatedAt || createdLetter.createdAt,
      }

      setGeneratedCoverLetter(fullCoverLetter)
      setGeneratedContent(fullCoverLetter.content || fullCoverLetter.generatedContent || '')
      console.log('Generated content set:', fullCoverLetter.content)
      onCreated?.(fullCoverLetter)
    } catch (error) {
      console.error('Basic cover letter creation error:', error)
    }
  }

  const handleReset = () => {
    reset()
    clearError()
    setGeneratedContent(null)
    setGeneratedCoverLetter(null)
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Tarih belirtilmemiş'
      }
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Tarih belirtilmemiş'
    }
  }

  // If generated content exists, show it alongside the form
  const shouldShowContent = generatedContent && generatedCoverLetter && generatedContent.trim().length > 0

  console.log('Should show content:', shouldShowContent, {
    generatedContent: !!generatedContent,
    generatedCoverLetter: !!generatedCoverLetter,
    contentLength: generatedContent?.length || 0,
  })

  return (
    <div className={className}>
      <div className={`grid gap-4 md:gap-6 ${shouldShowContent ? 'xl:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Form Section */}
        <Card>
          <CardHeader>
            <div className='flex items-start sm:items-center gap-3 sm:gap-4'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                  <Mail className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <CardTitle className='text-xl sm:text-2xl'>Temel Ön Yazı Oluştur</CardTitle>
                <p className='text-sm sm:text-base text-muted-foreground mt-1'>
                  Hızlı başvuru için basit ve etkili ön yazı oluşturun
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* CV Selection */}
              <div className='space-y-2'>
                <Label htmlFor='cvUploadId'>CV Dosyası Seçimi *</Label>
                {selectedCV ? (
                  <div className='p-3 border rounded-lg bg-muted/50'>
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4 text-muted-foreground' />
                      <span className='font-medium text-sm'>{selectedCV.originalName}</span>
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Yükleme tarihi: {formatDate(selectedCV.uploadDate)}
                    </p>
                  </div>
                ) : uploadedCVs && uploadedCVs.length > 0 ? (
                  <Controller
                    name='cvUploadId'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='Yüklenmiş CV dosyalarınızdan birini seçiniz' />
                        </SelectTrigger>
                        <SelectContent>
                          {uploadedCVs.map((upload: CVUpload) => (
                            <SelectItem key={upload.id} value={upload.id}>
                              <div className='flex items-center gap-2'>
                                <FileText className='h-4 w-4' />
                                <span>
                                  {upload.originalName} ({formatDate(upload.uploadDate)})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
                    <div className='flex items-center gap-2'>
                      <AlertCircle className='h-4 w-4 text-orange-600' />
                      <p className='text-sm text-orange-800'>
                        Ön yazı oluşturmak için önce bir CV dosyası yüklemeniz gerekiyor. Lütfen &quot;CV Yükle&quot;
                        sekmesinden bir dosya yükleyiniz.
                      </p>
                    </div>
                  </div>
                )}
                {errors.cvUploadId && <p className='text-sm text-destructive'>{errors.cvUploadId.message}</p>}
              </div>

              {/* Company Name */}
              <div className='space-y-2'>
                <Label htmlFor='companyName'>Şirket Adı *</Label>
                <div className='relative'>
                  <Briefcase className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='companyName'
                    placeholder='ör. ABC Teknoloji, XYZ Holding'
                    className='pl-10'
                    {...register('companyName')}
                    disabled={isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
                  />
                </div>
                {errors.companyName && <p className='text-sm text-destructive'>{errors.companyName.message}</p>}
              </div>

              {/* Position Title */}
              <div className='space-y-2'>
                <Label htmlFor='positionTitle'>İş Pozisyonu *</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='positionTitle'
                    placeholder='ör. Frontend Developer, Pazarlama Uzmanı'
                    className='pl-10'
                    {...register('positionTitle')}
                    disabled={isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
                  />
                </div>
                {errors.positionTitle && <p className='text-sm text-destructive'>{errors.positionTitle.message}</p>}
              </div>

              {/* Job Description */}
              <div className='space-y-2'>
                <Label htmlFor='jobDescription'>İş Tanımı *</Label>
                <Textarea
                  id='jobDescription'
                  placeholder='İş ilanından iş tanımını ve gereksinimlerini buraya kopyalayınız. Bu bilgiler ön yazınızın pozisyona uygun şekilde optimize edilmesi için kullanılacaktır.'
                  rows={6}
                  {...register('jobDescription')}
                  disabled={isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
                />
                <p className='text-xs text-muted-foreground'>{watch('jobDescription')?.length || 0} / 5000 karakter</p>
                {errors.jobDescription && <p className='text-sm text-destructive'>{errors.jobDescription.message}</p>}
              </div>

              {/* Language Selection */}
              <div className='space-y-2'>
                <Label htmlFor='language'>Ön Yazı Dili</Label>
                <Controller
                  name='language'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='TURKISH'>Türkçe</SelectItem>
                        <SelectItem value='ENGLISH'>İngilizce</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.language && <p className='text-sm text-destructive'>{errors.language.message}</p>}
              </div>

              {/* Error Message */}
              {error && (
                <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
                  <div className='flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4 text-destructive' />
                    <p className='text-sm text-destructive'>{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  type='submit'
                  disabled={isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
                  className='flex-1'
                >
                  {isGenerating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  <span className='hidden sm:inline'>
                    {isGenerating ? 'Ön Yazı Oluşturuluyor...' : 'Ön Yazı Oluştur'}
                  </span>
                  <span className='sm:hidden'>{isGenerating ? 'Oluşturuluyor...' : 'Oluştur'}</span>
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  onClick={handleReset}
                  disabled={isGenerating}
                  className='sm:w-auto'
                >
                  <span className='hidden sm:inline'>Formu Temizle</span>
                  <span className='sm:hidden'>Temizle</span>
                </Button>
              </div>

              {!selectedCV && (!uploadedCVs || uploadedCVs.length === 0) && (
                <div className='bg-muted/50 border border-muted rounded-lg p-4'>
                  <div className='flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>
                      Ön yazı oluşturmak için önce &quot;CV Yükle&quot; sekmesinden bir CV dosyası yüklemeniz
                      gerekmektedir.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Generated Cover Letter Content */}
        {shouldShowContent && (
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Oluşturulan Ön Yazı</CardTitle>
              <p className='text-muted-foreground'>
                {watch('positionTitle')} - {watch('companyName')}
              </p>
            </CardHeader>
            <CardContent>
              <ContentViewer
                content={generatedContent}
                title={`${watch('positionTitle')} - ${watch('companyName')}`}
                type='cover-letter-basic'
                metadata={{
                  createdAt: generatedCoverLetter.createdAt,
                  wordCount: generatedContent.split(' ').length,
                  characterCount: generatedContent.length,
                  estimatedReadTime: Math.ceil(generatedContent.split(' ').length / 200),
                  companyName: watch('companyName'),
                  positionTitle: watch('positionTitle'),
                  language: watch('language'),
                }}
                onSave={async ({ title, content }) => {
                  // Save cover letter functionality can be implemented here
                  console.log('Save Cover Letter:', { title, content })
                }}
                onDownload={async (format, downloadType, editedContent) => {
                  if (downloadType === 'edited' && editedContent) {
                    // This is a temporary generated content, so we use the custom PDF endpoint
                    const { downloadBasicCoverLetterCustomPdf } = useCoverLetterStore.getState()
                    await downloadBasicCoverLetterCustomPdf({
                      content: editedContent,
                      positionTitle: watch('positionTitle'),
                      companyName: watch('companyName'),
                      language: watch('language'),
                    })
                  }
                  // For original download of temporary content, we also use custom endpoint
                  else if (format === 'pdf') {
                    if (generatedCoverLetter?.id) {
                      try {
                        // Create a better filename using current cover letter data
                        const cleanCompany = generatedCoverLetter.companyName.replace(/[^a-zA-Z0-9]/g, '_')
                        const cleanPosition = generatedCoverLetter.positionTitle.replace(/[^a-zA-Z0-9]/g, '_')
                        const filename = `${cleanCompany}_${cleanPosition}_Cover_Letter.pdf`

                        const blob = await coverLetterApi.basic.downloadPdf(generatedCoverLetter.id)
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = filename
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                      } catch (error) {
                        console.error('PDF download failed:', error)
                      }
                    } else {
                      // Use custom PDF endpoint for temporary content
                      const { downloadBasicCoverLetterCustomPdf } = useCoverLetterStore.getState()
                      await downloadBasicCoverLetterCustomPdf({
                        content: generatedContent,
                        positionTitle: watch('positionTitle'),
                        companyName: watch('companyName'),
                        language: watch('language'),
                      })
                    }
                  }
                }}
                readonly={isLoading}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
