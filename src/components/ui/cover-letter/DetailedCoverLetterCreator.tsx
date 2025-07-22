'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Briefcase, Target, Send, Loader2 } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { CoverLetterViewer } from './CoverLetterViewer'
import type { CoverLetterDetailed } from '@/types/api.types'

// Validation schema matching API requirements
const detailedCoverLetterSchema = z.object({
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalı'),
  positionTitle: z.string().min(2, 'Pozisyon başlığı en az 2 karakter olmalı'),
  jobDescription: z.string().min(20, 'İş tanımı en az 20 karakter olmalı'),
  whyPosition: z.string().min(50, 'Pozisyon tercihi açıklaması en az 50 karakter olmalı'),
  whyCompany: z.string().min(50, 'Şirket tercihi açıklaması en az 50 karakter olmalı'),
  workMotivation: z.string().min(50, 'İş motivasyonu en az 50 karakter olmalı'),
  language: z.enum(['TURKISH', 'ENGLISH']).optional(),
})

type DetailedCoverLetterForm = z.infer<typeof detailedCoverLetterSchema>

interface DetailedCoverLetterCreatorProps {
  onCreated?: (coverLetter: CoverLetterDetailed) => void
  className?: string
}

export function DetailedCoverLetterCreator({ onCreated, className }: DetailedCoverLetterCreatorProps) {
  const [createdCoverLetter, setCreatedCoverLetter] = useState<CoverLetterDetailed | null>(null)

  const { createDetailedCoverLetter, isGenerating, error, clearError } = useCoverLetterStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DetailedCoverLetterForm>({
    resolver: zodResolver(detailedCoverLetterSchema),
    defaultValues: {
      companyName: '',
      positionTitle: '',
      jobDescription: '',
      whyPosition: '',
      whyCompany: '',
      workMotivation: '',
      language: 'TURKISH',
    },
  })

  const onSubmit = async (data: DetailedCoverLetterForm) => {
    try {
      clearError()

      const coverLetterData = {
        companyName: data.companyName,
        positionTitle: data.positionTitle,
        jobDescription: data.jobDescription,
        language: data.language || 'TURKISH',
        whyPosition: data.whyPosition,
        whyCompany: data.whyCompany,
        workMotivation: data.workMotivation,
      }

      const createdLetter = await createDetailedCoverLetter(coverLetterData)
      setCreatedCoverLetter(createdLetter)
      onCreated?.(createdLetter)
      reset()
    } catch (error) {
      console.error('Detailed cover letter creation error:', error)
    }
  }

  // If cover letter is created, show the viewer
  if (createdCoverLetter) {
    return (
      <div className={className}>
        <CoverLetterViewer
          coverLetter={createdCoverLetter}
          type='detailed'
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
              <CardTitle className='text-2xl'>Detaylı Ön Yazı Oluştur</CardTitle>
              <p className='text-muted-foreground mt-1'>Kapsamlı başvuru için profesyonel ön yazı oluşturun</p>
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
                    <Input id='positionTitle' {...register('positionTitle')} placeholder='Senior Yazılım Geliştirici' />
                    {errors.positionTitle && <p className='text-sm text-destructive'>{errors.positionTitle.message}</p>}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='jobDescription'>İş Tanımı *</Label>
                  <Textarea
                    id='jobDescription'
                    {...register('jobDescription')}
                    rows={4}
                    placeholder='İş ilanında belirtilen görev ve sorumluluklarınızı buraya yazın...'
                  />
                  {errors.jobDescription && <p className='text-sm text-destructive'>{errors.jobDescription.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Motivations */}
            <Card>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                    <Target className='w-4 h-4 text-primary' />
                  </div>
                  <CardTitle className='text-lg'>Motivasyon & Gerekçeler</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='whyPosition'>Bu Pozisyonu Neden Seçtiniz? *</Label>
                  <Textarea
                    id='whyPosition'
                    {...register('whyPosition')}
                    rows={4}
                    placeholder='Bu pozisyonun sizin için neden uygun olduğunu, hangi yeteneklerinizin bu rolle uyumlu olduğunu açıklayın...'
                  />
                  {errors.whyPosition && <p className='text-sm text-destructive'>{errors.whyPosition.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='whyCompany'>Bu Şirketi Neden Seçtiniz? *</Label>
                  <Textarea
                    id='whyCompany'
                    {...register('whyCompany')}
                    rows={4}
                    placeholder='Bu şirketin size neden çekici geldiğini, şirket kültürü ve değerleri hakkındaki düşüncelerinizi açıklayın...'
                  />
                  {errors.whyCompany && <p className='text-sm text-destructive'>{errors.whyCompany.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='workMotivation'>İş Motivasyonunuz *</Label>
                  <Textarea
                    id='workMotivation'
                    {...register('workMotivation')}
                    rows={4}
                    placeholder='Sizi motive eden faktörler, kariyer hedefleriniz ve bu pozisyonda nasıl başarılı olacağınızı açıklayın...'
                  />
                  {errors.workMotivation && <p className='text-sm text-destructive'>{errors.workMotivation.message}</p>}
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
                  Detaylı Ön Yazı Oluştur
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
