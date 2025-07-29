'use client'

import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, FileText, Wand2, AlertCircle, Building, Tags } from 'lucide-react'

import { useCVStore } from '@/store/cvStore'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { cvFromUploadSchema, type CVFromUploadFormValues, type CVType } from '@/lib/validations'
import { ContentViewer } from '@/components/ui/common/ContentViewer'

type CVGeneratorFormData = CVFromUploadFormValues

interface CVUpload {
  id: string
  originalName: string
  uploadDate: string
}

interface UseCVStoreReturn {
  uploadedCVs: CVUpload[]
  selectedCV: CVUpload | null
  generateCV: (data: unknown) => Promise<string>
  isGenerating: boolean
  error: string | null
  clearError: () => void
}

interface CVGeneratorFormProps {
  onGenerate?: (content: string, data?: CVGeneratorFormData) => void
  className?: string
}

export function CVGeneratorForm({ onGenerate, className }: CVGeneratorFormProps) {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const { uploadedCVs, selectedCV, generateCV, isGenerating, error, clearError } = useCVStore() as UseCVStoreReturn

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CVGeneratorFormData>({
    resolver: zodResolver(cvFromUploadSchema),
    defaultValues: {
      cvUploadId: '',
      positionTitle: '',
      companyName: '',
      cvType: 'ATS_OPTIMIZED',
      jobDescription: '',
      additionalRequirements: '',
      targetKeywords: '',
    },
  })

  const onSubmit = async (data: CVGeneratorFormData) => {
    try {
      clearError()

      const cvData = {
        cvUploadId: data.cvUploadId,
        positionTitle: data.positionTitle,
        companyName: data.companyName,
        cvType: data.cvType,
        jobDescription: data.jobDescription,
        additionalRequirements: data.additionalRequirements || undefined,
        targetKeywords: data.targetKeywords
          ? data.targetKeywords
              .split(',')
              .map((k) => k.trim())
              .filter((k) => k)
          : undefined,
      }

      const content = await generateCV(cvData)
      setGeneratedContent(content)
      onGenerate?.(content, data)
    } catch (error) {
      console.error('CV oluşturma hatası:', error)
    }
  }

  const handleReset = () => {
    reset()
    clearError()
    setGeneratedContent(null)
  }

  const cvType = watch('cvType')
  const targetKeywords = watch('targetKeywords')

  const cvTypeDescriptions: Record<CVType, string> = {
    ATS_OPTIMIZED: 'ATS sistemlerine uygun, anahtar kelime odaklı profesyonel CV formatı',
    CREATIVE: 'Yaratıcı sektörler için görsel ve etkileyici tasarım odaklı CV',
    TECHNICAL: 'Teknik pozisyonlar için detaylı beceri ve proje odaklı CV formatı',
  }

  const cvTypeDisplayNames: Record<CVType, string> = {
    ATS_OPTIMIZED: 'ATS Uyumlu',
    CREATIVE: 'Yaratıcı',
    TECHNICAL: 'Teknik',
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Wand2 className='h-5 w-5' />
          CV Oluştur
        </CardTitle>
        <CardDescription>Seçtiğiniz pozisyon için ATS uyumlu ve profesyonel CV oluşturun</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* CV Upload Selection */}
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
              <Select value={watch('cvUploadId') || ''} onValueChange={(value) => setValue('cvUploadId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Yüklenmiş CV dosyalarınızdan birini seçiniz' />
                </SelectTrigger>
                <SelectContent>
                  {uploadedCVs.map((cv: CVUpload) => (
                    <SelectItem key={cv.id} value={cv.id}>
                      <div className='flex items-center gap-2'>
                        <FileText className='h-4 w-4' />
                        <span>
                          {cv.originalName} ({formatDate(cv.uploadDate)})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
                <div className='flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4 text-orange-600' />
                  <p className='text-sm text-orange-800'>
                    CV oluşturmak için önce bir CV dosyası yüklemeniz gerekiyor. Lütfen &quot;CV Yükle&quot; sekmesinden
                    bir dosya yükleyiniz.
                  </p>
                </div>
              </div>
            )}
            {errors.cvUploadId && <p className='text-sm text-destructive'>{errors.cvUploadId.message}</p>}
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
                disabled={isSubmitting || isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
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
                disabled={isSubmitting || isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
              />
            </div>
            {errors.companyName && <p className='text-sm text-destructive'>{errors.companyName.message}</p>}
          </div>

          {/* CV Type  */}
          <div className='space-y-2'>
            <Label htmlFor='cvType'>CV Tipi *</Label>
            <Select
              value={cvType}
              onValueChange={(value) => setValue('cvType', value as 'ATS_OPTIMIZED' | 'CREATIVE' | 'TECHNICAL')}
              disabled={isSubmitting || isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
            >
              <SelectTrigger>
                <SelectValue placeholder='CV tipini seçiniz' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(cvTypeDisplayNames).map(([key, displayName]) => (
                  <SelectItem key={key} value={key}>
                    <div className='space-y-1'>
                      <p className='font-medium'>{displayName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {cvTypeDescriptions[key as keyof typeof cvTypeDescriptions]}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cvType && <p className='text-sm text-destructive'>{errors.cvType.message}</p>}
          </div>
          {/* Job Description */}
          <div className='space-y-2'>
            <Label htmlFor='jobDescription'>İş Tanımı *</Label>
            <Textarea
              id='jobDescription'
              placeholder="İş ilanından iş tanımını ve gereksinimlerini buraya kopyalayınız. Bu bilgiler CV'nizin pozisyona uygun şekilde optimize edilmesi için kullanılacaktır."
              rows={6}
              {...register('jobDescription')}
              disabled={isSubmitting || isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
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
              disabled={isSubmitting || isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
            />
            <p className='text-xs text-muted-foreground'>
              {watch('additionalRequirements')?.length || 0} / 2000 karakter
            </p>
            {errors.additionalRequirements && (
              <p className='text-sm text-destructive'>{errors.additionalRequirements.message}</p>
            )}
          </div>
          {/* Target Keywords (Optional) */}
          <div className='space-y-2'>
            <Label htmlFor='targetKeywords'>Hedef Anahtar Kelimeler (Opsiyonel)</Label>
            <div className='relative'>
              <Tags className='absolute left-3 top-3 text-muted-foreground h-4 w-4' />
              <Textarea
                id='targetKeywords'
                placeholder="CV'nizde öne çıkarılmasını istediğiniz anahtar kelimeleri virgülle ayırarak yazınız. ör. React, TypeScript, Node.js"
                rows={2}
                className='pl-10'
                {...register('targetKeywords')}
                disabled={isSubmitting || isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
              />
            </div>
            <p className='text-xs text-muted-foreground'>
              {targetKeywords
                ? `${targetKeywords.split(',').filter((k) => k.trim()).length} / 20 anahtar kelime`
                : '0 / 20 anahtar kelime'}
            </p>
            {errors.targetKeywords && <p className='text-sm text-destructive'>{errors.targetKeywords.message}</p>}
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
              disabled={isSubmitting || isGenerating || (!selectedCV && (!uploadedCVs || uploadedCVs.length === 0))}
              className='flex-1'
            >
              {isGenerating && <Wand2 className='mr-2 h-4 w-4 animate-spin' />}
              {isGenerating ? 'CV Oluşturuluyor...' : 'CV Oluştur'}
            </Button>

            <Button type='button' variant='outline' onClick={handleReset} disabled={isSubmitting || isGenerating}>
              Formu Temizle
            </Button>
          </div>
          {!selectedCV && (!uploadedCVs || uploadedCVs.length === 0) && (
            <div className='bg-muted/50 border border-muted rounded-lg p-4'>
              <div className='flex items-center gap-2'>
                <AlertCircle className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  CV oluşturmak için önce &quot;CV Yükle&quot; sekmesinden bir CV dosyası yüklemeniz gerekmektedir.
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>

      {/* Generated CV Content */}
      {generatedContent && (
        <>
          <div className='border-t border-border mt-6' />
          <CardContent className='pt-6'>
            <ContentViewer
              content={generatedContent}
              title={`${watch('positionTitle')} - ${watch('companyName')}`}
              type='cv'
              metadata={{
                createdAt: new Date().toISOString(),
                wordCount: generatedContent.split(' ').length,
                characterCount: generatedContent.length,
                estimatedReadTime: Math.ceil(generatedContent.split(' ').length / 200),
              }}
              onSave={async ({ title, content }) => {
                // Save CV functionality can be implemented here
                console.log('Save CV:', { title, content })
              }}
              onDownload={async (format) => {
                // Download functionality can be implemented here
                console.log('Download CV as:', format)
              }}
            />
          </CardContent>
        </>
      )}
    </Card>
  )
}
