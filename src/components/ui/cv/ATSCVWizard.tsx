'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'
import { Progress } from '@/components/core/progress'
import { atsFormSchema, ATSFormData } from '@/types/form.types'

// Step components (will be created separately)
import { TemplateSelectionStep } from './steps/TemplateSelectionStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { ProfessionalSummaryStep } from './steps/ProfessionalSummaryStep'
import { WorkExperienceStep } from './steps/WorkExperienceStep'
import { EducationStep } from './steps/EducationStep'
import { SkillsStep } from './steps/SkillsStep'
import { AIOptimizationStep } from './steps/AIOptimizationStep'
import { ReviewStep } from './steps/ReviewStep'

const STEPS = [
  {
    id: 'template',
    title: 'Şablon Seçimi',
    description: 'Microsoft ATS şablonu seçin',
    component: TemplateSelectionStep,
  },
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    description: 'İletişim bilgilerinizi girin',
    component: PersonalInfoStep,
  },
  {
    id: 'summary',
    title: 'Profesyonel Özet',
    description: 'Kariyer özetinizi oluşturun',
    component: ProfessionalSummaryStep,
  },
  {
    id: 'experience',
    title: 'İş Deneyimi',
    description: 'Çalışma geçmişinizi ekleyin',
    component: WorkExperienceStep,
  },
  {
    id: 'education',
    title: 'Eğitim',
    description: 'Eğitim bilgilerinizi girin',
    component: EducationStep,
  },
  {
    id: 'skills',
    title: 'Yetenekler',
    description: 'Teknik ve kişisel yetenekler',
    component: SkillsStep,
  },
  {
    id: 'ai',
    title: 'AI Optimizasyon',
    description: 'İş tanımına göre optimize edin',
    component: AIOptimizationStep,
  },
  {
    id: 'review',
    title: 'Önizleme',
    description: "CV'yi gözden geçirin ve oluşturun",
    component: ReviewStep,
  },
] as const

export function ATSCVWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const form = useForm<ATSFormData>({
    resolver: zodResolver(atsFormSchema),
    mode: 'onChange',
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
        keySkills: [''],
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
        languages: [{ language: '', proficiency: 'Intermediate' as const }],
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

  const currentStepData = STEPS[currentStep]
  const StepComponent = currentStepData.component
  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0
  const progress = ((currentStep + 1) / STEPS.length) * 100

  const goToNext = async () => {
    // Validate current step based on step type
    let isValid = false

    switch (STEPS[currentStep].id) {
      case 'template':
        // Template selection is handled in component
        isValid = !!localStorage.getItem('selectedMicrosoftTemplate')
        break
      case 'personal':
        isValid = await form.trigger(['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email'])
        break
      case 'summary':
        isValid = await form.trigger(['professionalSummary.summary', 'professionalSummary.targetPosition'])
        break
      case 'experience':
        isValid = await form.trigger(['workExperience.0.companyName', 'workExperience.0.position'])
        break
      case 'education':
        isValid = await form.trigger(['education.0.institution', 'education.0.degree'])
        break
      case 'skills':
        isValid = await form.trigger(['skills.technical'])
        break
      case 'ai':
        // AI step validation is optional
        isValid = true
        break
      case 'review':
        isValid = await form.trigger()
        break
      default:
        isValid = true
    }

    if (!isValid) return

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]))

    if (!isLastStep) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  return (
    <div className='max-w-4xl mx-auto p-4 space-y-6'>
      {/* Progress Header */}
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-bold'>CV Oluştur</h1>
              <span className='text-sm text-muted-foreground'>
                {currentStep + 1} / {STEPS.length}
              </span>
            </div>

            <Progress value={progress} className='h-2' />

            {/* Step Navigation */}
            <div className='flex flex-wrap gap-2'>
              {STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep && !completedSteps.has(index - 1)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground border-primary'
                      : completedSteps.has(index)
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : index < currentStep
                          ? 'bg-muted text-muted-foreground border-muted'
                          : 'bg-background text-muted-foreground border-border hover:bg-muted'
                  }`}
                >
                  {completedSteps.has(index) && <Check className='w-3 h-3 inline mr-1' />}
                  {step.title}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardContent className='pt-6'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold'>{currentStepData.title}</h2>
            <p className='text-muted-foreground'>{currentStepData.description}</p>
          </div>

          {/* <StepComponent form={form} /> */}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={goToPrevious} disabled={isFirstStep}>
          <ChevronLeft className='w-4 h-4 mr-2' />
          Önceki
        </Button>

        <Button onClick={goToNext} disabled={isLastStep}>
          {isLastStep ? 'CV Oluştur' : 'Sonraki'}
          {!isLastStep && <ChevronRight className='w-4 h-4 ml-2' />}
        </Button>
      </div>
    </div>
  )
}
