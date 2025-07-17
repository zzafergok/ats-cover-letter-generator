// src/components/cover-letter/CoverLetterGenerator.tsx
'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Building, User, Briefcase, Wand2, AlertCircle } from 'lucide-react'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

interface CVUpload {
  id: string
  fileName: string
  uploadedAt: string
  fileSize: number
  extractedText?: string
  keywords: string[]
}

const coverLetterSchema = z.object({
  cvUploadId: z.string().min(1, 'CV seçimi gereklidir'),
  category: z.string().min(1, 'Kategori seçimi gereklidir'),
  positionTitle: z.string().min(1, 'İş pozisyonu gereklidir').max(100, 'İş pozisyonu maksimum 100 karakter olabilir'),
  companyName: z.string().min(1, 'Şirket adı gereklidir').max(100, 'Şirket adı maksimum 100 karakter olabilir'),
  contactPerson: z.string().optional(),
  jobDescription: z
    .string()
    .min(10, 'İş tanımı en az 10 karakter olmalıdır')
    .max(5000, 'İş tanımı maksimum 5000 karakter olabilir'),
  additionalRequirements: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 2000, 'Ek gereksinimler maksimum 2000 karakter olabilir'),
})

type CoverLetterFormData = z.infer<typeof coverLetterSchema>

interface CoverLetterGeneratorProps {
  onGenerate: (content: string, data?: CoverLetterFormData) => void
  selectedCVUpload?: CVUpload | null
  className?: string
}

