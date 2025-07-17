// src/components/cover-letter/CoverLetterGenerator.tsx
'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Building, User, Briefcase, Wand2 } from 'lucide-react'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { useCVStore } from '@/store/cvStore'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

const coverLetterSchema = z.object({
  cvId: z.string().min(1, 'CV seçimi gereklidir'),
  categoryId: z.string().min(1, 'Kategori seçimi gereklidir'),
  jobTitle: z.string().min(1, 'İş pozisyonu gereklidir'),
  companyName: z.string().min(1, 'Şirket adı gereklidir'),
  jobDescription: z.string().min(10, 'İş tanımı en az 10 karakter olmalıdır'),
  fullName: z.string().min(1, 'Ad soyad gereklidir'),
})

type CoverLetterFormData = z.infer<typeof coverLetterSchema>

interface CoverLetterGeneratorProps {
  onGenerate: (content: string) => void
  className?: string
}

export function CoverLetterGenerator({ onGenerate, className }: CoverLetterGeneratorProps) {
  const { categories, getCategories, generateCoverLetter, isGenerating, isLoading, error, clearError } =
    useCoverLetterStore()

  const { uploadedCVs, selectedCV } = useCVStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CoverLetterFormData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      cvId: selectedCV?.id || '',
      categoryId: '',
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      fullName: '',
    },
  })

  useEffect(() => {
    if (categories.length === 0) {
      getCategories()
    }
  }, [categories.length, getCategories])

  const onSubmit = async (data: CoverLetterFormData) => {
    try {
      clearError()
      const content = await generateCoverLetter(data)
      onGenerate(content)
    } catch (error) {
      console.error('Ön yazı oluşturma hatası:', error)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='h-5 w-5' />
          Ön Yazı Oluşturucu
        </CardTitle>
        <CardDescription>Pozisyona özel profesyonel ön yazı oluşturun</CardDescription>
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

          {/* Category Selection */}
          <div className='space-y-2'>
            <Label htmlFor='categoryId'>Meslek Kategorisi</Label>
            <Select
              value={watch('categoryId')}
              onValueChange={(value) => setValue('categoryId', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='İlgili meslek kategorisini seçin' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className='space-y-1'>
                      <p className='font-medium'>{category.name}</p>
                      <p className='text-xs text-muted-foreground'>{category.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className='text-sm text-destructive'>{errors.categoryId.message}</p>}
          </div>

          {/* Full Name */}
          <div className='space-y-2'>
            <Label htmlFor='fullName'>Ad Soyad</Label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='fullName'
                placeholder='ör. Ahmet Yılmaz'
                className='pl-10'
                {...register('fullName')}
                disabled={isSubmitting || isGenerating}
              />
            </div>
            {errors.fullName && <p className='text-sm text-destructive'>{errors.fullName.message}</p>}
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

          {/* Company Name */}
          <div className='space-y-2'>
            <Label htmlFor='companyName'>Şirket Adı</Label>
            <div className='relative'>
              <Building className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='companyName'
                placeholder='ör. ABC Teknoloji'
                className='pl-10'
                {...register('companyName')}
                disabled={isSubmitting || isGenerating}
              />
            </div>
            {errors.companyName && <p className='text-sm text-destructive'>{errors.companyName.message}</p>}
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
            {isGenerating ? 'Ön Yazı Oluşturuluyor...' : 'Ön Yazı Oluştur'}
          </Button>

          {uploadedCVs.length === 0 && (
            <p className='text-sm text-muted-foreground text-center'>
              Ön yazı oluşturmak için önce bir CV yüklemeniz gerekiyor
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
