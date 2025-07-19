// src/components/ui/template/TemplateForm.tsx
'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Building, Briefcase, Mail, Plus, X, Sparkles, Eye } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Badge } from '@/components/core/badge'
import { LoadingSpinner } from '@/components/core/loading-spinner'

import { useTemplateSelectors, useTemplateActions } from '@/store/templateStore'
import { TEMPLATE_VALIDATION } from '@/services/utils'

// Form validation schema
const templateFormSchema = z.object({
  templateId: z.string().min(1, 'Template seçimi zorunludur'),
  companyName: z
    .string()
    .min(TEMPLATE_VALIDATION.COMPANY_NAME.MIN_LENGTH, 'Şirket adı çok kısa')
    .max(TEMPLATE_VALIDATION.COMPANY_NAME.MAX_LENGTH, 'Şirket adı çok uzun'),
  positionTitle: z
    .string()
    .min(TEMPLATE_VALIDATION.POSITION_TITLE.MIN_LENGTH, 'Pozisyon başlığı çok kısa')
    .max(TEMPLATE_VALIDATION.POSITION_TITLE.MAX_LENGTH, 'Pozisyon başlığı çok uzun'),
  applicantName: z
    .string()
    .min(TEMPLATE_VALIDATION.APPLICANT_NAME.MIN_LENGTH, 'İsim çok kısa')
    .max(TEMPLATE_VALIDATION.APPLICANT_NAME.MAX_LENGTH, 'İsim çok uzun'),
  applicantEmail: z.string().email('Geçerli bir email adresi giriniz'),
  contactPerson: z
    .string()
    .min(TEMPLATE_VALIDATION.CONTACT_PERSON.MIN_LENGTH, 'İletişim kişisi adı çok kısa')
    .max(TEMPLATE_VALIDATION.CONTACT_PERSON.MAX_LENGTH, 'İletişim kişisi adı çok uzun'),
  specificSkills: z
    .array(z.string().max(TEMPLATE_VALIDATION.SPECIFIC_SKILLS.MAX_LENGTH))
    .max(TEMPLATE_VALIDATION.SPECIFIC_SKILLS.MAX_COUNT, 'En fazla 10 beceri ekleyebilirsiniz')
    .optional(),
  additionalInfo: z.string().max(TEMPLATE_VALIDATION.ADDITIONAL_INFO.MAX_LENGTH, 'Ek bilgi çok uzun').optional(),
})

type TemplateFormData = z.infer<typeof templateFormSchema>

