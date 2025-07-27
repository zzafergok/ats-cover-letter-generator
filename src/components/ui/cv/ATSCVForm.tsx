'use client'

import React, { useState } from 'react'
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
import { atsCvApi } from '@/lib/api/api'
import { ATSCVGenerateData } from '@/types/api.types'
import { useUserProfileStore } from '@/store/userProfileStore'
import { atsFormSchema, ATSFormData } from '@/types/form.types'

export function ATSCVForm() {
  const { isLoading: profileLoading } = useUserProfileStore()
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
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

  const onSubmit = async (data: ATSFormData) => {
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
      setGeneratedContent(result.data.downloadUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
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

        <EducationSection register={register} errors={errors} watch={watch} setValue={setValue} getValues={getValues} />

        <SkillsSection register={register} errors={errors} watch={watch} setValue={setValue} getValues={getValues} />

        {/* Submit Button */}
        <div className='flex justify-end pt-6'>
          <Button type='submit' disabled={isGenerating} className='min-w-[200px]'>
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

      {/* Generated Content */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              Oluşturulan CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p>CV başarıyla oluşturuldu!</p>
              <Button onClick={() => window.open(generatedContent || '', '_blank', 'noopener,noreferrer')}>
                CV&apos;yi İndir
              </Button>
            </div>
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
    </div>
  )
}
