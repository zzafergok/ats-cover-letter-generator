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

  const { createBasicCoverLetter, isGenerating, error, clearError } = useCoverLetterStore()
  const { uploadedCVs, getUploadedCVs, selectedCV } = useCVStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
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

  const onSubmit = async (data: BasicCoverLetterForm) => {
    try {
      clearError()

      const coverLetterData: CoverLetterBasicGenerateData = {
        cvUploadId: data.cvUploadId,
        positionTitle: data.positionTitle,
        companyName: data.companyName,
        jobDescription: data.jobDescription,
        language: data.language as Language,
      }

      const createdLetter = await createBasicCoverLetter(coverLetterData)
      setGeneratedCoverLetter(createdLetter)
      setGeneratedContent(createdLetter.content)
      onCreated?.(createdLetter)
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
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // If generated content exists, show it alongside the form
  const shouldShowContent = generatedContent && generatedCoverLetter

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className='flex items-center gap-4'>
            <div className='flex-shrink-0'>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                <Mail className='w-6 h-6 text-primary' />
              </div>
            </div>
            <div>
              <CardTitle className='text-2xl'>Temel Ön Yazı Oluştur</CardTitle>
              <p className='text-muted-foreground mt-1'>Hızlı başvuru için basit ve etkili ön yazı oluşturun</p>
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
                    Yükleme tarihi: {formatDate(selectedCV.uploadedAt)}
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
                                {upload.originalName} ({formatDate(upload.uploadedAt)})
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
            <div className='flex gap-3'>
              <Button
                type='submit'
                disabled={isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
                className='flex-1'
              >
                {isGenerating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isGenerating ? 'Ön Yazı Oluşturuluyor...' : 'Ön Yazı Oluştur'}
              </Button>

              <Button type='button' variant='outline' onClick={handleReset} disabled={isGenerating}>
                Formu Temizle
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
        <>
          <div className='border-t border-border mt-6' />
          <Card className='mt-6'>
            <CardContent className='pt-6'>
              <ContentViewer
                content={generatedContent}
                title={`${watch('positionTitle')} - ${watch('companyName')}`}
                type='cover-letter'
                metadata={{
                  createdAt: generatedCoverLetter.createdAt,
                  wordCount: generatedContent.split(' ').length,
                  characterCount: generatedContent.length,
                  estimatedReadTime: Math.ceil(generatedContent.split(' ').length / 200),
                }}
                onSave={async ({ title, content }) => {
                  // Save cover letter functionality can be implemented here
                  console.log('Save Cover Letter:', { title, content })
                }}
                onDownload={async (format) => {
                  // Download functionality can be implemented here
                  console.log('Download Cover Letter as:', format)
                }}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
