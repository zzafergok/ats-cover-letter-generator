/* eslint-disable prefer-const */
'use client'

import React, { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { cvGeneratorApi } from '@/lib/api/api'
import { useUserProfileStore } from '@/store/userProfileStore'

// Schema and types
import { cvTemplateSchema, CVTemplateFormData } from '@/schemas/cvTemplate.schema'

// Constants
import { BASE_STEPS, TURKEY_STEPS, GLOBAL_STEPS } from '@/constants/cvTemplate.constants'

// Utils
import { fillDemoData as fillDemoDataUtil } from '@/utils/cvDemoData'

// Components
import { CVCurrentStep } from './CVCurrentStep'
import { CVSuccessMessage } from './CVSuccessMessage'
import { CVProgressHeader } from './CVProgressHeader'
import { CVNavigationButtons } from './CVNavigationButtons'

// Step components
import { ProjectsStep } from './steps/ProjectsStep'
import { ObjectiveStep } from './steps/ObjectiveStep'
import { LanguagesStep } from './steps/LanguagesStep'
import { ReferencesStep } from './steps/ReferencesStep'
import { SoftSkillsStep } from './steps/SoftSkillsStep'
import { CertificatesStep } from './steps/CertificatesStep'
import { CVEducationStep } from './steps/CVEducationStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { SimpleSkillsStep } from './steps/SimpleSkillsStep'
import { TechnicalSkillsStep } from './steps/TechnicalSkillsStep'
import { CVWorkExperienceStep } from './steps/CVWorkExperienceStep'
import { TemplateSelectionStep } from './steps/TemplateSelectionStep'

export function CVTemplateGenerator() {
  const { profile, getProfile } = useUserProfileStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)

  const [generatedCV, setGeneratedCV] = useState<{
    id: string
    templateType: string
    fileName: string
    generatedAt: string
  } | null>(null)

  // Step navigation state
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Download dialog state
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)

  const form = useForm<CVTemplateFormData>({
    resolver: zodResolver(cvTemplateSchema),
    defaultValues: {
      templateType: 'basic_hr',
      version: 'global',
      language: 'english',
      personalInfo: {
        firstName: '',
        lastName: '',
        jobTitle: '',
        linkedin: '',
        email: '',
        phone: '',
        address: '',
        city: '',
      },
      objective: '',
      experience: [
        {
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          isCurrent: false,
        },
      ],
      education: [
        {
          degree: '',
          university: '',
          location: '',
          graduationDate: '',
          details: '',
          isCurrent: false,
        },
      ],
      technicalSkills: {
        frontend: [''],
        backend: [''],
        database: [''],
        tools: [''],
      },
      projects: [
        {
          name: '',
          description: '',
          technologies: [''],
        },
      ],
      certificates: [
        {
          name: '',
          issuer: '',
          date: '',
        },
      ],
      languages: [
        {
          language: '',
          level: '',
        },
      ],
      communication: '',
      leadership: '',
      skills: [''],
      references: [],
    },
  })

  const { handleSubmit, watch, setValue } = form
  const selectedTemplate = watch('templateType')
  const selectedVersion = watch('version')

  // Calculate dynamic steps based on template and version
  const getSteps = () => {
    let steps = [...BASE_STEPS]

    // All templates now have version/language support
    if (selectedVersion === 'turkey') {
      // Turkey version: all templates use the same extended structure
      steps.push(...TURKEY_STEPS)
    } else {
      // Global version: all templates use the same simplified structure
      steps.push(...GLOBAL_STEPS)
    }

    return steps
  }

  const STEPS = getSteps()
  const isFirstStep = currentStep === 0
  const currentStepData = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1
  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Load CV templates
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingTemplates(true)
      try {
        const response = await cvGeneratorApi.getTemplates()
        if (response.success) {
          // Templates loaded successfully
        }
      } catch (err: any) {
        console.error('Template loading error:', err)
        if (err?.status === 401) {
          console.log('🔐 Authentication error detected, letting interceptor handle it')
          return
        }
        setError("Template'ler yüklenirken hata oluştu")
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])

  // State to track if profile has been loaded
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Load user profile data (only once)
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

    if (!profileLoaded) {
      console.log('🔄 Auto-filling form from user profile (one-time only)')

      // Auto-fill from profile
      if (profile.firstName) setValue('personalInfo.firstName', profile.firstName)
      if (profile.lastName) setValue('personalInfo.lastName', profile.lastName)
      if (profile.email) setValue('personalInfo.email', profile.email)
      if (profile.phone) setValue('personalInfo.phone', profile.phone)
      if (profile.address) setValue('personalInfo.address', profile.address)
      if (profile.city) setValue('personalInfo.city', profile.city)

      // Auto-fill experience from profile
      if (profile.experiences?.length > 0) {
        const formattedExperiences = profile.experiences.slice(0, 3).map((exp) => ({
          jobTitle: exp.position,
          company: exp.companyName,
          location: exp.location || '',
          startDate: `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}`,
          endDate: exp.isCurrent ? '' : `${exp.endYear}-${String(exp.endMonth).padStart(2, '0')}`,
          description: exp.description || '',
          isCurrent: exp.isCurrent || false,
        }))
        setValue('experience', formattedExperiences)
      }

      // Auto-fill education from profile
      if (profile.educations?.length > 0) {
        const formattedEducations = profile.educations.slice(0, 2).map((edu) => ({
          degree: edu.degree || '',
          university: edu.schoolName,
          location: '',
          graduationDate: edu.isCurrent
            ? ''
            : edu.endYear
              ? `${edu.endYear}-06`
              : edu.startYear
                ? `${edu.startYear}-06`
                : '',
          details: edu.fieldOfStudy ? `Field: ${edu.fieldOfStudy}` : '',
          isCurrent: edu.isCurrent || false,
        }))
        setValue('education', formattedEducations)
      }

      // Auto-fill skills from profile
      if (profile.skills?.length > 0) {
        const technicalSkills = profile.skills.map((skill) => skill.name || '').filter(Boolean)
        if (technicalSkills.length > 0) {
          setValue('technicalSkills', {
            frontend: technicalSkills.slice(0, Math.ceil(technicalSkills.length / 4)),
            backend: technicalSkills.slice(
              Math.ceil(technicalSkills.length / 4),
              Math.ceil(technicalSkills.length / 2),
            ),
            database: technicalSkills.slice(
              Math.ceil(technicalSkills.length / 2),
              Math.ceil((technicalSkills.length * 3) / 4),
            ),
            tools: technicalSkills.slice(Math.ceil((technicalSkills.length * 3) / 4)),
          })
        }
      }

      // Auto-fill certificates from profile
      if (profile.certificates?.length > 0) {
        const formattedCertificates = profile.certificates.map((cert) => ({
          name: cert.certificateName || '',
          issuer: cert.issuer || '',
          date: cert.issueYear ? cert.issueYear.toString() : '',
        }))
        setValue('certificates', formattedCertificates)
      }

      setProfileLoaded(true)
    }
  }, [profile, setValue, getProfile, profileLoaded])

  const onSubmit = async (data: CVTemplateFormData) => {
    console.log('Form submitted with data:', data)
    setIsGenerating(true)
    setError(null)

    try {
      // Prepare API payload
      const apiPayload: any = {
        templateType: data.templateType,
        data: {
          personalInfo: data.personalInfo,
          objective: data.objective,
          experience: data.experience,
          education: data.education,
          references: data.references,
        },
      }

      // All templates now support version and language
      apiPayload.version = data.version

      if (data.version === 'turkey') {
        apiPayload.language = data.language
        // Turkey version: all templates have extended fields
        apiPayload.data.technicalSkills = data.technicalSkills
        apiPayload.data.projects = data.projects
        apiPayload.data.certificates = data.certificates
        apiPayload.data.languages = data.languages
        apiPayload.data.references = data.references
      } else {
        // Global version: simplified structure
        apiPayload.data.communication = data.communication
        apiPayload.data.leadership = data.leadership
      }

      const response = await cvGeneratorApi.generate(apiPayload)

      if (response.success) {
        setGeneratedCV({
          id: response.data.id,
          templateType: response.data.templateType,
          fileName: `CV_${data.templateType}_${Date.now()}.pdf`,
          generatedAt: response.data.createdAt,
        })
      }
    } catch (err: any) {
      console.error('CV generation error:', err)
      if (err?.status === 401) {
        console.log('🔐 Authentication error detected, letting interceptor handle it')
        return
      }
      const errorMessage = err?.message || 'CV oluşturulurken hata oluştu. Lütfen tekrar deneyin.'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const confirmDownload = async () => {
    if (!generatedCV) return

    setIsGenerating(true)
    try {
      const blob = await cvGeneratorApi.downloadPdf(generatedCV.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = generatedCV.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      setDownloadDialogOpen(false)
    } catch (err: any) {
      console.error('Download error:', err)
      if (err?.status === 401) {
        console.log('🔐 Authentication error detected, letting interceptor handle it')
        return
      }
      const errorMessage = err?.message || 'CV indirme sırasında hata oluştu'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const fillDemoData = () => {
    fillDemoDataUtil(setValue, selectedTemplate, selectedVersion || 'global')
  }

  const handleNewCV = () => {
    setGeneratedCV(null)
    setCurrentStep(0)
    setCompletedSteps(new Set())
    form.reset()
  }

  const handleDownload = () => {
    confirmDownload()
  }

  const goToNext = async () => {
    // Validate current step
    let isValid = false

    switch (currentStepData.id) {
      case 'template':
        isValid = !!selectedTemplate
        break
      case 'personal':
        isValid = await form.trigger(['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email'])
        break
      case 'objective':
        isValid = true // Optional step
        break
      case 'experience':
        isValid = await form.trigger(['experience.0.jobTitle', 'experience.0.company'])
        break
      case 'education':
        isValid = await form.trigger(['education.0.degree', 'education.0.university'])
        break
      case 'simple_skills':
      case 'skills':
      case 'projects':
      case 'certificates':
      case 'languages':
      case 'references':
      case 'soft_skills':
        isValid = true // Optional steps
        break
      default:
        isValid = true
    }

    if (!isValid) return

    setCompletedSteps((prev) => new Set([...prev, currentStep]))

    const nextStep = currentStep + 1
    if (nextStep < STEPS.length) {
      setCurrentStep(nextStep)
    }
  }

  const goToPrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      setCurrentStep(stepIndex)
    }
  }

  // Render step content using step components
  const renderStepContent = () => {
    switch (currentStepData.id as string) {
      case 'template':
        return <TemplateSelectionStep form={form as any} isLoadingTemplates={isLoadingTemplates} />

      case 'skills':
        return <TechnicalSkillsStep form={form as any} />

      case 'projects':
        return <ProjectsStep form={form as any} />

      case 'certificates':
        return <CertificatesStep form={form as any} />

      case 'languages':
        return <LanguagesStep form={form as any} />

      case 'references':
        return <ReferencesStep form={form as any} />

      case 'soft_skills':
        return <SoftSkillsStep form={form as any} />

      case 'simple_skills':
        return <SimpleSkillsStep form={form as any} />

      case 'personal':
        return <PersonalInfoStep form={form as any} />

      case 'objective':
        return <ObjectiveStep form={form as any} />

      case 'experience':
        return <CVWorkExperienceStep form={form as any} />

      case 'education':
        return <CVEducationStep form={form as any} />

      default:
        return <div>Bu adım henüz tanımlanmamış</div>
    }
  }

  // Show only success message if CV is generated
  if (generatedCV) {
    return (
      <CVSuccessMessage
        generatedCV={generatedCV}
        downloadDialogOpen={downloadDialogOpen}
        setDownloadDialogOpen={setDownloadDialogOpen}
        onNewCV={handleNewCV}
        onDownload={handleDownload}
      />
    )
  }

  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <div className='space-y-6'>
        <CVProgressHeader
          currentStep={currentStep}
          steps={STEPS}
          progress={progress}
          completedSteps={completedSteps}
          onGoToStep={goToStep}
        />

        <CVCurrentStep currentStepData={currentStepData}>{renderStepContent()}</CVCurrentStep>

        <CVNavigationButtons
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isGenerating={isGenerating}
          error={error}
          onGoToPrevious={goToPrevious}
          onGoToNext={goToNext}
          onFillDemoData={fillDemoData}
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log('Form validation errors:', errors)
            console.log('Form values:', form.getValues())
          })}
        />
      </div>
    </div>
  )
}
