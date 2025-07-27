'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle, Clock, Wand2 } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Alert, AlertDescription } from '@/components/core/alert'
import { PersonalInfoSection } from '@/components/ui/cv/sections/PersonalInfoSection'
import { ProfessionalSummarySection } from '@/components/ui/cv/sections/ProfessionalSummarySection'
import { WorkExperienceSection } from '@/components/ui/cv/sections/WorkExperienceSection'
import { EducationSection } from '@/components/ui/cv/sections/EducationSection'
import { SkillsSection } from '@/components/ui/cv/sections/SkillsSection'
import { ProfileRedirectAlert } from '@/components/ui/cv/ProfileRedirectAlert'
import { atsCvApi } from '@/lib/api/api'
import { ATSCVGenerateData } from '@/types/api.types'
import { useUserProfileStore } from '@/store/userProfileStore'
import { atsFormSchema, ATSFormData } from '@/types/form.types'

export function ATSCVForm() {
  const { profile, isLoading: profileLoading, getProfile } = useUserProfileStore()
  const [generatedCV, setGeneratedCV] = useState<{
    cvId: string
    fileName: string
    fileSize: number
    downloadUrl: string
    applicantName: string
    targetPosition: string
    createdAt: string
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<ATSFormData>({
    resolver: zodResolver(atsFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          country: '',
        },
        linkedIn: '',
        github: '',
        portfolio: '',
      },
      professionalSummary: {
        summary: '',
        targetPosition: '',
        yearsOfExperience: 0,
        keySkills: ['', '', ''],
      },
      workExperience: [
        {
          id: '',
          companyName: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrentRole: false,
          achievements: ['', ''],
        },
      ],
      education: [
        {
          id: '',
          institution: '',
          degree: '',
          fieldOfStudy: '',
          location: '',
          startDate: '',
          endDate: '',
        },
      ],
      skills: {
        technical: [
          {
            category: '',
            items: [
              {
                name: '',
                proficiencyLevel: 'Intermediate' as const,
              },
            ],
          },
        ],
        languages: [{ language: '', proficiency: 'Intermediate' }],
        soft: [''],
      },
      configuration: {
        targetCompany: '',
        jobDescription: '',
        language: 'TURKISH' as const,
        cvType: 'ATS_OPTIMIZED' as const,
        templateStyle: 'PROFESSIONAL' as const,
        useAI: false,
      },
      certifications: [],
      projects: [],
    },
  })
  console.log('🚀 ~ ATSCVForm ~ errors:', errors)

  // Profil verilerini form'a otomatik doldur
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

    // Kişisel bilgileri doldur
    if (profile.firstName) setValue('personalInfo.firstName', profile.firstName)
    if (profile.lastName) setValue('personalInfo.lastName', profile.lastName)
    if (profile.email) setValue('personalInfo.email', profile.email)
    if (profile.phone) setValue('personalInfo.phone', profile.phone)
    if (profile.address) setValue('personalInfo.address.street', profile.address)
    if (profile.city) setValue('personalInfo.address.city', profile.city)
    if (profile.country) setValue('personalInfo.address.country', profile.country)
    if (profile.linkedin) setValue('personalInfo.linkedIn', profile.linkedin)
    if (profile.github) setValue('personalInfo.github', profile.github)
    if (profile.portfolioWebsite) setValue('personalInfo.portfolio', profile.portfolioWebsite)

    // İş deneyimlerini doldur
    if (profile.experiences?.length > 0) {
      const formattedExperiences = profile.experiences.map((exp) => ({
        id: exp.id,
        companyName: exp.companyName,
        position: exp.position,
        location: exp.location || '',
        startDate: `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}-01`,
        endDate: exp.isCurrent ? '' : `${exp.endYear}-${String(exp.endMonth).padStart(2, '0')}-01`,
        isCurrentRole: exp.isCurrent,
        achievements: Array.isArray(exp.achievements) ? exp.achievements : exp.achievements ? [exp.achievements] : [''],
      }))
      setValue('workExperience', formattedExperiences)
    }

    // Eğitimleri doldur
    if (profile.educations?.length > 0) {
      const formattedEducations = profile.educations.map((edu) => ({
        id: edu.id,
        institution: edu.schoolName,
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        location: '',
        startDate: `${edu.startYear}-01-01`,
        endDate: edu.isCurrent ? '' : `${edu.endYear}-12-31`,
      }))
      setValue('education', formattedEducations)
    }

    // Yetenekleri doldur
    if (profile.skills?.length > 0) {
      const technicalSkills = profile.skills.map((skill) => ({
        category: skill.category || 'Genel',
        items: [
          {
            name: skill.name,
            proficiencyLevel: 'Intermediate' as const,
          },
        ],
      }))
      setValue('skills.technical', technicalSkills)
    }
  }, [profile, setValue, getProfile])

  // Profil completeness kontrolü
  const checkProfileCompleteness = () => {
    const missingFields = []

    if (!profile?.firstName || !profile?.lastName) {
      missingFields.push({ field: 'personalInfo', message: 'Kişisel bilgiler eksik' })
    }

    if (!profile?.experiences?.length) {
      missingFields.push({ field: 'experience', message: 'İş deneyimi bilgisi eksik' })
    }

    if (!profile?.educations?.length) {
      missingFields.push({ field: 'education', message: 'Eğitim bilgisi eksik' })
    }

    if (!profile?.skills?.length) {
      missingFields.push({ field: 'skills', message: 'Yetenek bilgisi eksik' })
    }

    return missingFields
  }

  const missingProfileFields = checkProfileCompleteness()

  // CV download fonksiyonu
  const handleDownloadCV = async (cvId: string, fileName: string) => {
    setIsDownloading(true)
    try {
      const blob = await atsCvApi.download(cvId)

      // Blob'u dosya olarak indir
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('CV başarıyla indirildi:', fileName)
    } catch (err) {
      console.error('CV indirme hatası:', err)
      setError('CV indirilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsDownloading(false)
    }
  }

  const onSubmit = async (data: ATSFormData) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    setIsGenerating(true)
    setError(null)

    try {
      const generateData: ATSCVGenerateData = {
        personalInfo: data.personalInfo,
        professionalSummary: data.professionalSummary,
        workExperience: data.workExperience.map((exp) => ({
          ...exp,
          id: exp.id || `work_${Date.now()}_${Math.random()}`,
          technologies: exp.technologies ? [exp.technologies] : undefined,
        })),
        education: data.education.map((edu) => ({
          ...edu,
          id: edu.id || `edu_${Date.now()}_${Math.random()}`,
          honors: edu.honors ? [edu.honors] : undefined,
          relevantCoursework: edu.relevantCoursework ? [edu.relevantCoursework] : undefined,
        })),
        skills: {
          ...data.skills,
          languages: data.skills.languages || [],
        },
        certifications: (data.certifications || []).map((cert) => ({
          ...cert,
          id: cert.id || `cert_${Date.now()}_${Math.random()}`,
          issueDate: cert.issueDate || '',
        })),
        projects: (data.projects || []).map((proj) => ({
          ...proj,
          id: proj.id || `proj_${Date.now()}_${Math.random()}`,
        })),
        configuration: data.configuration,
      }

      const result = await atsCvApi.generate(generateData)

      if (result.success) {
        // CV başarıyla oluşturuldu
        setGeneratedCV({
          cvId: result.data.cvId,
          fileName: result.data.fileName,
          fileSize: result.data.fileSize,
          downloadUrl: result.data.downloadUrl,
          applicantName: result.data.applicantName,
          targetPosition: result.data.targetPosition,
          createdAt: result.data.createdAt,
        })

        // Toast mesajı ekleyebilirsiniz
        console.log('CV başarıyla oluşturuldu:', result.message)
      } else {
        throw new Error(result.message || 'CV oluşturulurken beklenmeyen bir hata oluştu')
      }
    } catch (err) {
      console.error('CV oluşturma hatası:', err)

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

  return (
    <div className={`grid gap-4 md:gap-6 ${generatedCV ? 'xl:grid-cols-2' : 'grid-cols-1'}`}>
      {/* Form Section */}
      <div className='space-y-6'>
        {/* Profile Status Alert */}
        {profileLoading ? (
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <Clock className='h-5 w-5 animate-spin text-primary' />
                <span>Profil bilgileriniz yükleniyor...</span>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Profile Completeness Alerts */}
        {!profileLoading && missingProfileFields.length > 0 && (
          <div className='space-y-4'>
            {missingProfileFields.map((missing, index) => {
              const alertConfigs = {
                personalInfo: {
                  sectionName: 'Kişisel Bilgiler',
                  description: 'CV oluşturmak için temel kişisel bilgilerinizi profilde tanımlamanız gerekiyor.',
                  targetTab: 'overview',
                },
                experience: {
                  sectionName: 'İş Deneyimi',
                  description: "Profesyonel deneyimlerinizi profilde ekleyerek CV'nizi güçlendirebilirsiniz.",
                  targetTab: 'experience',
                },
                education: {
                  sectionName: 'Eğitim Bilgileri',
                  description: 'Eğitim geçmişinizi profilde tanımlayarak daha kapsamlı bir CV oluşturabilirsiniz.',
                  targetTab: 'education',
                },
                skills: {
                  sectionName: 'Yetenekler',
                  description: "Teknik ve kişisel yeteneklerinizi profilde belirterek CV'nizi öne çıkarabilirsiniz.",
                  targetTab: 'skills',
                },
              }

              const config = alertConfigs[missing.field as keyof typeof alertConfigs]
              if (!config) return null

              return (
                <ProfileRedirectAlert
                  key={index}
                  sectionName={config.sectionName}
                  description={config.description}
                  targetTab={config.targetTab}
                />
              )
            })}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          <PersonalInfoSection register={register} errors={errors} />

          <ProfessionalSummarySection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
          />

          <WorkExperienceSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
          />

          <EducationSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
          />

          <SkillsSection register={register} errors={errors} watch={watch} setValue={setValue} getValues={getValues} />

          {/* Submit Button */}
          <div className='flex justify-end pt-6'>
            <Button type='submit' disabled={isGenerating || missingProfileFields.length > 0} className='min-w-[200px]'>
              {isGenerating ? (
                <>
                  <Clock className='h-4 w-4 mr-2 animate-spin' />
                  CV Oluşturuluyor...
                </>
              ) : (
                <>
                  <Wand2 className='h-4 w-4 mr-2' />
                  ATS CV Oluştur
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Generated Content */}
      {generatedCV && (
        <Card className='h-max'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              Oluşturulan CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <p>
                    <strong>Dosya Adı:</strong> {generatedCV.fileName}
                  </p>
                  <p>
                    <strong>Boyut:</strong> {(generatedCV.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Başvurucu:</strong> {generatedCV.applicantName}
                  </p>
                  <p>
                    <strong>Pozisyon:</strong> {generatedCV.targetPosition}
                  </p>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button
                  onClick={() => handleDownloadCV(generatedCV.cvId, generatedCV.fileName)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Clock className='h-4 w-4 mr-2 animate-spin' />
                      İndiriliyor...
                    </>
                  ) : (
                    'CV&apos;yi İndir'
                  )}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + generatedCV.downloadUrl)
                    console.log('Download link kopyalandı')
                  }}
                >
                  Linki Kopyala
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