export function CoverLetterGenerator({ onGenerate, selectedCVUpload, className }: CoverLetterGeneratorProps) {
  const { categories, getCategories, generateCoverLetter, isGenerating, isLoading, error, clearError } =
    useCoverLetterStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CoverLetterFormData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      cvUploadId: selectedCVUpload?.id || '',
      category: '',
      positionTitle: '',
      companyName: '',
      contactPerson: '',
      jobDescription: '',
      additionalRequirements: '',
    },
  })

  useEffect(() => {
    if (categories.length === 0) {
      getCategories()
    }
  }, [categories.length, getCategories])

  useEffect(() => {
    if (selectedCVUpload?.id) {
      setValue('cvUploadId', selectedCVUpload.id)
    }
  }, [selectedCVUpload, setValue])

  const onSubmit = async (data: CoverLetterFormData) => {
    try {
      clearError()

      const coverLetterData = {
        cvUploadId: data.cvUploadId,
        category: data.category,
        positionTitle: data.positionTitle,
        companyName: data.companyName,
        contactPerson: data.contactPerson || undefined,
        jobDescription: data.jobDescription,
        additionalRequirements: data.additionalRequirements || undefined,
      }

      const content = await generateCoverLetter(coverLetterData)
      onGenerate(content, data)
    } catch (error) {
      console.error('Ön yazı oluşturma hatası:', error)
    }
  }

  const handleReset = () => {
    reset()
    clearError()
  }

  const getCategoryDisplayName = (categoryKey: string) => {
    const categoryNames: Record<string, string> = {
      SOFTWARE_DEVELOPER: 'Yazılım Geliştirici',
      DATA_SCIENTIST: 'Veri Bilimci',
      MARKETING: 'Pazarlama',
      SALES: 'Satış',
      FINANCE: 'Finans',
      HUMAN_RESOURCES: 'İnsan Kaynakları',
      GENERAL: 'Genel',
    }
    return categoryNames[categoryKey] || categoryKey
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='h-5 w-5' />
          Ön Yazı Oluşturucu
        </CardTitle>
        <CardDescription>Seçtiğiniz pozisyon için profesyonel ve kişiselleştirilmiş ön yazı oluşturun</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* CV Upload Selection */}
          <div className='space-y-2'>
            <Label htmlFor='cvUploadId'>CV Dosyası Seçimi *</Label>
            {selectedCVUpload ? (
              <div className='p-3 border rounded-lg bg-muted/50'>
                <div className='flex items-center gap-2'>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                  <span className='font-medium text-sm'>{selectedCVUpload.fileName}</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Yükleme tarihi: {new Date(selectedCVUpload.uploadedAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
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

          {/* Category Selection */}
          <div className='space-y-2'>
            <Label htmlFor='category'>Meslek Kategorisi *</Label>
            <Select
              value={watch('category')}
              onValueChange={(value) => setValue('category', value)}
              disabled={isLoading || !selectedCVUpload}
            >
              <SelectTrigger>
                <SelectValue placeholder='İlgili meslek kategorisini seçiniz' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category.key}>
                    <div className='space-y-1'>
                      <p className='font-medium'>{getCategoryDisplayName(category.key)}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className='text-sm text-destructive'>{errors.category.message}</p>}
          </div>

          {/* Position Title */}
          <div className='space-y-2'>
            <Label htmlFor='positionTitle'>İş Pozisyonu *</Label>
            <div className='relative'>
              <Briefcase className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='positionTitle'
                placeholder='ör. Frontend Developer, Pazarlama Uzmanı'
                className='pl-10'
                {...register('positionTitle')}
                disabled={isSubmitting || isGenerating || !selectedCVUpload}
              />
            </div>
            {errors.positionTitle && <p className='text-sm text-destructive'>{errors.positionTitle.message}</p>}
          </div>

          {/* Company Name */}
          <div className='space-y-2'>
            <Label htmlFor='companyName'>Şirket Adı *</Label>
            <div className='relative'>
              <Building className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='companyName'
                placeholder='ör. ABC Teknoloji, XYZ Holding'
                className='pl-10'
                {...register('companyName')}
                disabled={isSubmitting || isGenerating || !selectedCVUpload}
              />
            </div>
            {errors.companyName && <p className='text-sm text-destructive'>{errors.companyName.message}</p>}
          </div>

          {/* Contact Person (Optional) */}
          <div className='space-y-2'>
            <Label htmlFor='contactPerson'>İletişim Kişisi (Opsiyonel)</Label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='contactPerson'
                placeholder='ör. İK Müdürü, Sayın Ahmet Bey'
                className='pl-10'
                {...register('contactPerson')}
                disabled={isSubmitting || isGenerating || !selectedCVUpload}
              />
            </div>
            {errors.contactPerson && <p className='text-sm text-destructive'>{errors.contactPerson.message}</p>}
          </div>

          {/* Job Description */}
          <div className='space-y-2'>
            <Label htmlFor='jobDescription'>İş Tanımı *</Label>
            <Textarea
              id='jobDescription'
              placeholder='İş ilanından iş tanımını ve gereksinimlerini buraya kopyalayınız. Bu bilgiler ön yazınızın pozisyona uygun şekilde hazırlanması için kullanılacaktır.'
              rows={6}
              {...register('jobDescription')}
              disabled={isSubmitting || isGenerating || !selectedCVUpload}
            />
            <p className='text-xs text-muted-foreground'>{watch('jobDescription')?.length || 0} / 5000 karakter</p>
            {errors.jobDescription && <p className='text-sm text-destructive'>{errors.jobDescription.message}</p>}
          </div>

          {/* Additional Requirements (Optional) */}
          <div className='space-y-2'>
            <Label htmlFor='additionalRequirements'>Ek Gereksinimler (Opsiyonel)</Label>
            <Textarea
              id='additionalRequirements'
              placeholder='Pozisyon için önemli olan ek beceriler, sertifikalar veya deneyimler hakkında bilgi verebilirsiniz.'
              rows={3}
              {...register('additionalRequirements')}
              disabled={isSubmitting || isGenerating || !selectedCVUpload}
            />
            <p className='text-xs text-muted-foreground'>
              {watch('additionalRequirements')?.length || 0} / 2000 karakter
            </p>
            {errors.additionalRequirements && (
              <p className='text-sm text-destructive'>{errors.additionalRequirements.message}</p>
            )}
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
            <Button type='submit' disabled={isSubmitting || isGenerating || !selectedCVUpload} className='flex-1'>
              {isGenerating && <Wand2 className='mr-2 h-4 w-4 animate-spin' />}
              {isGenerating ? 'Ön Yazı Oluşturuluyor...' : 'Ön Yazı Oluştur'}
            </Button>

            <Button type='button' variant='outline' onClick={handleReset} disabled={isSubmitting || isGenerating}>
              Formu Temizle
            </Button>
          </div>

          {!selectedCVUpload && (
            <div className='bg-muted/50 border border-muted rounded-lg p-4'>
              <div className='flex items-center gap-2'>
                <AlertCircle className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  Ön yazı oluşturmak için önce &quot;CV Yükle&quot; sekmesinden bir CV dosyası yüklemeniz gerekmektedir.
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
