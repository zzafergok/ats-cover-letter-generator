'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Settings,
  Code,
  FolderOpen,
  Award,
  Languages,
  Users,
  X,
} from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { MonthYearPicker } from '@/components/core/month-year-picker'
import { Checkbox } from '@/components/core/checkbox'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Badge } from '@/components/core/badge'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Progress } from '@/components/core/progress'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/core/alert-dialog'

import { cvGeneratorApi } from '@/lib/api/api'
import { useUserProfileStore } from '@/store/userProfileStore'

// CV Template Form Schema with new basic_hr structure
const cvTemplateSchema = z.object({
  templateType: z.enum(['basic_hr', 'office_manager', 'simple_classic', 'stylish_accounting', 'minimalist_turkish']),
  version: z.enum(['global', 'turkey']).optional(),
  language: z.enum(['turkish', 'english']).optional(),
  personalInfo: z.object({
    fullName: z.string().min(1, 'İsim gereklidir'),
    firstName: z.string().optional(), // For office_manager
    lastName: z.string().optional(), // For office_manager
    jobTitle: z.string().optional(), // For office_manager
    linkedin: z.string().optional(), // For office_manager
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Geçerli email adresi gereklidir'),
  }),
  objective: z.string().optional(),
  experience: z
    .array(
      z.object({
        jobTitle: z.string().min(1, 'İş unvanı gereklidir'),
        company: z.string().min(1, 'Şirket adı gereklidir'),
        location: z.string().optional(),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        description: z.string().optional(),
        isCurrent: z.boolean().optional(),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, 'Derece gereklidir'),
        university: z.string().min(1, 'Üniversite adı gereklidir'),
        location: z.string().optional(),
        graduationDate: z.string().optional(),
        details: z.string().optional(),
        isCurrent: z.boolean().optional(),
      }),
    )
    .optional(),
  // New fields for basic_hr template
  technicalSkills: z
    .object({
      frontend: z.array(z.string()).optional(),
      backend: z.array(z.string()).optional(),
      database: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
    })
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        technologies: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        level: z.string(),
      }),
    )
    .optional(),
  communication: z.string().optional(),
  leadership: z.string().optional(),
  skills: z.array(z.string()).optional(), // For office_manager (simple array)
  references: z
    .array(
      z.object({
        name: z.string().optional(),
        company: z.string().optional(),
        contact: z.string().optional(),
      }),
    )
    .optional(),
})

type CVTemplateFormData = z.infer<typeof cvTemplateSchema>

// Step type definition
type StepItem = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

// Base step definitions
const BASE_STEPS: StepItem[] = [
  {
    id: 'template',
    title: 'Template Seçimi',
    description: 'CV template ve ayarlarını seçin',
    icon: Settings,
  },
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    description: 'İletişim bilgilerinizi girin',
    icon: User,
  },
  {
    id: 'objective',
    title: 'Kariyer Hedefi',
    description: 'Profesyonel özetinizi yazın',
    icon: FileText,
  },
  {
    id: 'experience',
    title: 'İş Deneyimi',
    description: 'Çalışma geçmişinizi ekleyin',
    icon: Briefcase,
  },
  {
    id: 'education',
    title: 'Eğitim',
    description: 'Eğitim bilgilerinizi girin',
    icon: GraduationCap,
  },
]

// Dynamic steps based on template and version
const TURKEY_STEPS: StepItem[] = [
  {
    id: 'skills',
    title: 'Teknik Yetenekler',
    description: 'Teknik becerilerinizi listeleyin',
    icon: Code,
  },
  {
    id: 'projects',
    title: 'Projeler',
    description: 'Önemli projelerinizi ekleyin',
    icon: FolderOpen,
  },
  {
    id: 'certificates',
    title: 'Sertifikalar',
    description: 'Sertifikalarınızı listeleyin',
    icon: Award,
  },
  {
    id: 'languages',
    title: 'Diller',
    description: 'Yabancı dil bilginizi ekleyin',
    icon: Languages,
  },
  {
    id: 'references',
    title: 'Referanslar',
    description: 'İş referanslarınızı ekleyin',
    icon: Users,
  },
]

const GLOBAL_STEPS: StepItem[] = [
  {
    id: 'soft_skills',
    title: 'İletişim & Liderlik',
    description: 'Soft skills becerilerinizi yazın',
    icon: Users,
  },
]

const OFFICE_MANAGER_STEPS: StepItem[] = [
  {
    id: 'simple_skills',
    title: 'Yetenekler',
    description: 'Beceri ve yeteneklerinizi listeleyin',
    icon: Code,
  },
]

interface CVTemplate {
  id: string
  name: string
  description: string
  language: string
}