interface TemplateFormProps {
  onSubmit?: (data: TemplateFormData) => void
  onPreview?: (data: TemplateFormData) => void
  className?: string
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ onSubmit, onPreview, className = '' }) => {
  const { selectedTemplate, selectedTemplateDetail, formData, validationErrors, isGenerating, error } =
    useTemplateSelectors()

  const { setFormData, clearValidationErrors, fetchTemplateDetail, generateCoverLetter } = useTemplateActions()

  const [skills, setSkills] = React.useState<string[]>(formData.specificSkills || [])
  const [newSkill, setNewSkill] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      templateId: selectedTemplate || '',
      companyName: formData.companyName || '',
      positionTitle: formData.positionTitle || '',
      applicantName: formData.applicantName || '',
      applicantEmail: formData.applicantEmail || '',
      contactPerson: formData.contactPerson || '',
      specificSkills: skills,
      additionalInfo: formData.additionalInfo || '',
    },
    mode: 'onChange',
  })

  const watchedValues = watch()

  // Load template detail when selected template changes
  useEffect(() => {
    if (selectedTemplate) {
      setValue('templateId', selectedTemplate)
      fetchTemplateDetail(selectedTemplate)
    }
  }, [selectedTemplate, setValue, fetchTemplateDetail])

  // Update form data in store when form values change
  useEffect(() => {
    setFormData({
      ...watchedValues,
      specificSkills: skills,
    })
  }, [watchedValues, skills, setFormData])

  // Handle skill management
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim()) && skills.length < 10) {
      const updatedSkills = [...skills, newSkill.trim()]
      setSkills(updatedSkills)
      setValue('specificSkills', updatedSkills)
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
    setSkills(updatedSkills)
    setValue('specificSkills', updatedSkills)
  }

  // Handle form submission
  const onFormSubmit = async (data: TemplateFormData) => {
    clearValidationErrors()

    try {
      const result = await generateCoverLetter({
        ...data,
        specificSkills: skills,
      })

      if (result) {
        onSubmit?.(data)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // Handle preview
  const handlePreview = () => {
    onPreview?.(watchedValues as TemplateFormData)
  }

  if (!selectedTemplate) {
    return (
      <Card>
        <CardContent className='pt-6 text-center'>
          <p className='text-muted-foreground'>Önce bir template seçin</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Template Info */}
      {selectedTemplateDetail && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Sparkles className='h-5 w-5 text-primary' />
              <span>{selectedTemplateDetail.title}</span>
            </CardTitle>
            <CardDescription>{selectedTemplateDetail.placeholders.length} alan doldurulacak</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
            <CardDescription>Cover letter&apos;da kullanılacak kişisel bilgilerinizi girin</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='applicantName'>Adınız Soyadınız *</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='applicantName'
                    placeholder='ör. Ahmet Yılmaz'
                    className='pl-10'
                    {...register('applicantName')}
                  />
                </div>
                {errors.applicantName && <p className='text-sm text-destructive'>{errors.applicantName.message}</p>}
                {validationErrors.applicantName && (
                  <p className='text-sm text-destructive'>{validationErrors.applicantName}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='applicantEmail'>Email Adresiniz *</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='applicantEmail'
                    type='email'
                    placeholder='ör. ahmet@email.com'
                    className='pl-10'
                    {...register('applicantEmail')}
                  />
                </div>
                {errors.applicantEmail && <p className='text-sm text-destructive'>{errors.applicantEmail.message}</p>}
                {validationErrors.applicantEmail && (
                  <p className='text-sm text-destructive'>{validationErrors.applicantEmail}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pozisyon Bilgileri</CardTitle>
            <CardDescription>Başvurduğunuz pozisyon ve şirket bilgilerini girin</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='companyName'>Şirket Adı *</Label>
                <div className='relative'>
                  <Building className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input id='companyName' placeholder='ör. Microsoft' className='pl-10' {...register('companyName')} />
                </div>
                {errors.companyName && <p className='text-sm text-destructive'>{errors.companyName.message}</p>}
                {validationErrors.companyName && (
                  <p className='text-sm text-destructive'>{validationErrors.companyName}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='positionTitle'>Pozisyon Başlığı *</Label>
                <div className='relative'>
                  <Briefcase className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='positionTitle'
                    placeholder='ör. Senior Frontend Developer'
                    className='pl-10'
                    {...register('positionTitle')}
                  />
                </div>
                {errors.positionTitle && <p className='text-sm text-destructive'>{errors.positionTitle.message}</p>}
                {validationErrors.positionTitle && (
                  <p className='text-sm text-destructive'>{validationErrors.positionTitle}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='contactPerson'>İletişim Kişisi *</Label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                  id='contactPerson'
                  placeholder='ör. İnsan Kaynakları Müdürü'
                  className='pl-10'
                  {...register('contactPerson')}
                />
              </div>
              {errors.contactPerson && <p className='text-sm text-destructive'>{errors.contactPerson.message}</p>}
              {validationErrors.contactPerson && (
                <p className='text-sm text-destructive'>{validationErrors.contactPerson}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ek Bilgiler</CardTitle>
            <CardDescription>Becerileriniz ve ek bilgilerinizi ekleyin (isteğe bağlı)</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Skills Section */}
            <div className='space-y-2'>
              <Label>Öne Çıkan Beceriler</Label>
              <div className='flex space-x-2'>
                <Input
                  placeholder='ör. React'
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  disabled={skills.length >= 10}
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={addSkill}
                  disabled={!newSkill.trim() || skills.length >= 10}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {skills.map((skill, index) => (
                    <Badge key={index} variant='secondary' className='flex items-center space-x-1'>
                      <span>{skill}</span>
                      <button
                        type='button'
                        onClick={() => removeSkill(skill)}
                        className='ml-1 hover:bg-destructive/20 rounded-sm'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className='text-xs text-muted-foreground'>{skills.length}/10 beceri eklendi</p>
            </div>

            {/* Additional Info */}
            <div className='space-y-2'>
              <Label htmlFor='additionalInfo'>Ek Bilgi</Label>
              <Textarea
                id='additionalInfo'
                placeholder='Eklemek istediğiniz özel bilgiler...'
                className='min-h-[100px]'
                {...register('additionalInfo')}
              />
              {errors.additionalInfo && <p className='text-sm text-destructive'>{errors.additionalInfo.message}</p>}
              {validationErrors.additionalInfo && (
                <p className='text-sm text-destructive'>{validationErrors.additionalInfo}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className='border-destructive'>
            <CardContent className='pt-6'>
              <p className='text-sm text-destructive'>{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={handlePreview}
            disabled={!isValid || isGenerating}
            className='flex-1'
          >
            <Eye className='h-4 w-4 mr-2' />
            Önizleme
          </Button>
          <Button type='submit' disabled={!isValid || isGenerating} className='flex-1'>
            {isGenerating ? (
              <>
                <LoadingSpinner size='sm' className='mr-2' />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Sparkles className='h-4 w-4 mr-2' />
                Cover Letter Oluştur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
