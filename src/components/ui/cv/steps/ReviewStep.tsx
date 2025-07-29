'use client'

import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CheckCircle, AlertCircle, Clock, Wand2, Bot, FileText, Database, Target } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Badge } from '@/components/core/badge'
import { atsCvMicrosoftApi } from '@/lib/api/api'
import { ATSFormData } from '@/types/form.types'

interface ReviewStepProps {
  form: UseFormReturn<ATSFormData>
}

export function ReviewStep({ form }: ReviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCV, setGeneratedCV] = useState<{
    template: string
    downloadedAt: string
    fileName: string
    success: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { handleSubmit, watch, setValue } = form
  const formData = watch()

  // Fill form with dummy data for testing
  const fillWithDummyData = () => {
    // Personal Info
    setValue('personalInfo.firstName', 'Ahmet')
    setValue('personalInfo.lastName', 'Yılmaz')
    setValue('personalInfo.email', 'ahmet.yilmaz@email.com')
    setValue('personalInfo.phone', '+90 555 123 4567')
    setValue('personalInfo.address.street', 'Beşiktaş Mahallesi, Teknoloji Caddesi No: 42/8')
    setValue('personalInfo.address.city', 'İstanbul')
    setValue('personalInfo.address.country', 'Türkiye')
    setValue('personalInfo.linkedIn', 'https://linkedin.com/in/ahmet-yilmaz')
    setValue('personalInfo.github', 'https://github.com/ahmet-yilmaz')
    setValue('personalInfo.portfolio', 'https://ahmetyilmaz.dev')

    // Professional Summary
    setValue(
      'professionalSummary.summary',
      '5+ yıl deneyimli Full Stack Developer. React, Node.js, TypeScript ve AWS ile modern web uygulamaları geliştirme konusunda uzman.',
    )
    setValue('professionalSummary.targetPosition', 'Senior Full Stack Developer')
    setValue('professionalSummary.yearsOfExperience', 5)
    setValue('professionalSummary.keySkills', ['React', 'Node.js', 'TypeScript', 'AWS'])

    // Work Experience
    setValue('workExperience', [
      {
        id: '1',
        companyName: 'Tech Solutions Inc.',
        position: 'Senior Full Stack Developer',
        location: 'İstanbul, Türkiye',
        startDate: '2022-01-01',
        endDate: '',
        isCurrentRole: true,
        achievements: [
          "100K+ daily users'a hizmet eden mikroservis mimarisi geliştirme liderliği yaptım",
          'Performans optimizasyonu ile uygulama yükleme süresini %40 azalttım',
        ],
      },
    ])

    // Education
    setValue('education', [
      {
        id: '1',
        institution: 'İstanbul Technical University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Engineering',
        location: 'İstanbul, Türkiye',
        startDate: '2016-09-01',
        endDate: '2020-06-01',
      },
    ])

    // Skills
    setValue('skills.technical', [
      {
        category: 'Programming Languages',
        items: [
          { name: 'JavaScript', proficiencyLevel: 'Expert' },
          { name: 'TypeScript', proficiencyLevel: 'Advanced' },
        ],
      },
    ])

    setValue('skills.languages', [
      { language: 'Turkish', proficiency: 'Native' },
      { language: 'English', proficiency: 'Advanced' },
    ])

    setValue('skills.soft', ['Team Leadership', 'Problem Solving', 'Communication'])
  }

  const onSubmit = async (data: ATSFormData) => {
    setIsGenerating(true)
    setError(null)

    try {
      const selectedTemplate = localStorage.getItem('selectedMicrosoftTemplate') || ''

      // Prepare data for Microsoft ATS API
      const microsoftData = {
        personalInfo: {
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          email: data.personalInfo.email,
          phone: data.personalInfo.phone,
          address: {
            city: data.personalInfo.address.city,
            country: data.personalInfo.address.country,
          },
          linkedIn: data.personalInfo.linkedIn || undefined,
          github: data.personalInfo.github || undefined,
          portfolio: data.personalInfo.portfolio || undefined,
        },
        professionalSummary: {
          summary: data.professionalSummary.summary,
          targetPosition: data.professionalSummary.targetPosition,
          yearsOfExperience: data.professionalSummary.yearsOfExperience,
          keySkills: data.professionalSummary.keySkills.filter((skill) => skill.trim()),
        },
        workExperience: data.workExperience
          .filter((exp) => exp.companyName && exp.position)
          .map((exp) => ({
            id: exp.id || crypto.randomUUID(),
            companyName: exp.companyName,
            position: exp.position,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.isCurrentRole ? undefined : exp.endDate,
            isCurrentRole: exp.isCurrentRole,
            achievements: exp.achievements.filter((achievement) => achievement.trim()),
          })),
        education: data.education
          .filter((edu) => edu.institution && edu.degree)
          .map((edu) => ({
            id: edu.id || crypto.randomUUID(),
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            location: edu.location,
            startDate: edu.startDate,
            endDate: edu.endDate,
          })),
        skills: {
          technical: data.skills.technical
            .filter((techGroup) => techGroup.category && techGroup.items.some((item) => item.name.trim()))
            .map((techGroup) => ({
              category: techGroup.category,
              items: techGroup.items
                .filter((item) => item.name.trim())
                .map((item) => ({
                  name: item.name,
                  proficiencyLevel: item.proficiencyLevel,
                })),
            })),
          languages: (data.skills.languages || [])
            .filter((lang) => lang.language.trim())
            .map((lang) => ({
              language: lang.language,
              proficiency: lang.proficiency,
            })),
          soft: data.skills.soft.filter((skill) => skill.trim()),
        },
        certifications: (data.certifications || []).map((cert) => ({
          id: cert.id || crypto.randomUUID(),
          name: cert.name,
          issuingOrganization: cert.issuingOrganization,
          issueDate: cert.issueDate || '',
          expirationDate: cert.expirationDate,
          credentialId: cert.credentialId,
          verificationUrl: cert.verificationUrl,
        })),
        projects: (data.projects || []).map((project) => ({
          id: project.id || crypto.randomUUID(),
          name: project.name,
          description: project.description,
          technologies: project.technologies,
          startDate: project.startDate,
          endDate: project.endDate,
          url: project.url,
          achievements: project.achievements,
        })),
        configuration: {
          language: data.configuration.language,
          microsoftTemplateId: selectedTemplate,
          useAIOptimization: data.configuration.useAI,
          jobDescription: data.configuration.useAI ? data.configuration.jobDescription : undefined,
          targetCompany: data.configuration.targetCompany || undefined,
        },
      }

      // Generate PDF through Microsoft ATS API
      const pdfBlob = await atsCvMicrosoftApi.generate(microsoftData)

      // Auto-download PDF
      const fileName = `${data.personalInfo.firstName}_${data.personalInfo.lastName}_${selectedTemplate}_CV.pdf`
      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      // Mark as successful
      setGeneratedCV({
        template: selectedTemplate,
        downloadedAt: new Date().toISOString(),
        fileName: fileName,
        success: true,
      })

      console.log('Microsoft ATS CV successfully created and downloaded:', fileName)
    } catch (err) {
      console.error('CV generation error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String(err.message))
      } else {
        setError('CV oluşturulurken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Check form completeness
  const checkFormCompleteness = () => {
    const issues = []

    if (!formData.personalInfo?.firstName || !formData.personalInfo?.lastName) {
      issues.push('Kişisel bilgiler eksik')
    }

    if (!formData.professionalSummary?.summary) {
      issues.push('Profesyonel özet eksik')
    }

    if (!formData.workExperience?.length || !formData.workExperience[0]?.companyName) {
      issues.push('İş deneyimi eksik')
    }

    if (!formData.education?.length || !formData.education[0]?.institution) {
      issues.push('Eğitim bilgisi eksik')
    }

    return issues
  }

  const formIssues = checkFormCompleteness()
  const isFormComplete = formIssues.length === 0
  const useAI = formData.configuration?.useAI || false

  if (generatedCV) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-500' />
            <FileText className='h-4 w-4 text-blue-500' />
            Microsoft ATS CV Başarıyla İndirildi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Download Success Info */}
            <div className='p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700'>
              <h4 className='font-medium text-sm mb-3 text-green-800 dark:text-green-200 flex items-center gap-2'>
                <CheckCircle className='h-4 w-4' />
                İndirme Başarılı
              </h4>
              <div className='space-y-2 text-sm'>
                <p className='text-foreground'>
                  <span className='font-medium text-green-700 dark:text-green-300'>Dosya Adı:</span>{' '}
                  {generatedCV.fileName}
                </p>
                <p className='text-foreground'>
                  <span className='font-medium text-green-700 dark:text-green-300'>Kullanılan Template:</span>{' '}
                  {generatedCV.template}
                </p>
                <p className='text-foreground'>
                  <span className='font-medium text-green-700 dark:text-green-300'>İndirilme Zamanı:</span>{' '}
                  {new Date(generatedCV.downloadedAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className='p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700'>
              <h4 className='font-medium text-sm mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2'>
                <Target className='h-4 w-4' />
                Sonraki Adımlar
              </h4>
              <ul className='text-sm text-foreground space-y-1'>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500'>•</span>
                  <span>CV dosyanızı indirme klasörünüzde bulabilirsiniz</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500'>•</span>
                  <span>Dosyayı iş başvurularınızda kullanabilirsiniz</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500'>•</span>
                  <span>Farklı templateler için yeni CV oluşturabilirsiniz</span>
                </li>
              </ul>
            </div>

            {/* New CV Button */}
            <div className='text-center'>
              <Button
                onClick={() => {
                  setGeneratedCV(null)
                  setError(null)
                }}
                variant='outline'
                className='w-full'
              >
                Yeni CV Oluştur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>CV Önizleme ve Oluşturma</h3>
        <p className='text-muted-foreground'>
          Girdiğiniz bilgileri gözden geçirin ve Microsoft ATS uyumlu CV'nizi oluşturun.
        </p>
      </div>

      {/* Form Completeness Check */}
      {!isFormComplete && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            <div className='space-y-1'>
              <p className='font-medium'>CV oluşturmak için aşağıdaki bilgiler eksik:</p>
              <ul className='text-sm space-y-1'>
                {formIssues.map((issue, index) => (
                  <li key={index} className='flex items-center gap-1'>
                    <span>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form Summary */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${formData.personalInfo?.firstName ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span className='text-sm font-medium'>Kişisel Bilgiler</span>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {formData.personalInfo?.firstName ? 'Tamamlandı' : 'Eksik'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.professionalSummary?.summary ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className='text-sm font-medium'>Profesyonel Özet</span>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {formData.professionalSummary?.summary ? 'Tamamlandı' : 'Eksik'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.workExperience?.[0]?.companyName ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className='text-sm font-medium'>İş Deneyimi</span>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {formData.workExperience?.[0]?.companyName ? 'Tamamlandı' : 'Eksik'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.education?.[0]?.institution ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className='text-sm font-medium'>Eğitim</span>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {formData.education?.[0]?.institution ? 'Tamamlandı' : 'Eksik'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Optimization Status */}
      {useAI && (
        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <Bot className='h-4 w-4 text-purple-600' />
              <span className='text-sm font-medium'>AI Optimizasyonu Aktif</span>
              <Badge variant='secondary' className='bg-purple-100 text-purple-700'>
                Claude AI
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>CV'niz iş tanımına göre optimize edilecek</p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-3 pt-6'>
        {/* Dummy Data Button for Testing */}
        <Button
          type='button'
          variant='outline'
          onClick={fillWithDummyData}
          className='flex items-center gap-2'
          disabled={isGenerating}
        >
          <Database className='h-4 w-4' />
          Demo Verilerle Doldur
        </Button>

        {/* Generate CV Button */}
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isGenerating || !isFormComplete}
          className='min-w-[200px] flex-1 sm:flex-initial'
        >
          {isGenerating ? (
            <>
              <Clock className='h-4 w-4 mr-2 animate-spin' />
              {useAI ? 'AI ile Optimize Ediliyor...' : 'Microsoft ATS CV Oluşturuluyor...'}
            </>
          ) : (
            <>
              {useAI ? <Bot className='h-4 w-4 mr-2' /> : <Wand2 className='h-4 w-4 mr-2' />}
              {useAI ? 'AI Optimizeli Microsoft CV Oluştur' : 'Microsoft ATS CV Oluştur'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