export function CVTemplateGenerator() {
  const { profile, getProfile } = useUserProfileStore()
  const [, setTemplates] = useState<CVTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
        fullName: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        linkedin: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
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
      skills: [''], // For office_manager
      references: [],
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form
  const selectedTemplate = watch('templateType')
  const selectedVersion = watch('version')
  const selectedLanguage = watch('language')

  // Calculate dynamic steps based on template and version
  const getSteps = () => {
    let steps = [...BASE_STEPS]

    // Remove objective step for office_manager template
    if (selectedTemplate === 'office_manager') {
      steps = steps.filter((step) => step.id !== 'objective')
    }

    if (selectedTemplate === 'basic_hr' && selectedVersion === 'turkey') {
      steps.push(...TURKEY_STEPS)
    } else if (selectedTemplate === 'office_manager') {
      // Office Manager has simple skills step
      steps.push(...OFFICE_MANAGER_STEPS)
    } else {
      // For global version or other templates
      steps.push(...GLOBAL_STEPS)
    }

    return steps
  }

  const STEPS = getSteps()
  const currentStepData = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0
  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Load CV templates
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingTemplates(true)
      try {
        const response = await cvGeneratorApi.getTemplates()
        if (response.success) {
          setTemplates(response.data)
        }
      } catch (err: any) {
        console.error('Template loading error:', err)

        // Authentication errors are handled by axios interceptor
        if (err?.status === 401) {
          console.log('🔐 Authentication error detected, letting interceptor handle it')
          return
        }

        // Handle other errors normally
        setError("Template'ler yüklenirken hata oluştu")
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])

  // State to track if profile has been loaded to prevent re-overriding user changes
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Load user profile data (only once)
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

    // Only auto-fill if profile hasn't been loaded yet
    if (!profileLoaded) {
      console.log('🔄 Auto-filling form from user profile (one-time only)')

      // Auto-fill from profile
      if (profile.firstName && profile.lastName) {
        setValue('personalInfo.fullName', `${profile.firstName} ${profile.lastName}`)
      }
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
          // Distribute skills across categories (simplified approach)
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
    console.log('Selected template:', selectedTemplate)

    setIsGenerating(true)
    setError(null)

    try {
      // Prepare API payload based on template type and version
      const apiPayload: {
        templateType: CVTemplateFormData['templateType']
        version?: CVTemplateFormData['version']
        language?: CVTemplateFormData['language']
        data: {
          personalInfo:
            | CVTemplateFormData['personalInfo']
            | {
                firstName: string
                lastName: string
                jobTitle: string
                email: string
                phone: string
                linkedin: string
              }
          objective?: CVTemplateFormData['objective']
          experience?: CVTemplateFormData['experience']
          education?: CVTemplateFormData['education']
          references?: CVTemplateFormData['references']
          technicalSkills?: CVTemplateFormData['technicalSkills']
          projects?: CVTemplateFormData['projects']
          certificates?: CVTemplateFormData['certificates']
          languages?: CVTemplateFormData['languages']
          communication?: CVTemplateFormData['communication']
          leadership?: CVTemplateFormData['leadership']
          skills?: string[]
        }
      } = {
        templateType: data.templateType,
        data: {
          personalInfo: data.personalInfo,
          objective: data.objective,
          experience: data.experience,
          education: data.education,
          references: data.references,
        },
      }

      // Handle different template types
      if (data.templateType === 'basic_hr') {
        apiPayload.version = data.version
        if (data.version === 'turkey') {
          apiPayload.language = data.language
          // Turkey-specific fields
          apiPayload.data.technicalSkills = data.technicalSkills
          apiPayload.data.projects = data.projects
          apiPayload.data.certificates = data.certificates
          apiPayload.data.languages = data.languages
          apiPayload.data.references = data.references
        } else {
          // Global version fields
          apiPayload.data.communication = data.communication
          apiPayload.data.leadership = data.leadership
        }
      } else if (data.templateType === 'office_manager') {
        // Office Manager specific payload structure
        apiPayload.data = {
          personalInfo: {
            firstName: data.personalInfo.firstName || data.personalInfo.fullName?.split(' ')[0] || '',
            lastName: data.personalInfo.lastName || data.personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
            jobTitle: data.personalInfo.jobTitle || '',
            email: data.personalInfo.email,
            phone: data.personalInfo.phone || '',
            linkedin: data.personalInfo.linkedin || '',
          },
          experience: data.experience,
          education: data.education,
          skills: data.skills || [],
        }
      } else {
        // For other templates, include all fields
        apiPayload.data.communication = data.communication
        apiPayload.data.leadership = data.leadership
        apiPayload.data.technicalSkills = data.technicalSkills
        apiPayload.data.projects = data.projects
        apiPayload.data.certificates = data.certificates
        apiPayload.data.languages = data.languages
      }

      const response = await cvGeneratorApi.generate(apiPayload as any)

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

      // Authentication errors are handled by axios interceptor
      // Don't override the error handling for 401 status
      if (err?.status === 401) {
        console.log('🔐 Authentication error detected, letting interceptor handle it')
        // Don't set error message, let the interceptor redirect to login
        return
      }

      // Handle other errors normally
      const errorMessage = err?.message || 'CV oluşturulurken hata oluştu. Lütfen tekrar deneyin.'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const confirmDownload = async () => {
    if (!generatedCV) return

    setIsGenerating(true) // Reuse loading state for download
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

      // Authentication errors are handled by axios interceptor
      if (err?.status === 401) {
        console.log('🔐 Authentication error detected, letting interceptor handle it')
        return
      }

      // Handle other errors normally
      const errorMessage = err?.message || 'CV indirme sırasında hata oluştu'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const fillDemoData = () => {
    console.log('🎯 Filling demo data, overriding any profile auto-fill')

    if (selectedTemplate === 'office_manager') {
      // Office Manager optimized demo data
      setValue('personalInfo.firstName', 'Ahmet')
      setValue('personalInfo.lastName', 'Yılmaz')
      setValue('personalInfo.jobTitle', 'Office Manager')
      setValue('personalInfo.email', 'ahmet.yilmaz@email.com')
      setValue('personalInfo.phone', '+90 555 123 4567')
      setValue('personalInfo.linkedin', 'linkedin.com/in/ahmetyilmaz')

      setValue('experience', [
        {
          jobTitle: 'Senior Office Manager',
          company: 'Tech Solutions Inc.',
          location: 'İstanbul',
          startDate: '2022-01',
          endDate: '',
          description:
            'Ofis operasyonlarını yönetme ve takım koordinasyonu. Bütçe planlama ve satın alma süreçlerinin yönetimi.',
          isCurrent: true,
        },
        {
          jobTitle: 'Office Coordinator',
          company: 'Business Solutions Ltd.',
          location: 'İstanbul',
          startDate: '2020-03',
          endDate: '2021-12',
          description: 'Günlük ofis operasyonlarının koordinasyonu, personel yönetimi ve müşteri ilişkileri.',
          isCurrent: false,
        },
      ])

      setValue('education', [
        {
          degree: 'Bachelor in Business Administration',
          university: 'İstanbul Üniversitesi',
          location: 'İstanbul',
          graduationDate: '2020-06',
          details: 'GPA: 3.5/4.0 - Management and Organization focus',
          isCurrent: false,
        },
      ])

      setValue('skills', [
        'Project Management',
        'Team Leadership',
        'Microsoft Office',
        'Budget Planning',
        'Customer Relations',
        'Office Administration',
        'Scheduling & Coordination',
        'Problem Solving',
      ])

      // Clear references and objective for office_manager
      setValue('references', [])
      setValue('objective', '')
    } else {
      // Basic HR and other templates demo data
      setValue('personalInfo.fullName', 'Ahmet Yılmaz')
      setValue('personalInfo.email', 'ahmet.yilmaz@email.com')
      setValue('personalInfo.phone', '+90 555 123 4567')
      setValue('personalInfo.address', 'Beşiktaş Mah. Teknoloji Cad. No:42/8')
      setValue('personalInfo.city', 'İstanbul')
      setValue('personalInfo.state', 'İstanbul')
      setValue('personalInfo.zipCode', '34353')

      setValue(
        'objective',
        '5+ yıl deneyimli Full Stack Developer. Modern web teknolojileri ile kullanıcı odaklı çözümler geliştirme konusunda uzman.',
      )

      setValue('experience', [
        {
          jobTitle: 'Senior Full Stack Developer',
          company: 'Tech Solutions Inc.',
          location: 'İstanbul',
          startDate: '2022-01',
          endDate: '',
          description:
            'React, Node.js ve AWS ile modern web uygulamaları geliştirme. Mikroservis mimarisi tasarımı ve implementasyonu.',
          isCurrent: true,
        },
        {
          jobTitle: 'Full Stack Developer',
          company: 'Digital Agency Pro',
          location: 'İstanbul',
          startDate: '2020-03',
          endDate: '2021-12',
          description: 'E-commerce platformları geliştirme. RESTful API tasarımı ve frontend-backend entegrasyonu.',
          isCurrent: false,
        },
      ])

      setValue('education', [
        {
          degree: 'Computer Engineering',
          university: 'İstanbul Teknik Üniversitesi',
          location: 'İstanbul',
          graduationDate: '2020-06',
          details: 'GPA: 3.7/4.0 - Software Engineering focus',
          isCurrent: false,
        },
      ])

      setValue('technicalSkills', {
        frontend: ['React', 'Vue.js', 'TypeScript'],
        backend: ['Node.js', 'Python', 'Express.js'],
        database: ['MongoDB', 'PostgreSQL', 'MySQL'],
        tools: ['AWS', 'Docker', 'Git'],
      })

      setValue('projects', [
        {
          name: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration',
          technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
        },
        {
          name: 'Real-time Chat Application',
          description: 'WebSocket-based chat application with video calling',
          technologies: ['React', 'Socket.io', 'WebRTC', 'Express'],
        },
      ])

      setValue('certificates', [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023',
        },
        {
          name: 'Google Cloud Professional Developer',
          issuer: 'Google Cloud',
          date: '2022',
        },
      ])

      setValue('languages', [
        {
          language: 'Turkish',
          level: 'Native',
        },
        {
          language: 'English',
          level: 'Advanced',
        },
      ])

      setValue(
        'communication',
        'Excellent written and verbal communication skills in Turkish and English. Experience in client presentations and technical documentation.',
      )
      setValue(
        'leadership',
        'Led cross-functional teams of 5+ developers. Mentored junior developers and implemented agile development processes.',
      )

      setValue('references', [
        {
          name: 'Mehmet Demir',
          company: 'Tech Solutions Inc.',
          contact: 'mehmet.demir@techsolutions.com | +90 555 987 6543',
        },
      ])
    }
  }

  const goToNext = async () => {
    // Validate current step
    let isValid = false

    switch (currentStepData.id) {
      case 'template':
        isValid = !!selectedTemplate
        break
      case 'personal':
        if (selectedTemplate === 'office_manager') {
          isValid = await form.trigger(['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email'])
        } else {
          isValid = await form.trigger(['personalInfo.fullName', 'personalInfo.email'])
        }
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
        isValid = true // Skills are optional for office manager
        break
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

    // Safely navigate to next step
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

  // Render step content
  const renderStepContent = () => {
    switch (currentStepData.id as string) {
      case 'template':
        return (
          <div className='space-y-6'>
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>CV Template Seçimi</Label>
              {isLoadingTemplates ? (
                <div className='flex items-center justify-center p-4'>
                  <LoadingSpinner size='sm' />
                  <span className='ml-2 text-sm text-muted-foreground'>Template'ler yükleniyor...</span>
                </div>
              ) : (
                <Select
                  value={selectedTemplate}
                  onValueChange={(value) => setValue('templateType', value as CVTemplateFormData['templateType'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Template seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='basic_hr'>Basic HR Resume</SelectItem>
                    <SelectItem value='office_manager'>Office Manager Resume</SelectItem>
                    <SelectItem value='simple_classic'>Simple Classic Resume</SelectItem>
                    <SelectItem value='stylish_accounting'>Stylish Accounting Resume</SelectItem>
                    <SelectItem value='minimalist_turkish'>Minimalist Turkish Resume</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedTemplate === 'basic_hr' && (
              <div className='space-y-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30'>
                <h4 className='font-medium text-primary'>Basic HR Template Ayarları</h4>

                <div className='space-y-3'>
                  <div>
                    <Label className='text-sm font-medium'>Version</Label>
                    <Select
                      value={selectedVersion}
                      onValueChange={(value) => setValue('version', value as CVTemplateFormData['version'])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Version seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='global'>Global</SelectItem>
                        <SelectItem value='turkey'>Turkey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedVersion === 'turkey' && (
                    <div>
                      <Label className='text-sm font-medium'>Language</Label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={(value) => setValue('language', value as CVTemplateFormData['language'])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Dil seçin' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='turkish'>Turkish</SelectItem>
                          <SelectItem value='english'>English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 'personal':
        return (
          <div className='space-y-4'>
            {selectedTemplate === 'office_manager' ? (
              // Office Manager specific fields
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='firstName'>Ad *</Label>
                  <Input
                    id='firstName'
                    {...register('personalInfo.firstName', {
                      required: 'Ad gereklidir',
                    })}
                    placeholder='Ahmet'
                  />
                  {errors.personalInfo?.firstName && (
                    <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor='lastName'>Soyad *</Label>
                  <Input
                    id='lastName'
                    {...register('personalInfo.lastName', {
                      required: 'Soyad gereklidir',
                    })}
                    placeholder='Yılmaz'
                  />
                  {errors.personalInfo?.lastName && (
                    <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.lastName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor='jobTitle'>İş Unvanı</Label>
                  <Input id='jobTitle' {...register('personalInfo.jobTitle')} placeholder='Office Manager' />
                </div>
                <div>
                  <Label htmlFor='email'>Email *</Label>
                  <Input id='email' type='email' {...register('personalInfo.email')} placeholder='ahmet@email.com' />
                  {errors.personalInfo?.email && (
                    <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor='phone'>Telefon</Label>
                  <Input id='phone' {...register('personalInfo.phone')} placeholder='+90 555 123 4567' />
                </div>
                <div>
                  <Label htmlFor='linkedin'>LinkedIn</Label>
                  <Input
                    id='linkedin'
                    {...register('personalInfo.linkedin')}
                    placeholder='linkedin.com/in/ahmetyilmaz'
                  />
                </div>
              </div>
            ) : (
              // Default fields for other templates
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='fullName'>Ad Soyad *</Label>
                    <Input id='fullName' {...register('personalInfo.fullName')} placeholder='Ahmet Yılmaz' />
                    {errors.personalInfo?.fullName && (
                      <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='email'>Email *</Label>
                    <Input id='email' type='email' {...register('personalInfo.email')} placeholder='ahmet@email.com' />
                    {errors.personalInfo?.email && (
                      <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='phone'>Telefon</Label>
                    <Input id='phone' {...register('personalInfo.phone')} placeholder='+90 555 123 4567' />
                  </div>
                  <div>
                    <Label htmlFor='city'>Şehir</Label>
                    <Input id='city' {...register('personalInfo.city')} placeholder='İstanbul' />
                  </div>
                </div>
                <div>
                  <Label htmlFor='address'>Adres</Label>
                  <Input id='address' {...register('personalInfo.address')} placeholder='Mahalle, Sokak, No' />
                </div>
              </>
            )}
          </div>
        )

      case 'objective':
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='objective'>Kariyer Hedefi</Label>
              <Textarea
                id='objective'
                {...register('objective')}
                placeholder='Kariyer hedefinizi ve profesyonel özetinizi yazın...'
                rows={4}
              />
            </div>
          </div>
        )

      case 'experience':
        return (
          <div className='space-y-4'>
            <div>
              <Label>İş Deneyimi</Label>
              <div className='space-y-4'>
                {watch('experience')?.map((_, index) => (
                  <Card key={index} className='p-4'>
                    <div className='flex justify-between items-center mb-3'>
                      <h4 className='font-medium text-sm text-muted-foreground'>Deneyim {index + 1}</h4>
                      {(watch('experience')?.length || 0) > 1 && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            const current = getValues('experience') || []
                            const updated = current.filter((_, i) => i !== index)
                            setValue('experience', updated)
                          }}
                          className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <Label>İş Unvanı</Label>
                          <Input {...register(`experience.${index}.jobTitle`)} placeholder='İş unvanı' />
                        </div>
                        <div>
                          <Label>Şirket Adı</Label>
                          <Input {...register(`experience.${index}.company`)} placeholder='Şirket adı' />
                        </div>
                        <div>
                          <Label>Lokasyon</Label>
                          <Input {...register(`experience.${index}.location`)} placeholder='Lokasyon' />
                        </div>
                        <div className='space-y-3'>
                          <div className='grid grid-cols-2 gap-2'>
                            <div>
                              <Label className='text-xs text-muted-foreground'>Başlangıç Tarihi</Label>
                              <MonthYearPicker
                                value={(() => {
                                  const dateValue = watch(`experience.${index}.startDate`)
                                  // YYYY-MM formatı kontrolü
                                  if (
                                    dateValue &&
                                    dateValue !== '' &&
                                    dateValue.includes('-') &&
                                    dateValue.length >= 7
                                  ) {
                                    return dateValue
                                  }
                                  return undefined
                                })()}
                                onChange={(value) => setValue(`experience.${index}.startDate`, value || '')}
                                placeholder='Başlangıç tarihi'
                                clearable={false}
                              />
                            </div>
                            <div>
                              <Label className='text-xs text-muted-foreground'>Bitiş Tarihi</Label>
                              <MonthYearPicker
                                value={(() => {
                                  const dateValue = watch(`experience.${index}.endDate`)
                                  const isCurrent = watch(`experience.${index}.isCurrent`)
                                  // Halen çalışıyorsa tarihi gösterme
                                  if (isCurrent) return undefined
                                  // YYYY-MM formatı kontrolü
                                  if (
                                    dateValue &&
                                    dateValue !== '' &&
                                    dateValue.includes('-') &&
                                    dateValue.length >= 7
                                  ) {
                                    return dateValue
                                  }
                                  return undefined
                                })()}
                                onChange={(value) => setValue(`experience.${index}.endDate`, value || '')}
                                placeholder='Bitiş tarihi'
                                clearable={true}
                                disabled={watch(`experience.${index}.isCurrent`)}
                              />
                            </div>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <Checkbox
                              id={`experience-${index}-current`}
                              checked={watch(`experience.${index}.isCurrent`) || false}
                              onCheckedChange={(checked) => {
                                setValue(`experience.${index}.isCurrent`, !!checked)
                                if (checked) {
                                  setValue(`experience.${index}.endDate`, '')
                                }
                              }}
                            />
                            <Label
                              htmlFor={`experience-${index}-current`}
                              className='text-sm font-normal cursor-pointer'
                            >
                              Halen burada çalışıyorum
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>İş Tanımı</Label>
                        <Textarea
                          {...register(`experience.${index}.description`)}
                          placeholder='İş tanımı ve başarılar'
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('experience') || []
                    setValue('experience', [
                      ...current,
                      {
                        jobTitle: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                        isCurrent: false,
                      },
                    ])
                  }}
                >
                  + Deneyim Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'education':
        return (
          <div className='space-y-4'>
            <div>
              <Label>Eğitim</Label>
              <div className='space-y-4'>
                {watch('education')?.map((_, index) => (
                  <Card key={index} className='p-4'>
                    <div className='flex justify-between items-center mb-3'>
                      <h4 className='font-medium text-sm text-muted-foreground'>Eğitim {index + 1}</h4>
                      {(watch('education')?.length || 0) > 1 && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            const current = getValues('education') || []
                            const updated = current.filter((_, i) => i !== index)
                            setValue('education', updated)
                          }}
                          className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <Label>Derece</Label>
                          <Input {...register(`education.${index}.degree`)} placeholder='Derece' />
                        </div>
                        <div>
                          <Label>Üniversite</Label>
                          <Input {...register(`education.${index}.university`)} placeholder='Üniversite' />
                        </div>
                        <div>
                          <Label>Lokasyon</Label>
                          <Input {...register(`education.${index}.location`)} placeholder='Lokasyon' />
                        </div>
                        <div className='space-y-3'>
                          <div>
                            <Label className='text-xs text-muted-foreground'>Mezuniyet Tarihi</Label>
                            <MonthYearPicker
                              value={(() => {
                                const dateValue = watch(`education.${index}.graduationDate`)
                                const isCurrent = watch(`education.${index}.isCurrent`)
                                // Halen okuyorsa tarihi gösterme
                                if (isCurrent) return undefined
                                // YYYY-MM formatı kontrolü
                                if (dateValue && dateValue !== '' && dateValue.includes('-') && dateValue.length >= 7) {
                                  return dateValue
                                }
                                return undefined
                              })()}
                              onChange={(value) => setValue(`education.${index}.graduationDate`, value || '')}
                              placeholder='Mezuniyet tarihi'
                              clearable={true}
                              disabled={watch(`education.${index}.isCurrent`)}
                            />
                          </div>

                          <div className='flex items-center space-x-2'>
                            <Checkbox
                              id={`education-${index}-current`}
                              checked={watch(`education.${index}.isCurrent`) || false}
                              onCheckedChange={(checked) => {
                                setValue(`education.${index}.isCurrent`, !!checked)
                                if (checked) {
                                  setValue(`education.${index}.graduationDate`, '')
                                }
                              }}
                            />
                            <Label
                              htmlFor={`education-${index}-current`}
                              className='text-sm font-normal cursor-pointer'
                            >
                              Halen burada okuyorum
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Detaylar</Label>
                        <Textarea {...register(`education.${index}.details`)} placeholder='Detaylar' rows={2} />
                      </div>
                    </div>
                  </Card>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('education') || []
                    setValue('education', [
                      ...current,
                      { degree: '', university: '', location: '', graduationDate: '', details: '', isCurrent: false },
                    ])
                  }}
                >
                  + Eğitim Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'skills':
        return (
          <div className='space-y-6'>
            {/* Frontend Skills */}
            <div>
              <Label className='text-base font-medium'>Frontend</Label>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
                {watch('technicalSkills.frontend')?.map((_, index) => (
                  <div key={index} className='relative'>
                    <Input {...register(`technicalSkills.frontend.${index}`)} placeholder='Frontend teknoloji' />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                      onClick={() => {
                        const current = getValues('technicalSkills.frontend') || []
                        setValue(
                          'technicalSkills.frontend',
                          current.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('technicalSkills.frontend') || []
                    setValue('technicalSkills.frontend', [...current, ''])
                  }}
                >
                  + Frontend Ekle
                </Button>
              </div>
            </div>

            {/* Backend Skills */}
            <div>
              <Label className='text-base font-medium'>Backend</Label>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
                {watch('technicalSkills.backend')?.map((_, index) => (
                  <div key={index} className='relative'>
                    <Input {...register(`technicalSkills.backend.${index}`)} placeholder='Backend teknoloji' />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                      onClick={() => {
                        const current = getValues('technicalSkills.backend') || []
                        setValue(
                          'technicalSkills.backend',
                          current.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('technicalSkills.backend') || []
                    setValue('technicalSkills.backend', [...current, ''])
                  }}
                >
                  + Backend Ekle
                </Button>
              </div>
            </div>

            {/* Database Skills */}
            <div>
              <Label className='text-base font-medium'>Database</Label>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
                {watch('technicalSkills.database')?.map((_, index) => (
                  <div key={index} className='relative'>
                    <Input {...register(`technicalSkills.database.${index}`)} placeholder='Veritabanı teknolojisi' />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                      onClick={() => {
                        const current = getValues('technicalSkills.database') || []
                        setValue(
                          'technicalSkills.database',
                          current.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('technicalSkills.database') || []
                    setValue('technicalSkills.database', [...current, ''])
                  }}
                >
                  + Database Ekle
                </Button>
              </div>
            </div>

            {/* Tools Skills */}
            <div>
              <Label className='text-base font-medium'>Tools</Label>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
                {watch('technicalSkills.tools')?.map((_, index) => (
                  <div key={index} className='relative'>
                    <Input {...register(`technicalSkills.tools.${index}`)} placeholder='Araç ve teknoloji' />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                      onClick={() => {
                        const current = getValues('technicalSkills.tools') || []
                        setValue(
                          'technicalSkills.tools',
                          current.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('technicalSkills.tools') || []
                    setValue('technicalSkills.tools', [...current, ''])
                  }}
                >
                  + Tool Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'projects':
        return (
          <div className='space-y-4'>
            <div>
              <Label>Projeler</Label>
              <div className='space-y-4'>
                {watch('projects')?.map((_, index) => (
                  <Card key={index} className='p-4'>
                    <div className='space-y-3'>
                      <div>
                        <Label>Proje Adı</Label>
                        <Input {...register(`projects.${index}.name`)} placeholder='Proje adı' />
                      </div>
                      <div>
                        <Label>Proje Açıklaması</Label>
                        <Textarea
                          {...register(`projects.${index}.description`)}
                          placeholder='Proje açıklaması'
                          rows={2}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label className='text-sm'>Teknolojiler</Label>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                          {watch(`projects.${index}.technologies`)?.map((_, techIndex) => (
                            <div key={techIndex} className='relative'>
                              <Input
                                {...register(`projects.${index}.technologies.${techIndex}`)}
                                placeholder='Teknoloji'
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                                onClick={() => {
                                  const current = getValues(`projects.${index}.technologies`) || []
                                  setValue(
                                    `projects.${index}.technologies`,
                                    current.filter((_, i) => i !== techIndex),
                                  )
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          )) || []}
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const current = getValues(`projects.${index}.technologies`) || []
                            setValue(`projects.${index}.technologies`, [...current, ''])
                          }}
                        >
                          + Teknoloji Ekle
                        </Button>
                      </div>
                    </div>
                  </Card>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('projects') || []
                    setValue('projects', [...current, { name: '', description: '', technologies: [''] }])
                  }}
                >
                  + Proje Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'certificates':
        return (
          <div className='space-y-4'>
            <div>
              <Label>Sertifikalar</Label>
              <div className='space-y-4'>
                {watch('certificates')?.map((_, index) => (
                  <Card key={index} className='p-4'>
                    <div className='space-y-3'>
                      <div>
                        <Label>Sertifika Adı</Label>
                        <Input {...register(`certificates.${index}.name`)} placeholder='Sertifika adı' />
                      </div>
                      <div>
                        <Label>Veren Kuruluş</Label>
                        <Input {...register(`certificates.${index}.issuer`)} placeholder='Veren kuruluş' />
                      </div>
                      <div>
                        <Label>Tarih</Label>
                        <Input {...register(`certificates.${index}.date`)} placeholder='Tarih (YYYY)' />
                      </div>
                    </div>
                  </Card>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('certificates') || []
                    setValue('certificates', [...current, { name: '', issuer: '', date: '' }])
                  }}
                >
                  + Sertifika Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'languages':
        return (
          <div className='space-y-4'>
            <div>
              <Label>Diller</Label>
              <div className='space-y-4'>
                {watch('languages')?.map((_, index) => (
                  <Card key={index} className='p-4'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <Label>Dil</Label>
                        <Input {...register(`languages.${index}.language`)} placeholder='Dil' />
                      </div>
                      <div>
                        <Label>Seviye</Label>
                        <Select
                          value={watch(`languages.${index}.level`)}
                          onValueChange={(value) => setValue(`languages.${index}.level`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Seviye' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Beginner'>Beginner</SelectItem>
                            <SelectItem value='Intermediate'>Intermediate</SelectItem>
                            <SelectItem value='Advanced'>Advanced</SelectItem>
                            <SelectItem value='Native'>Native</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('languages') || []
                    setValue('languages', [...current, { language: '', level: '' }])
                  }}
                >
                  + Dil Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'references':
        return (
          <div className='space-y-4'>
            <div>
              <Label>Referanslar</Label>
              <div className='space-y-4'>
                {watch('references')?.map((_, index) => (
                  <Card key={index} className='p-4'>
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <Label>İsim</Label>
                          <Input {...register(`references.${index}.name`)} placeholder='Referans kişi adı' />
                        </div>
                        <div>
                          <Label>Şirket</Label>
                          <Input {...register(`references.${index}.company`)} placeholder='Şirket adı' />
                        </div>
                      </div>
                      <div>
                        <Label>İletişim</Label>
                        <Input {...register(`references.${index}.contact`)} placeholder='Email | Telefon' />
                      </div>
                    </div>
                  </Card>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('references') || []
                    setValue('references', [...current, { name: '', company: '', contact: '' }])
                  }}
                >
                  + Referans Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'simple_skills':
        return (
          <div className='space-y-4'>
            <div>
              <Label>Yetenekler</Label>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                {watch('skills')?.map((_, index) => (
                  <div key={index} className='relative'>
                    <Input {...register(`skills.${index}`)} placeholder='Yetenek ekleyin' />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                      onClick={() => {
                        const current = getValues('skills') || []
                        setValue(
                          'skills',
                          current.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )) || []}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('skills') || []
                    setValue('skills', [...current, ''])
                  }}
                >
                  + Yetenek Ekle
                </Button>
              </div>
            </div>
          </div>
        )

      case 'soft_skills':
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='communication'>İletişim Becerileri</Label>
              <Textarea
                id='communication'
                {...register('communication')}
                placeholder='İletişim becerilerinizi açıklayın...'
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor='leadership'>Liderlik Becerileri</Label>
              <Textarea
                id='leadership'
                {...register('leadership')}
                placeholder='Liderlik deneyimlerinizi açıklayın...'
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return <div>Bu adım henüz tanımlanmamış</div>
    }
  }

  // Show only success message if CV is generated
  if (generatedCV) {
    return (
      <div className='container mx-auto p-6 max-w-4xl'>
        <div className='space-y-6'>
          {/* Generated CV Result */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                <CheckCircle className='h-6 w-6' />
                CV Başarıyla Oluşturuldu
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                <h4 className='font-medium text-green-800 dark:text-green-200 mb-2'>CV Bilgileri</h4>
                <div className='space-y-2 text-sm'>
                  <p>
                    <span className='font-medium'>Template:</span> {generatedCV.templateType}
                  </p>
                  <p>
                    <span className='font-medium'>Dosya Adı:</span> {generatedCV.fileName}
                  </p>
                  <p>
                    <span className='font-medium'>Oluşturulma:</span>{' '}
                    {new Date(generatedCV.generatedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              <div className='flex gap-2'>
                <Button onClick={() => setDownloadDialogOpen(true)} className='flex-1 flex items-center gap-2'>
                  <Download className='h-4 w-4' />
                  PDF İndir
                </Button>

                <Button
                  variant='outline'
                  onClick={() => {
                    setGeneratedCV(null)
                    setCurrentStep(0)
                    setCompletedSteps(new Set())
                    form.reset()
                  }}
                  className='flex-1'
                >
                  Yeni CV Oluştur
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Download Confirmation Dialog */}
          <AlertDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className='flex items-center gap-2'>
                  <Download className='h-5 w-5 text-primary' />
                  PDF Olarak İndir
                </AlertDialogTitle>
                <AlertDialogDescription>
                  "{generatedCV.templateType}" CV'nizi PDF olarak indirmek istediğinizden emin misiniz?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg my-4'>
                <div className='w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center'>
                  <FileText className='h-5 w-5 text-primary' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-sm'>PDF Formatında İndirilecek</p>
                  <p className='text-xs text-muted-foreground'>
                    Dosya otomatik olarak indirme klasörünüze kaydedilecektir
                  </p>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDownload} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
                      İndiriliyor...
                    </>
                  ) : (
                    <>
                      <Download className='h-4 w-4 mr-2' />
                      İndir
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <div className='space-y-6'>
        {/* Progress Header */}
        <Card>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold flex items-center gap-2'>
                  <FileText className='h-6 w-6' />
                  CV Generator
                  <Badge variant='secondary'>
                    <Sparkles className='h-3 w-3 mr-1' />
                    Beta
                  </Badge>
                </h1>
                <span className='text-sm text-muted-foreground'>
                  {currentStep + 1} / {STEPS.length}
                </span>
              </div>

              <Progress value={progress} className='h-2' />

              {/* Step Navigation */}
              <div className='flex flex-wrap gap-2'>
                {STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  return (
                    <button
                      key={step.id}
                      onClick={() => goToStep(index)}
                      disabled={index > currentStep && !completedSteps.has(index - 1)}
                      className={`flex items-center gap-2 px-3 py-2 text-xs rounded-full border transition-colors ${
                        index === currentStep
                          ? 'bg-primary text-primary-foreground border-primary'
                          : completedSteps.has(index)
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : index < currentStep
                              ? 'bg-muted text-muted-foreground border-muted'
                              : 'bg-background text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      <StepIcon className='w-3 h-3' />
                      {step.title}
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <currentStepData.icon className='h-6 w-6 text-primary' />
              <div>
                <CardTitle className='text-xl'>{currentStepData.title}</CardTitle>
                <p className='text-muted-foreground text-sm'>{currentStepData.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className='flex justify-between'>
          <Button variant='outline' onClick={goToPrevious} disabled={isFirstStep}>
            <ChevronLeft className='w-4 h-4 mr-2' />
            Önceki
          </Button>

          <div className='flex gap-2'>
            <Button type='button' variant='outline' onClick={fillDemoData} className='flex items-center gap-2'>
              <Sparkles className='h-4 w-4' />
              Demo Verilerle Doldur
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleSubmit(onSubmit, (errors) => {
                  console.log('Form validation errors:', errors)
                  console.log('Form values:', form.getValues())
                })}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Clock className='h-4 w-4 mr-2 animate-spin' />
                    CV Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <FileText className='h-4 w-4 mr-2' />
                    CV Oluştur
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={goToNext}>
                Sonraki
                <ChevronRight className='w-4 h-4 ml-2' />
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
