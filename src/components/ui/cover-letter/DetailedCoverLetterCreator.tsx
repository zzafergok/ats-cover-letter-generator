'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Form } from '@/components/form/Form'
import { Loader2, FileText, Send } from 'lucide-react'
import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { useUserProfileStore } from '@/store/userProfileStore'
import { useCoverLetterStore } from '@/store/coverLetterStore'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { MotivationSection } from './sections/MotivationSection'
import { AdditionalInfoSection } from './sections/AdditionalInfoSection'
import type { CoverLetterDetailed, Language } from '@/types/api.types'

const detailedCoverLetterSchema = z.object({
  positionTitle: z.string().min(1, 'Pozisyon başlığı zorunludur'),
  companyName: z.string().min(1, 'Şirket adı zorunludur'),
  language: z.enum(['TURKISH', 'ENGLISH'] as const),
  jobDescription: z.string().min(10, 'İş tanımı en az 10 karakter olmalıdır'),
  whyPosition: z.string().min(10, 'Pozisyon motivasyonu en az 10 karakter olmalıdır'),
  whyCompany: z.string().min(10, 'Şirket motivasyonu en az 10 karakter olmalıdır'),
  workMotivation: z.string().min(10, 'Çalışma motivasyonu en az 10 karakter olmalıdır'),
})

type DetailedCoverLetterFormData = z.infer<typeof detailedCoverLetterSchema>

interface DetailedCoverLetterCreatorProps {
  onCreated?: (coverLetter: CoverLetterDetailed) => void
  className?: string
}

export function DetailedCoverLetterCreator({ onCreated, className }: DetailedCoverLetterCreatorProps) {
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeSection, setActiveSection] = useState<'basic' | 'motivation' | 'additional'>('basic')

  const { profile } = useUserProfileStore()
  const { createDetailedCoverLetter, isGenerating: storeIsGenerating } = useCoverLetterStore()

  const form = useForm<DetailedCoverLetterFormData>({
    resolver: zodResolver(detailedCoverLetterSchema),
    defaultValues: {
      positionTitle: '',
      companyName: '',
      language: 'TURKISH' as Language,
      jobDescription: '',
      whyPosition: '',
      whyCompany: '',
      workMotivation: '',
    },
  })

  // Auto-populate form when profile changes
  useEffect(() => {
    if (profile) {
      // Profile data will be used by the cover letter generation API
      // No need to pre-populate form fields as they are manually entered
    }
  }, [profile])

  const onSubmit = useCallback(
    async (data: DetailedCoverLetterFormData) => {
      try {
        setIsGenerating(true)
        setGeneratedContent('') // Reset previous content

        const result = await createDetailedCoverLetter({
          positionTitle: data.positionTitle,
          companyName: data.companyName,
          jobDescription: data.jobDescription,
          language: data.language,
          whyPosition: data.whyPosition,
          whyCompany: data.whyCompany,
          workMotivation: data.workMotivation,
        })

        if (result) {
          setGeneratedContent(result.content || '')
          onCreated?.(result)
        }
      } catch (error) {
        console.error('Detailed cover letter generation failed:', error)
      } finally {
        setIsGenerating(false)
      }
    },
    [createDetailedCoverLetter, onCreated],
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicInfoSection form={form} />
      case 'motivation':
        return <MotivationSection form={form} />
      case 'additional':
        return <AdditionalInfoSection form={form} />
      default:
        return <BasicInfoSection form={form} />
    }
  }

  const getSectionProgress = () => {
    const values = form.getValues()
    const basicComplete = !!(values.positionTitle && values.companyName && values.language)
    const motivationComplete = !!(values.whyPosition && values.whyCompany)
    const additionalComplete = !!(values.jobDescription && values.workMotivation)

    return { basicComplete, motivationComplete, additionalComplete }
  }

  const { basicComplete, motivationComplete, additionalComplete } = getSectionProgress()
  const allSectionsComplete = basicComplete && motivationComplete && additionalComplete

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Info */}
      {!profile && (
        <Card className='bg-yellow-50 border-yellow-200'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <FileText className='h-5 w-5 text-yellow-600' />
              <div>
                <p className='font-medium text-yellow-800'>Profil Bilgileri Yükleniyor</p>
                <p className='text-sm text-yellow-600'>Lütfen bekleyin...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Form.Root form={form} onSubmit={onSubmit}>
        <div className='space-y-6'>
          {/* Section Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Detaylı Ön Yazı Formu</CardTitle>
              <div className='flex flex-wrap gap-2'>
                <Button
                  type='button'
                  variant={activeSection === 'basic' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setActiveSection('basic')}
                  className='flex items-center gap-2'
                >
                  Temel Bilgiler
                  {basicComplete && <span className='h-2 w-2 bg-green-500 rounded-full' />}
                </Button>
                <Button
                  type='button'
                  variant={activeSection === 'motivation' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setActiveSection('motivation')}
                  className='flex items-center gap-2'
                >
                  Motivasyon
                  {motivationComplete && <span className='h-2 w-2 bg-green-500 rounded-full' />}
                </Button>
                <Button
                  type='button'
                  variant={activeSection === 'additional' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setActiveSection('additional')}
                  className='flex items-center gap-2'
                >
                  Ek Bilgiler
                  {additionalComplete && <span className='h-2 w-2 bg-green-500 rounded-full' />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>{renderSectionContent()}</CardContent>
          </Card>

          {/* Generate Button */}
          <div className='flex justify-center'>
            <Button
              type='submit'
              disabled={isGenerating || storeIsGenerating || !allSectionsComplete}
              className='w-full sm:w-auto min-w-[200px]'
            >
              {isGenerating || storeIsGenerating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Ön Yazı Oluşturuluyor...
                </>
              ) : (
                <>
                  <Send className='mr-2 h-4 w-4' />
                  Detaylı Ön Yazı Oluştur
                </>
              )}
            </Button>
          </div>
        </div>
      </Form.Root>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Oluşturulan Ön Yazı</h3>
          <ContentViewer
            content={generatedContent}
            title={`${form.watch('companyName')} - ${form.watch('positionTitle')} Ön Yazısı`}
            type='cover-letter-detailed'
            metadata={{
              companyName: form.watch('companyName'),
              positionTitle: form.watch('positionTitle'),
              language: form.watch('language'),
            }}
            onDownload={async (_format, downloadType, editedContent) => {
              if (downloadType === 'edited' && editedContent) {
                // This is a temporary generated content, so we use the custom PDF endpoint
                const { downloadDetailedCoverLetterCustomPdf } = useCoverLetterStore.getState()
                await downloadDetailedCoverLetterCustomPdf({
                  content: editedContent,
                  positionTitle: form.watch('positionTitle'),
                  companyName: form.watch('companyName'),
                  language: form.watch('language'),
                })
              }
              // For original download of temporary content, we also use custom endpoint
              else {
                const { downloadDetailedCoverLetterCustomPdf } = useCoverLetterStore.getState()
                await downloadDetailedCoverLetterCustomPdf({
                  content: generatedContent,
                  positionTitle: form.watch('positionTitle'),
                  companyName: form.watch('companyName'),
                  language: form.watch('language'),
                })
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
