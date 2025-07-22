'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, User, Briefcase, Send, Loader2 } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { useCVStore } from '@/store/cvStore'
import { CoverLetterViewer } from './CoverLetterViewer'
import type { CoverLetterBasic, CVUpload } from '@/types/api.types'

// Validation schema matching API requirements
const basicCoverLetterSchema = z.object({
  cvUploadId: z.string().min(1, 'CV upload ID gerekli'),
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalı'),
  positionTitle: z.string().min(2, 'Pozisyon başlığı en az 2 karakter olmalı'),
  jobDescription: z.string().min(20, 'İş tanımı en az 20 karakter olmalı'),
  language: z.enum(['TURKISH', 'ENGLISH']).optional(),
})

type BasicCoverLetterForm = z.infer<typeof basicCoverLetterSchema>

interface BasicCoverLetterCreatorProps {
  onCreated?: (coverLetter: CoverLetterBasic) => void
  className?: string
}

export function BasicCoverLetterCreator({ onCreated, className }: BasicCoverLetterCreatorProps) {
  const [createdCoverLetter, setCreatedCoverLetter] = useState<CoverLetterBasic | null>(null)

  const { createBasicCoverLetter, isGenerating, error, clearError } = useCoverLetterStore()

  const { uploadedCVs, getUploadedCVs } = useCVStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<BasicCoverLetterForm>({
    resolver: zodResolver(basicCoverLetterSchema),
    defaultValues: {
      cvUploadId: '',
      companyName: '',
      positionTitle: '',
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

      const coverLetterData = {
        cvUploadId: data.cvUploadId,
        companyName: data.companyName,
        positionTitle: data.positionTitle,
        jobDescription: data.jobDescription,
        language: data.language || 'TURKISH',
      }

      const createdLetter = await createBasicCoverLetter(coverLetterData)
      setCreatedCoverLetter(createdLetter)
      onCreated?.(createdLetter)
      reset()
    } catch (error) {
      console.error('Basic cover letter creation error:', error)
    }
  }

  // If cover letter is created, show the viewer
  if (createdCoverLetter) {
    return (
      <div className={className}>
        <CoverLetterViewer
          coverLetter={createdCoverLetter}
          type='basic'
          onUpdate={() => {
            // Refresh or handle update
          }}
        />

        <div className='mt-4 flex justify-center'>
          <Button variant='outline' onClick={() => setCreatedCoverLetter(null)}>
            Yeni Ön Yazı Oluştur
          </Button>
        </div>
      </div>
    )
  }

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
          {error && (
            <div className='mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
              <p className='text-sm text-destructive'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* CV Selection */}
            <Card>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                    <User className='w-4 h-4 text-primary' />
                  </div>
                  <CardTitle className='text-lg'>CV Seçimi</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='cvUploadId'>Kullanılacak CV *</Label>
                  <Controller
                    name='cvUploadId'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='CV seçiniz' />
                        </SelectTrigger>
                        <SelectContent>
                          {uploadedCVs.map((upload: CVUpload) => (
                            <SelectItem key={upload.id} value={upload.id}>
                              {upload.originalName} ({new Date(upload.uploadedAt).toLocaleDateString('tr-TR')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.cvUploadId && <p className='text-sm text-destructive'>{errors.cvUploadId.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Job Information */}
            <Card>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                    <Briefcase className='w-4 h-4 text-primary' />
                  </div>
                  <CardTitle className='text-lg'>İş Bilgileri</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='companyName'>Şirket Adı *</Label>
                    <Input id='companyName' {...register('companyName')} placeholder='Tech Şirket A.Ş.' />
                    {errors.companyName && <p className='text-sm text-destructive'>{errors.companyName.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='positionTitle'>Pozisyon *</Label>
                    <Input id='positionTitle' {...register('positionTitle')} placeholder='Yazılım Geliştirici' />
                    {errors.positionTitle && <p className='text-sm text-destructive'>{errors.positionTitle.message}</p>}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='jobDescription'>İş Tanımı *</Label>
                  <Textarea
                    id='jobDescription'
                    {...register('jobDescription')}
                    rows={6}
                    placeholder='İş ilanında belirtilen görev ve sorumluluklarınızı buraya yazın...'
                  />
                  {errors.jobDescription && <p className='text-sm text-destructive'>{errors.jobDescription.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg'>Dil Seçimi</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='language'>Ön Yazı Dili</Label>
                  <Controller
                    name='language'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
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
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type='submit' disabled={isGenerating} className='w-full py-4 text-base font-semibold' size='lg'>
              {isGenerating ? (
                <>
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Send className='w-5 h-5 mr-2' />
                  Temel Ön Yazı Oluştur
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
