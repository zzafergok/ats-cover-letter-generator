// src/components/cv/CVGeneratorForm.tsx
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, FileText, Wand2 } from 'lucide-react'
import { useCVStore } from '@/store/cvStore'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

const cvGeneratorSchema = z.object({
  cvId: z.string().min(1, 'CV seçimi gereklidir'),
  jobTitle: z.string().min(1, 'İş pozisyonu gereklidir'),
  jobDescription: z.string().min(10, 'İş tanımı en az 10 karakter olmalıdır'),
  cvType: z.enum(['ats', 'creative', 'technical'], {
    required_error: 'CV tipi seçimi gereklidir',
  }),
})

type CVGeneratorFormData = z.infer<typeof cvGeneratorSchema>

interface CVGeneratorFormProps {
  onGenerate: (content: string) => void
  className?: string
}

export function CVGeneratorForm({ onGenerate, className }: CVGeneratorFormProps) {
  const { uploadedCVs, selectedCV, generateCV, isGenerating, error, clearError } = useCVStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CVGeneratorFormData>({
    resolver: zodResolver(cvGeneratorSchema),
    defaultValues: {
      cvId: selectedCV?.id || '',
      jobTitle: '',
      jobDescription: '',
      cvType: 'ats',
    },
  })

  const cvType = watch('cvType')

  const onSubmit = async (data: CVGeneratorFormData) => {
    try {
      clearError()
      const content = await generateCV(data)
      onGenerate(content)
    } catch (error) {
      console.error('CV oluşturma hatası:', error)
    }
  }

  const cvTypeDescriptions = {
    ats: 'ATS sistemlerine uygun, anahtar kelime odaklı profesyonel CV',
    creative: 'Yaratıcı sektörler için görsel ve etkileyici CV tasarımı',
    technical: 'Teknik pozisyonlar için detaylı beceri ve proje odaklı CV',
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Wand2 className='h-5 w-5' />
          CV Oluşturucu
        </CardTitle>
        <CardDescription>Pozisyona özel ATS uyumlu CV oluşturun</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* CV Selection */}
          <div className='space-y-2'>
            <Label htmlFor='cvId'>CV Seçimi</Label>
            <Select value={watch('cvId')} onValueChange={(value) => setValue('cvId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Yüklenmiş CV'lerinizden birini seçin" />
              </SelectTrigger>
              <SelectContent>
                {uploadedCVs.map((cv) => (
                  <SelectItem key={cv.id} value={cv.id}>
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4' />
                      {cv.fileName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cvId && <p className='text-sm text-destructive'>{errors.cvId.message}</p>}
          </div>

          {/* Job Title */}
          <div className='space-y-2'>
            <Label htmlFor='jobTitle'>İş Pozisyonu</Label>
            <div className='relative'>
              <Briefcase className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='jobTitle'
                placeholder='ör. Frontend Developer'
                className='pl-10'
                {...register('jobTitle')}
                disabled={isSubmitting || isGenerating}
              />
            </div>
            {errors.jobTitle && <p className='text-sm text-destructive'>{errors.jobTitle.message}</p>}
          </div>

          {/* CV Type */}
          <div className='space-y-2'>
            <Label htmlFor='cvType'>CV Tipi</Label>
            <Select
              value={cvType}
              onValueChange={(value) => setValue('cvType', value as 'ats' | 'creative' | 'technical')}
            >
              <SelectTrigger>
                <SelectValue placeholder='CV tipini seçin' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ats'>
                  <div className='space-y-1'>
                    <p className='font-medium'>ATS Uyumlu</p>
                    <p className='text-xs text-muted-foreground'>{cvTypeDescriptions.ats}</p>
                  </div>
                </SelectItem>
                <SelectItem value='creative'>
                  <div className='space-y-1'>
                    <p className='font-medium'>Yaratıcı</p>
                    <p className='text-xs text-muted-foreground'>{cvTypeDescriptions.creative}</p>
                  </div>
                </SelectItem>
                <SelectItem value='technical'>
                  <div className='space-y-1'>
                    <p className='font-medium'>Teknik</p>
                    <p className='text-xs text-muted-foreground'>{cvTypeDescriptions.technical}</p>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.cvType && <p className='text-sm text-destructive'>{errors.cvType.message}</p>}
          </div>

          {/* Job Description */}
          <div className='space-y-2'>
            <Label htmlFor='jobDescription'>İş Tanımı</Label>
            <Textarea
              id='jobDescription'
              placeholder='İş ilanından iş tanımını buraya yapıştırın...'
              rows={6}
              {...register('jobDescription')}
              disabled={isSubmitting || isGenerating}
            />
            {errors.jobDescription && <p className='text-sm text-destructive'>{errors.jobDescription.message}</p>}
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
              <p className='text-sm text-destructive'>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button type='submit' disabled={isSubmitting || isGenerating || uploadedCVs.length === 0} className='w-full'>
            {isGenerating && <Wand2 className='mr-2 h-4 w-4 animate-spin' />}
            {isGenerating ? 'CV Oluşturuluyor...' : 'CV Oluştur'}
          </Button>

          {uploadedCVs.length === 0 && (
            <p className='text-sm text-muted-foreground text-center'>
              CV oluşturmak için önce bir CV yüklemeniz gerekiyor
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
