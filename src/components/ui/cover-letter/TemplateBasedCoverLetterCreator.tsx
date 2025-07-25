'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Form } from '@/components/form/Form'
import { Badge } from '@/components/core/badge'
import { Input } from '@/components/core/input'
import { Textarea } from '@/components/core/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Loader2, FileText, Send, Search, Code, PiggyBank } from 'lucide-react'
import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { useTemplateStore } from '@/store/templateStore'
import type { CoverLetterTemplate } from '@/types/api.types'

const templateCoverLetterSchema = z.object({
  templateId: z.string().min(1, 'Şablon seçimi zorunludur'),
  positionTitle: z.string().min(1, 'Pozisyon başlığı zorunludur'),
  companyName: z.string().min(1, 'Şirket adı zorunludur'),
  whyPosition: z.string().min(10, 'Pozisyon motivasyonu en az 10 karakter olmalıdır'),
  whyCompany: z.string().min(10, 'Şirket motivasyonu en az 10 karakter olmalıdır'),
  additionalSkills: z.string().optional(),
})

type TemplateCoverLetterFormData = z.infer<typeof templateCoverLetterSchema>

export function TemplateBasedCoverLetterCreator() {
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterTemplate | null>(null)
  const [industryFilter, setIndustryFilter] = useState<'ALL' | 'TECHNOLOGY' | 'FINANCE'>('ALL')
  const [languageFilter, setLanguageFilter] = useState<'ALL' | 'TURKISH' | 'ENGLISH'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const {
    templates,
    isLoading,
    error,
    getAllTemplates,
    getTemplateCategories,
    createCoverLetterFromTemplate,
    downloadTemplateBasedCoverLetterPdf,
  } = useTemplateStore()

  const form = useForm<TemplateCoverLetterFormData>({
    resolver: zodResolver(templateCoverLetterSchema),
    defaultValues: {
      templateId: '',
      positionTitle: '',
      companyName: '',
      whyPosition: '',
      whyCompany: '',
      additionalSkills: '',
    },
  })

  useEffect(() => {
    getAllTemplates()
    getTemplateCategories()
  }, [getAllTemplates, getTemplateCategories])

  // Filter templates based on selected filters
  const filteredTemplates = React.useMemo(() => {
    let filtered = templates

    if (industryFilter !== 'ALL') {
      filtered = filtered.filter((template) => template.industry === industryFilter)
    }

    if (languageFilter !== 'ALL') {
      filtered = filtered.filter((template) => template.language === languageFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [templates, industryFilter, languageFilter, searchTerm])

  const handleTemplateSelect = (template: CoverLetterTemplate) => {
    setSelectedTemplate(template)
    form.setValue('templateId', template.id)
  }

  const onSubmit = useCallback(
    async (data: TemplateCoverLetterFormData) => {
      if (!selectedTemplate) return

      try {
        const result = await createCoverLetterFromTemplate({
          templateId: data.templateId,
          positionTitle: data.positionTitle,
          companyName: data.companyName,
          personalizations: {
            whyPosition: data.whyPosition,
            whyCompany: data.whyCompany,
            additionalSkills: data.additionalSkills || '',
          },
        })

        if (result) {
          setGeneratedContent(result.content)
        }
      } catch (error) {
        console.error('Template cover letter generation failed:', error)
      }
    },
    [selectedTemplate, createCoverLetterFromTemplate],
  )

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      SOFTWARE_DEVELOPER: 'Yazılım Geliştirici',
      FRONTEND_DEVELOPER: 'Frontend Geliştirici',
      BACKEND_DEVELOPER: 'Backend Geliştirici',
      FULLSTACK_DEVELOPER: 'Fullstack Geliştirici',
      DATA_SCIENTIST: 'Veri Bilimci',
      FINANCIAL_ANALYST: 'Finansal Analist',
      INVESTMENT_BANKER: 'Yatırım Bankacısı',
      FINANCIAL_ADVISOR: 'Mali Müşavir',
      ACCOUNTING_SPECIALIST: 'Muhasebe Uzmanı',
      RISK_ANALYST: 'Risk Analisti',
    }
    return categoryMap[category] || category
  }

  const shouldShowContent = !!generatedContent

  return (
    <div className={`grid gap-4 md:gap-6 ${shouldShowContent ? 'xl:grid-cols-2' : 'grid-cols-1'}`}>
      {/* Template Selection & Form Section */}
      <div className='space-y-6'>
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Şablon Filtreleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>Sektör</label>
                <Select
                  value={industryFilter}
                  onValueChange={(value: 'ALL' | 'TECHNOLOGY' | 'FINANCE') => setIndustryFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ALL'>Tüm Sektörler</SelectItem>
                    <SelectItem value='TECHNOLOGY'>
                      <div className='flex items-center gap-2'>
                        <Code className='h-4 w-4' />
                        Teknoloji
                      </div>
                    </SelectItem>
                    <SelectItem value='FINANCE'>
                      <div className='flex items-center gap-2'>
                        <PiggyBank className='h-4 w-4' />
                        Finans
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='text-sm font-medium mb-2 block'>Dil</label>
                <Select
                  value={languageFilter}
                  onValueChange={(value: 'ALL' | 'TURKISH' | 'ENGLISH') => setLanguageFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ALL'>Tüm Diller</SelectItem>
                    <SelectItem value='TURKISH'>Türkçe</SelectItem>
                    <SelectItem value='ENGLISH'>İngilizce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='text-sm font-medium mb-2 block'>Arama</label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    placeholder='Şablon ara...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Şablon Seçimi</CardTitle>
            <p className='text-sm text-muted-foreground'>{filteredTemplates.length} şablon bulundu</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin' />
                <span className='ml-2'>Şablonlar yükleniyor...</span>
              </div>
            ) : error ? (
              <div className='text-red-600 text-center py-4'>{error}</div>
            ) : filteredTemplates.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>Seçilen kriterlere uygun şablon bulunamadı</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-3 max-h-80 overflow-y-auto'>
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h3 className='font-semibold text-sm'>{template.title}</h3>
                        <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>{template.description}</p>
                        <div className='flex items-center gap-2 mt-2'>
                          <Badge
                            variant={template.industry === 'TECHNOLOGY' ? 'default' : 'secondary'}
                            className='text-xs'
                          >
                            {template.industry === 'TECHNOLOGY' ? 'Teknoloji' : 'Finans'}
                          </Badge>
                          <Badge variant='outline' className='text-xs'>
                            {getCategoryDisplayName(template.category)}
                          </Badge>
                          <Badge variant='outline' className='text-xs'>
                            {template.language === 'TURKISH' ? 'Türkçe' : 'İngilizce'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Section */}
        {selectedTemplate && (
          <Form.Root form={form} onSubmit={onSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Ön Yazı Bilgileri</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Seçilen şablon: <span className='font-medium'>{selectedTemplate.title}</span>
                </p>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Position Title */}
                <Form.Field name='positionTitle' label='Pozisyon Başlığı *' required>
                  {(field) => <Input placeholder='ör. Senior Frontend Developer' {...field} />}
                </Form.Field>

                {/* Company Name */}
                <Form.Field name='companyName' label='Şirket Adı *' required>
                  {(field) => <Input placeholder='ör. TechCorp Inc.' {...field} />}
                </Form.Field>

                {/* Why Position */}
                <Form.Field name='whyPosition' label='Bu Pozisyonu Neden İstiyorsunuz? *' required>
                  {(field) => (
                    <Textarea
                      placeholder='Bu pozisyonla ilgili motivasyonunuzu, ilgi alanlarınızı ve bu rolde neler yapmak istediğinizi açıklayın...'
                      rows={4}
                      {...field}
                    />
                  )}
                </Form.Field>

                {/* Why Company */}
                <Form.Field name='whyCompany' label='Bu Şirketi Neden Seçtiniz? *' required>
                  {(field) => (
                    <Textarea
                      placeholder='Şirket hakkında ne biliyorsunuz, neden bu şirkette çalışmak istiyorsunuz, şirketin değerleri sizinle nasıl örtüşüyor...'
                      rows={4}
                      {...field}
                    />
                  )}
                </Form.Field>

                {/* Additional Skills */}
                <Form.Field name='additionalSkills' label='Ek Yetenekler (İsteğe Bağlı)'>
                  {(field) => (
                    <Textarea
                      placeholder='Pozisyonla ilgili öne çıkarmak istediğiniz ek yetenekler, teknolojiler veya deneyimler...'
                      rows={3}
                      {...field}
                    />
                  )}
                </Form.Field>

                {/* Generate Button */}
                <Button type='submit' disabled={isLoading} className='w-full'>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Ön Yazı Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Send className='mr-2 h-4 w-4' />
                      Şablondan Ön Yazı Oluştur
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </Form.Root>
        )}
      </div>

      {/* Generated Content Display */}
      {shouldShowContent && (
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Oluşturulan Ön Yazı</h3>
          <ContentViewer
            content={generatedContent}
            title={`${form.watch('companyName')} - ${form.watch('positionTitle')} Ön Yazısı`}
            type='cover-letter-template'
            metadata={{
              templateTitle: selectedTemplate?.title || '',
              companyName: form.watch('companyName'),
              positionTitle: form.watch('positionTitle'),
              templateCategory: selectedTemplate?.category || '',
              language: selectedTemplate?.language || 'TURKISH',
            }}
            onDownload={async (_format, downloadType, editedContent) => {
              try {
                await downloadTemplateBasedCoverLetterPdf({
                  content: editedContent || generatedContent,
                  positionTitle: form.watch('positionTitle'),
                  companyName: form.watch('companyName'),
                  templateTitle: selectedTemplate?.title,
                  language: selectedTemplate?.language,
                })
              } catch (error) {
                console.error('Template PDF download failed:', error)
              }
            }}
            readonly={false}
          />
        </div>
      )}
    </div>
  )
}
