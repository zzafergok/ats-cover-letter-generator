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
import {
  Loader2,
  FileText,
  Send,
  Search,
  Code,
  PiggyBank,
  ArrowLeft,
  Heart,
  GraduationCap,
  Megaphone,
} from 'lucide-react'
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
  const [industryFilter, setIndustryFilter] = useState<
    'ALL' | 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING'
  >('ALL')
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

  const handleBackToTemplates = () => {
    setSelectedTemplate(null)
    form.reset()
    setGeneratedContent('')
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
      NURSE: 'Hemşire',
      DOCTOR: 'Doktor',
      PHARMACIST: 'Eczacı',
      TEACHER: 'Öğretmen',
      ACADEMIC_ADMINISTRATOR: 'Akademik Yönetici',
      MARKETING_SPECIALIST: 'Pazarlama Uzmanı',
    }
    return categoryMap[category] || category
  }

  const getIndustryBadgeProps = (industry: string) => {
    const industryStyles: Record<string, { className: string; displayName: string }> = {
      TECHNOLOGY: {
        className: '!bg-blue-100 !text-blue-800 dark:!bg-blue-900 dark:!text-blue-300',
        displayName: 'Teknoloji',
      },
      FINANCE: {
        className: '!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-300',
        displayName: 'Finans',
      },
      HEALTHCARE: {
        className: '!bg-red-100 !text-red-800 dark:!bg-red-900 dark:!text-red-300',
        displayName: 'Sağlık',
      },
      EDUCATION: {
        className: '!bg-amber-100 !text-amber-800 dark:!bg-amber-900 dark:!text-amber-300',
        displayName: 'Eğitim',
      },
      MARKETING: {
        className: '!bg-purple-100 !text-purple-800 dark:!bg-purple-900 dark:!text-purple-300',
        displayName: 'Pazarlama',
      },
    }
    return (
      industryStyles[industry] || {
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        displayName: industry,
      }
    )
  }

  const getCategoryBadgeProps = (category: string, industry: string) => {
    // Kategorileri endüstrilerine göre grupla ve her endüstri için kendi rengini kullan
    const categoryToIndustry: Record<string, string> = {
      SOFTWARE_DEVELOPER: 'TECHNOLOGY',
      FRONTEND_DEVELOPER: 'TECHNOLOGY',
      BACKEND_DEVELOPER: 'TECHNOLOGY',
      FULLSTACK_DEVELOPER: 'TECHNOLOGY',
      DATA_SCIENTIST: 'TECHNOLOGY',
      FINANCIAL_ANALYST: 'FINANCE',
      INVESTMENT_BANKER: 'FINANCE',
      FINANCIAL_ADVISOR: 'FINANCE',
      ACCOUNTING_SPECIALIST: 'FINANCE',
      RISK_ANALYST: 'FINANCE',
      NURSE: 'HEALTHCARE',
      DOCTOR: 'HEALTHCARE',
      PHARMACIST: 'HEALTHCARE',
      TEACHER: 'EDUCATION',
      ACADEMIC_ADMINISTRATOR: 'EDUCATION',
      MARKETING_SPECIALIST: 'MARKETING',
    }

    const categoryIndustry = categoryToIndustry[category] || industry
    const industryStyle = getIndustryBadgeProps(categoryIndustry)

    // Kategori badge'ları için biraz daha açık tonlar kullan
    const lightClassName = industryStyle.className
      .replace('!bg-blue-100', '!bg-blue-50')
      .replace('!bg-green-100', '!bg-green-50')
      .replace('!bg-red-100', '!bg-red-50')
      .replace('!bg-amber-100', '!bg-amber-50')
      .replace('!bg-purple-100', '!bg-purple-50')
      .replace('dark:!bg-blue-900', 'dark:!bg-blue-800')
      .replace('dark:!bg-green-900', 'dark:!bg-green-800')
      .replace('dark:!bg-red-900', 'dark:!bg-red-800')
      .replace('dark:!bg-amber-900', 'dark:!bg-amber-800')
      .replace('dark:!bg-purple-900', 'dark:!bg-purple-800')

    return {
      className: lightClassName,
      displayName: getCategoryDisplayName(category),
    }
  }

  const getLanguageBadgeProps = (language: string) => {
    const languageStyles: Record<string, { className: string; displayName: string }> = {
      TURKISH: {
        className: '!bg-rose-100 !text-rose-800 dark:!bg-rose-900 dark:!text-rose-300', // Vibrant rose/pink
        displayName: 'Türkçe',
      },
      ENGLISH: {
        className: '!bg-cyan-100 !text-cyan-800 dark:!bg-cyan-900 dark:!text-cyan-300', // Vibrant cyan/teal
        displayName: 'İngilizce',
      },
    }
    return (
      languageStyles[language] || {
        className: '!bg-slate-100 !text-slate-800 dark:!bg-slate-800 dark:!text-slate-300',
        displayName: language,
      }
    )
  }

  const shouldShowContent = !!generatedContent

  return (
    <div className='space-y-6'>
      {!selectedTemplate ? (
        <div className='space-y-6'>
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
                    onValueChange={(
                      value: 'ALL' | 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING',
                    ) => setIndustryFilter(value)}
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
                      <SelectItem value='HEALTHCARE'>
                        <div className='flex items-center gap-2'>
                          <Heart className='h-4 w-4' />
                          Sağlık
                        </div>
                      </SelectItem>
                      <SelectItem value='EDUCATION'>
                        <div className='flex items-center gap-2'>
                          <GraduationCap className='h-4 w-4' />
                          Eğitim
                        </div>
                      </SelectItem>
                      <SelectItem value='MARKETING'>
                        <div className='flex items-center gap-2'>
                          <Megaphone className='h-4 w-4' />
                          Pazarlama
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
            <CardContent className='pr-0'>
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
                <div className='grid grid-cols-1 gap-3 max-h-[48rem] overflow-y-auto pr-6 pt-6'>
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className='p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md border-border hover:border-primary/50'
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h3 className='font-semibold text-sm'>{template.title}</h3>
                          <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>{template.description}</p>
                          <div className='flex items-center gap-2 mt-2'>
                            <Badge className={`text-xs border-0 ${getIndustryBadgeProps(template.industry).className}`}>
                              {getIndustryBadgeProps(template.industry).displayName}
                            </Badge>
                            <Badge
                              className={`text-xs border-0 ${getCategoryBadgeProps(template.category, template.industry).className}`}
                            >
                              {getCategoryBadgeProps(template.category, template.industry).displayName}
                            </Badge>
                            <Badge className={`text-xs border-0 ${getLanguageBadgeProps(template.language).className}`}>
                              {getLanguageBadgeProps(template.language).displayName}
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
        </div>
      ) : (
        <>
          {/* Back to Templates Button */}
          <div className='mb-6'>
            <Button variant='outline' onClick={handleBackToTemplates} className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Şablonlara Dön
            </Button>
          </div>

          {/* Form and Generated Content Section */}
          <div className='grid gap-4 md:gap-6 lg:grid-cols-2 grid-cols-1'>
            {/* Form Section */}
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

            {/* Generated Content Display */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Oluşturulan Ön Yazı</CardTitle>
              </CardHeader>
              <CardContent>
                {shouldShowContent ? (
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
                    onDownload={async (_format, _downloadType, editedContent) => {
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
                ) : (
                  <div className='flex items-center justify-center py-12'>
                    <div className='text-center text-muted-foreground'>
                      <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                      <p className='text-sm'>Ön yazı oluşturulduktan sonra burada görüntülenecek</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
