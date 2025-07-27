'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  FileText,
  Wand2,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  CheckCircle,
  Clock,
} from 'lucide-react'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { MonthYearPicker } from '@/components/core/month-year-picker'
import { ContentViewer } from '@/components/ui/common/ContentViewer'
import { ProfileRedirectAlert } from '@/components/ui/cv/ProfileRedirectAlert'
import { atsCvApi } from '@/lib/api/api'
import { ATSCVGenerateData, UserProfile } from '@/types/api.types'
import { useUserProfileStore } from '@/store/userProfileStore'

const atsFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır').max(50, 'Ad en fazla 50 karakter olabilir'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır').max(50, 'Soyad en fazla 50 karakter olabilir'),
    email: z.string().email('Geçerli bir email adresi girin'),
    phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Geçerli bir telefon numarası girin'),
    address: z.object({
      street: z.string().optional(),
      city: z.string().min(2, 'Şehir gereklidir'),
      country: z.string().min(2, 'Ülke gereklidir'),
    }),
    linkedIn: z.string().url("Geçerli bir LinkedIn URL'si girin").optional().or(z.literal('')),
    github: z.string().url("Geçerli bir GitHub URL'si girin").optional().or(z.literal('')),
    portfolio: z.string().url("Geçerli bir portfolio URL'si girin").optional().or(z.literal('')),
  }),
  professionalSummary: z.object({
    summary: z
      .string()
      .min(100, 'Profesyonel özet en az 100 karakter olmalıdır')
      .max(1000, 'Profesyonel özet 1000 karakteri geçemez'),
    targetPosition: z
      .string()
      .min(2, 'Hedef pozisyon gereklidir')
      .max(100, 'Hedef pozisyon en fazla 100 karakter olabilir'),
    yearsOfExperience: z
      .number()
      .min(0, 'Deneyim yılı 0 veya daha fazla olmalıdır')
      .max(50, 'Deneyim yılı 50 yılı geçemez'),
    keySkills: z
      .array(z.string().min(1))
      .min(3, 'En az 3 anahtar yetenek ekleyin')
      .max(20, 'En fazla 20 anahtar yetenek ekleyebilirsiniz'),
  }),
  workExperience: z
    .array(
      z.object({
        id: z.string().optional(),
        companyName: z.string().min(2, 'Şirket adı gereklidir'),
        position: z.string().min(2, 'İş unvanı gereklidir'),
        location: z.string().min(2, 'Konum gereklidir'),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        isCurrentRole: z.boolean(),
        achievements: z
          .array(z.string().min(5, 'Başarı en az 5 karakter olmalıdır'))
          .min(2, 'En az 2 başarı/sorumluluk eklemelisiniz')
          .max(10, 'En fazla 10 başarı/sorumluluk ekleyebilirsiniz'),
        technologies: z.string().optional(),
        industryType: z.string().optional(),
      }),
    )
    .min(1, 'En az bir iş deneyimi ekleyin'),
  education: z
    .array(
      z.object({
        id: z.string().optional(),
        institution: z.string().min(2, 'Okul adı gereklidir'),
        degree: z.string().min(2, 'Derece gereklidir'),
        fieldOfStudy: z.string().min(2, 'Bölüm gereklidir'),
        location: z.string().min(2, 'Konum gereklidir'),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        gpa: z
          .number()
          .min(0, 'Not ortalaması 0 veya daha fazla olmalıdır')
          .max(4, 'Not ortalaması 4.0 üzerinde olamaz')
          .optional(),
        honors: z.string().optional(),
        relevantCoursework: z.string().optional(),
      }),
    )
    .min(1, 'En az bir eğitim bilgisi ekleyin'),
  skills: z.object({
    technical: z
      .array(
        z.object({
          category: z.string().min(1, 'Kategori gereklidir'),
          items: z
            .array(
              z.object({
                name: z.string().min(1, 'Yetenek adı gereklidir'),
                proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
              }),
            )
            .min(1, 'Her kategoride en az bir yetenek olmalıdır'),
        }),
      )
      .min(1, 'En az bir teknik yetenek kategorisi ekleyin'),
    languages: z
      .array(
        z.object({
          language: z.string().min(1, 'Dil adı gereklidir'),
          proficiency: z.enum(['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'], {
            errorMap: () => ({ message: 'Seviye: Native, Fluent, Advanced, Intermediate veya Basic olmalıdır' }),
          }),
        }),
      )
      .optional(),
    soft: z.array(z.string().min(1)).min(1, 'En az bir kişisel yetenek ekleyin'),
  }),
  configuration: z.object({
    targetCompany: z.string().optional(),
    jobDescription: z.string().optional(),
    language: z.enum(['TURKISH', 'ENGLISH']),
    cvType: z.enum(['ATS_OPTIMIZED', 'TECHNICAL', 'EXECUTIVE']),
    templateStyle: z.enum(['MINIMAL', 'PROFESSIONAL', 'MODERN']),
    useAI: z.boolean().optional(),
  }),
  certifications: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2, 'Sertifika adı gereklidir'),
        issuingOrganization: z.string().min(2, 'Veren kurum gereklidir'),
        issueDate: z.string().optional(),
        expirationDate: z.string().optional(),
        credentialId: z.string().optional(),
        verificationUrl: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
      }),
    )
    .optional(),
  projects: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2, 'Proje adı gereklidir'),
        description: z.string().min(10, 'Proje açıklaması en az 10 karakter olmalıdır'),
        technologies: z.array(z.string().min(1)).min(1, 'En az bir teknoloji ekleyin'),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        url: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
        achievements: z
          .array(z.string().min(5, 'Başarı en az 5 karakter olmalıdır'))
          .min(1, 'En az bir başarı ekleyin'),
      }),
    )
    .optional(),
})

type ATSFormData = z.infer<typeof atsFormSchema>

export function ATSCVForm() {
  const router = useRouter()
  const { profile, getProfile, isLoading: profileLoading } = useUserProfileStore()
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileCompleteCheck, setProfileCompleteCheck] = useState<{
    isComplete: boolean
    missingFields: string[]
    completionPercentage: number
    priorityMissingField: { tab: string; label: string } | null
  } | null>(null)

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

  const workExperience = watch('workExperience')
  const education = watch('education')
  const technicalSkills = watch('skills.technical')
  const softSkills = watch('skills.soft')
  const languages = watch('skills.languages') || []
  const certifications = watch('certifications') || []
  const projects = watch('projects') || []

  // Helper functions for profile data mapping
  const formatDate = (year?: number, month?: number): string => {
    if (!year) return ''
    if (month === undefined || month === null) return `${year}-01-01` // Default to January 1st if no month provided
    return `${year}-${month.toString().padStart(2, '0')}-01` // Always add day as 01
  }

  const mapProfileToFormData = useCallback((userProfile: UserProfile): Partial<ATSFormData> => {
    const mappedData: Partial<ATSFormData> = {
      personalInfo: {
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: {
          street: '',
          city: userProfile.city || '',
          country: userProfile.country || '',
        },
        linkedIn: userProfile.linkedin || '',
        github: '',
        portfolio: userProfile.portfolioWebsite || '',
      },
      professionalSummary: {
        summary: userProfile.aboutMe || '',
        targetPosition: '', // Bu profilde yok, kullanıcı girmeli
        yearsOfExperience: userProfile.experiences?.length || 0,
        keySkills: userProfile.skills?.slice(0, 5).map((skill) => skill.name) || [''],
      },
      workExperience: userProfile.experiences?.map((exp) => ({
        id: exp.id,
        position: exp.position,
        companyName: exp.companyName,
        location: exp.location || '',
        startDate: formatDate(exp.startYear, exp.startMonth),
        endDate: exp.isCurrent ? '' : formatDate(exp.endYear, exp.endMonth),
        isCurrentRole: exp.isCurrent,
        achievements: exp.achievements
          ? [exp.achievements, exp.description || '']
          : exp.description
            ? [exp.description, '']
            : ['', ''],
      })) || [
        {
          id: '',
          position: '',
          companyName: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrentRole: false,
          achievements: ['', ''],
        },
      ],
      education: userProfile.educations?.map((edu) => ({
        id: edu.id,
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        institution: edu.schoolName,
        location: '',
        startDate: formatDate(edu.startYear),
        endDate: edu.isCurrent ? '' : formatDate(edu.endYear),
      })) || [
        {
          id: '',
          degree: '',
          fieldOfStudy: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
        },
      ],
      skills: {
        technical: userProfile.skills
          ? [
              {
                category: 'General',
                items: userProfile.skills
                  .filter(
                    (skill) =>
                      skill.category === 'TECHNICAL' || skill.category === 'TOOL' || skill.category === 'FRAMEWORK',
                  )
                  .map((skill) => ({
                    name: skill.name,
                    proficiencyLevel: 'Intermediate' as const,
                  })),
              },
            ]
          : [
              {
                category: '',
                items: [{ name: '', proficiencyLevel: 'Intermediate' as const }],
              },
            ],
        languages: userProfile.skills
          ?.filter((skill) => skill.category === 'LANGUAGE')
          .map((skill) => ({
            language: skill.name,
            proficiency: 'Intermediate' as const,
          })) || [{ language: '', proficiency: 'Intermediate' as const }],
        soft: userProfile.skills
          ?.filter((skill) => skill.category === 'SOFT_SKILL' || skill.category === 'OTHER')
          .map((skill) => skill.name) || [''],
      },
      certifications:
        userProfile.certificates?.map((cert) => ({
          id: cert.id,
          name: cert.certificateName,
          issuingOrganization: cert.issuer || '',
          issueDate: formatDate(cert.issueYear, cert.issueMonth),
          credentialId: cert.credentialId || '',
        })) || [],
    }

    return mappedData
  }, [])

  const checkProfileCompleteness = (userProfile: UserProfile | null) => {
    if (!userProfile) {
      return {
        isComplete: false,
        missingFields: ['Profile not found'],
        completionPercentage: 0,
        priorityMissingField: null,
      }
    }

    const requiredFields = [
      { field: 'firstName', label: 'Ad', value: userProfile.firstName, priority: 1, tab: 'personal' },
      { field: 'lastName', label: 'Soyad', value: userProfile.lastName, priority: 1, tab: 'personal' },
      { field: 'email', label: 'E-posta', value: userProfile.email, priority: 1, tab: 'personal' },
      { field: 'phone', label: 'Telefon', value: userProfile.phone, priority: 1, tab: 'personal' },
      {
        field: 'aboutMe',
        label: 'Hakkımda/Profesyonel Özet',
        value: userProfile.aboutMe,
        priority: 2,
        tab: 'personal',
      },
    ]

    const optionalButImportantFields = [
      { field: 'city', label: 'Şehir', value: userProfile.city, priority: 3, tab: 'personal' },
      { field: 'linkedin', label: 'LinkedIn', value: userProfile.linkedin, priority: 4, tab: 'personal' },
      {
        field: 'experiences',
        label: 'İş Deneyimi',
        value: userProfile.experiences?.length > 0,
        priority: 2,
        tab: 'experience',
      },
      {
        field: 'educations',
        label: 'Eğitim',
        value: userProfile.educations?.length > 0,
        priority: 2,
        tab: 'education',
      },
      { field: 'skills', label: 'Yetenekler', value: userProfile.skills?.length > 0, priority: 1, tab: 'skills' },
    ]

    const allFields = [...requiredFields, ...optionalButImportantFields]
    const filledFields = allFields.filter((field) => {
      if (typeof field.value === 'boolean') return field.value
      return field.value && field.value.toString().trim() !== ''
    })

    const missingRequired = requiredFields.filter((field) => !field.value || field.value.toString().trim() === '')

    const missingOptional = optionalButImportantFields.filter((field) => {
      if (typeof field.value === 'boolean') return !field.value
      return !field.value || field.value.toString().trim() === ''
    })

    // Öncelik sırasına göre eksik alanları sırala
    const allMissingFields = [...missingRequired, ...missingOptional].sort((a, b) => a.priority - b.priority)
    const priorityMissingField = allMissingFields[0] || null

    const completionPercentage = Math.round((filledFields.length / allFields.length) * 100)

    // Check if any high priority fields are missing (priority 1)
    const missingHighPriorityFields = allMissingFields.filter((field) => field.priority === 1)
    const isComplete =
      missingRequired.length === 0 && missingHighPriorityFields.length === 0 && completionPercentage >= 70

    return {
      isComplete,
      missingFields: [...missingRequired.map((f) => f.label), ...missingOptional.map((f) => f.label)],
      completionPercentage,
      priorityMissingField,
    }
  }

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!profile) {
        await getProfile()
      }
    }
    loadProfile()
  }, [profile, getProfile])

  // Check profile completeness and auto-fill form when profile is loaded
  useEffect(() => {
    if (profile) {
      const completeness = checkProfileCompleteness(profile)
      setProfileCompleteCheck(completeness)

      if (completeness.isComplete || completeness.completionPercentage >= 50) {
        const mappedData = mapProfileToFormData(profile)

        // Auto-fill form fields
        Object.entries(mappedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as keyof ATSFormData, value as ATSFormData[keyof ATSFormData])
          }
        })
      }
    } else {
      setProfileCompleteCheck({
        isComplete: false,
        missingFields: ['Profile not found'],
        completionPercentage: 0,
        priorityMissingField: { tab: 'personal', label: 'Profil Bilgileri' },
      })
    }
  }, [profile, setValue, mapProfileToFormData])

  const addWorkExperience = () => {
    const current = getValues('workExperience')
    setValue('workExperience', [
      ...current,
      {
        id: '',
        position: '',
        companyName: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        achievements: ['', ''],
      },
    ])
  }

  const removeWorkExperience = (index: number) => {
    const current = getValues('workExperience')
    if (current.length > 1) {
      setValue(
        'workExperience',
        current.filter((_, i) => i !== index),
      )
    }
  }

  const addEducation = () => {
    const current = getValues('education')
    setValue('education', [
      ...current,
      {
        id: '',
        degree: '',
        fieldOfStudy: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
      },
    ])
  }

  const removeEducation = (index: number) => {
    const current = getValues('education')
    if (current.length > 1) {
      setValue(
        'education',
        current.filter((_, i) => i !== index),
      )
    }
  }

  const addSkill = (type: 'technical' | 'soft') => {
    if (type === 'technical') {
      const current = getValues('skills.technical')
      setValue('skills.technical', [
        ...current,
        {
          category: '',
          items: [{ name: '', proficiencyLevel: 'Intermediate' as const }],
        },
      ])
    } else {
      const current = getValues('skills.soft')
      setValue('skills.soft', [...current, ''])
    }
  }

  const removeSkill = (type: 'technical' | 'soft', index: number) => {
    if (type === 'technical') {
      const current = getValues('skills.technical')
      if (current.length > 1) {
        setValue(
          'skills.technical',
          current.filter((_, i) => i !== index),
        )
      }
    } else {
      const current = getValues('skills.soft')
      if (current.length > 1) {
        setValue(
          'skills.soft',
          current.filter((_, i) => i !== index),
        )
      }
    }
  }

  const addCertification = () => {
    setValue('certifications', [
      ...certifications,
      {
        id: '',
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        verificationUrl: '',
      },
    ])
  }

  const addProject = () => {
    setValue('projects', [
      ...projects,
      {
        id: '',
        name: '',
        description: '',
        technologies: [''],
        startDate: '',
        endDate: '',
        url: '',
        achievements: [''],
      },
    ])
  }

  const removeProject = (index: number) => {
    setValue(
      'projects',
      projects.filter((_, i) => i !== index),
    )
  }

  const removeCertification = (index: number) => {
    setValue(
      'certifications',
      certifications.filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (data: ATSFormData) => {
    try {
      setIsGenerating(true)
      setError(null)

      const formattedData: ATSCVGenerateData = {
        personalInfo: {
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          email: data.personalInfo.email,
          phone: data.personalInfo.phone,
          address: {
            street: data.personalInfo.address.street,
            city: data.personalInfo.address.city,
            country: data.personalInfo.address.country,
          },
          linkedIn: data.personalInfo.linkedIn,
          github: data.personalInfo.github,
          portfolio: data.personalInfo.portfolio,
        },
        professionalSummary: {
          summary: data.professionalSummary.summary,
          targetPosition: data.professionalSummary.targetPosition,
          yearsOfExperience: data.professionalSummary.yearsOfExperience,
          keySkills: data.professionalSummary.keySkills.filter((skill) => skill.trim() !== ''),
        },
        workExperience: data.workExperience
          .filter((exp) => exp.companyName.trim() !== '' && exp.position.trim() !== '')
          .map((exp) => ({
            id: exp.id || '',
            companyName: exp.companyName,
            position: exp.position,
            location: exp.location,
            startDate: exp.startDate || '',
            endDate: exp.endDate || undefined,
            isCurrentRole: exp.isCurrentRole,
            achievements: exp.achievements.filter((ach) => ach.trim() !== ''),
            technologies:
              exp.technologies && exp.technologies.trim()
                ? exp.technologies
                    .split(',')
                    .map((tech: string) => tech.trim())
                    .filter((tech: string) => tech !== '')
                : undefined,
            industryType: exp.industryType?.trim() || undefined,
          })),
        education: data.education
          .filter((edu) => edu.institution.trim() !== '' && edu.degree.trim() !== '')
          .map((edu) => ({
            id: edu.id || '',
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            location: edu.location,
            startDate: edu.startDate || '',
            endDate: edu.endDate || undefined,
            gpa: edu.gpa,
            honors:
              edu.honors && typeof edu.honors === 'string' && edu.honors.trim()
                ? edu.honors
                    .split(',')
                    .map((h: string) => h.trim())
                    .filter((h: string) => h !== '')
                : undefined,
            relevantCoursework:
              edu.relevantCoursework && typeof edu.relevantCoursework === 'string' && edu.relevantCoursework.trim()
                ? edu.relevantCoursework
                    .split(',')
                    .map((c: string) => c.trim())
                    .filter((c: string) => c !== '')
                : undefined,
          })),
        skills: {
          technical: data.skills.technical
            .filter((cat) => cat.category.trim() !== '' && cat.items.some((item) => item.name.trim() !== ''))
            .map((cat) => ({
              category: cat.category,
              items: cat.items.filter((item) => item.name.trim() !== ''),
            })),
          languages: (data.skills.languages || []).map((lang) => ({
            language: lang.language,
            proficiency: lang.proficiency,
          })),
          soft: data.skills.soft.filter((s) => s.trim() !== ''),
        },
        configuration: {
          targetCompany: data.configuration.targetCompany,
          jobDescription: data.configuration.jobDescription,
          language: data.configuration.language,
          cvType: data.configuration.cvType,
          templateStyle: data.configuration.templateStyle,
          useAI: data.configuration.useAI,
        },
        certifications: (data.certifications || [])
          .filter((cert) => cert.name.trim() !== '')
          .map((cert) => ({
            id: cert.id || '',
            name: cert.name,
            issuingOrganization: cert.issuingOrganization,
            issueDate: cert.issueDate || formatDate(new Date().getFullYear(), new Date().getMonth() + 1),
            expirationDate: cert.expirationDate,
            credentialId: cert.credentialId,
            verificationUrl: cert.verificationUrl,
          })),
        projects: (data.projects || [])
          .filter((proj) => proj.name.trim() !== '')
          .map((proj) => ({
            id: proj.id || '',
            name: proj.name,
            description: proj.description,
            technologies: proj.technologies.filter((tech) => tech.trim() !== ''),
            startDate: proj.startDate,
            endDate: proj.endDate,
            url: proj.url,
            achievements: proj.achievements.filter((ach) => ach.trim() !== ''),
          })),
      }

      const response = await atsCvApi.generate(formattedData)

      if (response.success) {
        setGeneratedContent(`ATS CV başarıyla oluşturuldu!
        
Dosya Adı: ${response.data.fileName}
Dosya Boyutu: ${(response.data.fileSize / 1024).toFixed(1)} KB
Durum: ${response.data.generationStatus}
Oluşturma Tarihi: ${new Date(response.data.createdAt).toLocaleString('tr-TR')}

PDF indirmek için aşağıdaki butonu kullanın.`)

        // PDF download functionality will be added here
        console.log('Download URL:', response.data.downloadUrl)
      }
    } catch (err) {
      setError('CV oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('ATS CV generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Profile Completeness Status */}
      {profileLoading ? (
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <Clock className='h-5 w-5 animate-spin text-primary' />
              <span>Profil bilgileriniz yükleniyor...</span>
            </div>
          </CardContent>
        </Card>
      ) : profileCompleteCheck && !profileCompleteCheck.isComplete ? (
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='font-medium'>Profil Tamamlanma: {profileCompleteCheck.completionPercentage}%</span>
                <Badge variant={profileCompleteCheck.completionPercentage >= 70 ? 'default' : 'destructive'}>
                  {profileCompleteCheck.completionPercentage >= 70 ? 'Yeterli' : 'Eksik'}
                </Badge>
              </div>

              {profileCompleteCheck.completionPercentage < 50 ? (
                <div className='space-y-2'>
                  <p className='text-sm text-destructive'>
                    ATS CV oluşturmak için profilinizin daha fazla bilgi içermesi gerekiyor.
                    {profileCompleteCheck.priorityMissingField && (
                      <span className='block mt-1 font-medium'>
                        En önemli eksik alan: {profileCompleteCheck.priorityMissingField.label}
                      </span>
                    )}
                  </p>
                  <p className='text-sm'>
                    Eksik alanlar: {profileCompleteCheck.missingFields.slice(0, 3).join(', ')}
                    {profileCompleteCheck.missingFields.length > 3 &&
                      ` ve ${profileCompleteCheck.missingFields.length - 3} daha`}
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const targetTab = profileCompleteCheck.priorityMissingField?.tab || 'personal'
                      router.push(`/profile?tab=${targetTab}`)
                    }}
                    className='mt-2'
                  >
                    <ExternalLink className='h-4 w-4 mr-2' />
                    {profileCompleteCheck.priorityMissingField?.label} Ekle
                  </Button>
                </div>
              ) : (
                <div className='space-y-2'>
                  <p className='text-sm text-amber-600'>
                    Profiliniz ATS CV oluşturmak için yeterli bilgiye sahip. Daha iyi sonuçlar için tüm alanları
                    tamamlayabilirsiniz.
                  </p>
                  {profileCompleteCheck.missingFields.length > 0 && (
                    <p className='text-sm text-muted-foreground'>
                      Eksik alanlar: {profileCompleteCheck.missingFields.slice(0, 3).join(', ')}
                      {profileCompleteCheck.missingFields.length > 3 &&
                        ` ve ${profileCompleteCheck.missingFields.length - 3} daha`}
                    </p>
                  )}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const targetTab = profileCompleteCheck.priorityMissingField?.tab || 'personal'
                      router.push(`/profile?tab=${targetTab}`)
                    }}
                    className='mt-2'
                  >
                    <ExternalLink className='h-4 w-4 mr-2' />
                    Profili İyileştir
                  </Button>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ) : profileCompleteCheck?.isComplete ? (
        <Alert>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <AlertDescription>
            <div className='flex items-center justify-between'>
              <span className='text-green-600 font-medium'>
                ✨ Profiliniz ATS CV oluşturmak için hazır! Aşağıdaki form otomatik olarak doldurulmuştur.
              </span>
              <Badge variant='outline' className='border-green-200 text-green-700'>
                {profileCompleteCheck.completionPercentage}% Tamamlandı
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Kişisel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Personal Info Empty State */}
            {(!watch('personalInfo.firstName')?.trim() ||
              !watch('personalInfo.lastName')?.trim() ||
              !watch('personalInfo.email')?.trim() ||
              !watch('personalInfo.phone')?.trim()) && (
              <ProfileRedirectAlert
                sectionName='Kişisel Bilgiler'
                description='Profilde kişisel bilgilerinizi ekleyerek otomatik doldurabilirsiniz.'
                targetTab='personal'
              />
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>Ad *</Label>
                <Input id='firstName' placeholder='Ahmet' {...register('personalInfo.firstName')} />
                {errors.personalInfo?.firstName && (
                  <p className='text-sm text-destructive'>{errors.personalInfo.firstName.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Soyad *</Label>
                <Input id='lastName' placeholder='Yılmaz' {...register('personalInfo.lastName')} />
                {errors.personalInfo?.lastName && (
                  <p className='text-sm text-destructive'>{errors.personalInfo.lastName.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>E-posta *</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='ahmet@example.com'
                    className='pl-10'
                    {...register('personalInfo.email')}
                  />
                </div>
                {errors.personalInfo?.email && (
                  <p className='text-sm text-destructive'>{errors.personalInfo.email.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Telefon *</Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='phone'
                    placeholder='+90 555 123 45 67'
                    className='pl-10'
                    {...register('personalInfo.phone')}
                  />
                </div>
                {errors.personalInfo?.phone && (
                  <p className='text-sm text-destructive'>{errors.personalInfo.phone.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='city'>Şehir</Label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='city'
                    placeholder='İstanbul'
                    className='pl-10'
                    {...register('personalInfo.address.city')}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='country'>Ülke *</Label>
                <Input id='country' placeholder='Türkiye' {...register('personalInfo.address.country')} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='linkedin'>LinkedIn Profili</Label>
                <div className='relative'>
                  <Linkedin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='linkedin'
                    placeholder='https://linkedin.com/in/ahmet-yilmaz'
                    className='pl-10'
                    {...register('personalInfo.linkedIn')}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='portfolio'>Portfolio/Website</Label>
                <div className='relative'>
                  <Globe className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='portfolio'
                    placeholder='https://ahmetyilmaz.dev'
                    className='pl-10'
                    {...register('personalInfo.portfolio')}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='github'>GitHub</Label>
                <div className='relative'>
                  <Globe className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    id='github'
                    placeholder='https://github.com/username'
                    className='pl-10'
                    {...register('personalInfo.github')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Profesyonel Özet
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Professional Summary Empty State */}
            {!watch('professionalSummary.summary')?.trim() && (
              <ProfileRedirectAlert
                sectionName='Profesyonel Özet'
                description='Profilde hakkımda bilgilerinizi ekleyerek otomatik doldurabilirsiniz.'
                targetTab='personal'
                buttonText='Profilde Hakkımda Ekle'
              />
            )}

            <div className='space-y-2'>
              <Label htmlFor='summary'>Profesyonel Özet *</Label>
              <Textarea
                id='summary'
                placeholder='Deneyimli frontend developer olarak React, TypeScript ve modern web teknolojilerinde uzmanım...'
                rows={4}
                {...register('professionalSummary.summary')}
              />
              <p className='text-xs text-muted-foreground'>
                {watch('professionalSummary.summary')?.length || 0} / 500 karakter
              </p>
              {errors.professionalSummary?.summary && (
                <p className='text-sm text-destructive'>{errors.professionalSummary.summary.message}</p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='targetPosition'>Hedef Pozisyon *</Label>
                <Input
                  id='targetPosition'
                  placeholder='Frontend Developer'
                  {...register('professionalSummary.targetPosition')}
                />
                {errors.professionalSummary?.targetPosition && (
                  <p className='text-sm text-destructive'>{errors.professionalSummary.targetPosition.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='yearsOfExperience'>Deneyim Yılı *</Label>
                <Input
                  id='yearsOfExperience'
                  type='number'
                  min='0'
                  placeholder='3'
                  {...register('professionalSummary.yearsOfExperience', { valueAsNumber: true })}
                />
                {errors.professionalSummary?.yearsOfExperience && (
                  <p className='text-sm text-destructive'>{errors.professionalSummary.yearsOfExperience.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2 flex flex-col w-fit'>
              <Label>
                Anahtar Yetenekler * <span className='text-xs text-muted-foreground'>(En az 3 adet gerekli)</span>
              </Label>
              {watch('professionalSummary.keySkills')?.map((_, index) => (
                <div key={index} className='flex gap-2'>
                  <Input
                    placeholder='React, TypeScript, Node.js'
                    {...register(`professionalSummary.keySkills.${index}`)}
                  />
                  {(watch('professionalSummary.keySkills')?.length || 0) > 1 && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const current = getValues('professionalSummary.keySkills')
                        setValue(
                          'professionalSummary.keySkills',
                          current.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => {
                  const current = getValues('professionalSummary.keySkills')
                  setValue('professionalSummary.keySkills', [...current, ''])
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Anahtar Yetenek Ekle
              </Button>
              {errors.professionalSummary?.keySkills && (
                <p className='text-sm text-destructive'>{errors.professionalSummary.keySkills.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <Briefcase className='h-5 w-5' />
                İş Deneyimi
              </CardTitle>
              <Button type='button' variant='outline' size='sm' onClick={addWorkExperience}>
                <Plus className='h-4 w-4 mr-2' />
                Deneyim Ekle
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Work Experience Empty State */}
            {workExperience.length === 1 &&
              !workExperience[0].position?.trim() &&
              !workExperience[0].companyName?.trim() && (
                <ProfileRedirectAlert
                  sectionName='İş Deneyimi'
                  description='Profilde iş deneyimlerinizi ekleyerek otomatik doldurabilirsiniz.'
                  targetTab='experience'
                />
              )}

            {workExperience.map((_, index) => (
              <div key={index} className='border rounded-lg p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>Deneyim {index + 1}</h4>
                  {workExperience.length > 1 && (
                    <Button type='button' variant='ghost' size='sm' onClick={() => removeWorkExperience(index)}>
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Pozisyon *</Label>
                    <Input placeholder='Frontend Developer' {...register(`workExperience.${index}.position`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Şirket *</Label>
                    <Input placeholder='ABC Teknoloji' {...register(`workExperience.${index}.companyName`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Konum</Label>
                    <Input placeholder='İstanbul, Türkiye' {...register(`workExperience.${index}.location`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Başlangıç Tarihi *</Label>
                    <MonthYearPicker
                      value={watch(`workExperience.${index}.startDate`) || ''}
                      onChange={(value) => setValue(`workExperience.${index}.startDate`, value || '')}
                      placeholder='Başlangıç tarihi seçin'
                      clearable={false}
                    />
                  </div>
                  {!watch(`workExperience.${index}.isCurrentRole`) && (
                    <div className='space-y-2'>
                      <Label>Bitiş Tarihi</Label>
                      <MonthYearPicker
                        value={watch(`workExperience.${index}.endDate`) || ''}
                        onChange={(value) => setValue(`workExperience.${index}.endDate`, value || '')}
                        placeholder='Bitiş tarihi seçin'
                        clearable={true}
                      />
                    </div>
                  )}
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id={`current-${index}`}
                      {...register(`workExperience.${index}.isCurrentRole`)}
                    />
                    <Label htmlFor={`current-${index}`}>Halen devam ediyor</Label>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>
                    Başarılar ve Sorumluluklar{' '}
                    <span className='text-xs text-muted-foreground'>(En az 2 adet gerekli)</span>
                  </Label>
                  {watch(`workExperience.${index}.achievements`)?.map((_, achIndex) => (
                    <div key={achIndex} className='flex gap-2'>
                      <Input
                        placeholder='React ve TypeScript ile 5 farklı proje geliştirdim'
                        {...register(`workExperience.${index}.achievements.${achIndex}`)}
                      />
                      {watch(`workExperience.${index}.achievements`)!.length > 1 && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const current = getValues(`workExperience.${index}.achievements`)
                            setValue(
                              `workExperience.${index}.achievements`,
                              current.filter((_, i) => i !== achIndex),
                            )
                          }}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const current = getValues(`workExperience.${index}.achievements`)
                      setValue(`workExperience.${index}.achievements`, [...current, ''])
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Başarı Ekle
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Eğitim</CardTitle>
              <Button type='button' variant='outline' size='sm' onClick={addEducation}>
                <Plus className='h-4 w-4 mr-2' />
                Eğitim Ekle
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Education Empty State */}
            {education.length === 1 &&
              !education[0].degree?.trim() &&
              !education[0].fieldOfStudy?.trim() &&
              !education[0].institution?.trim() && (
                <ProfileRedirectAlert
                  sectionName='Eğitim'
                  description='Profilde eğitim bilgilerinizi ekleyerek otomatik doldurabilirsiniz.'
                  targetTab='education'
                />
              )}

            {education.map((_, index) => (
              <div key={index} className='border rounded-lg p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>Eğitim {index + 1}</h4>
                  {education.length > 1 && (
                    <Button type='button' variant='ghost' size='sm' onClick={() => removeEducation(index)}>
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Derece *</Label>
                    <Input placeholder='Lisans' {...register(`education.${index}.degree`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Bölüm *</Label>
                    <Input placeholder='Bilgisayar Mühendisliği' {...register(`education.${index}.fieldOfStudy`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Okul *</Label>
                    <Input placeholder='İstanbul Teknik Üniversitesi' {...register(`education.${index}.institution`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Konum</Label>
                    <Input placeholder='İstanbul, Türkiye' {...register(`education.${index}.location`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Başlangıç Tarihi *</Label>
                    <MonthYearPicker
                      value={watch(`education.${index}.startDate`) || ''}
                      onChange={(value) => setValue(`education.${index}.startDate`, value || '')}
                      placeholder='Başlangıç tarihi seçin'
                      clearable={false}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Bitiş Tarihi</Label>
                    <MonthYearPicker
                      value={watch(`education.${index}.endDate`) || ''}
                      onChange={(value) => setValue(`education.${index}.endDate`, value || '')}
                      placeholder='Bitiş tarihi seçin'
                      clearable={true}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Not Ortalaması (GPA)</Label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      max='4'
                      placeholder='3.50'
                      {...register(`education.${index}.gpa`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Yetenekler</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Skills Empty State */}
            {!technicalSkills.some(
              (cat) => cat.category.trim() !== '' || cat.items.some((item) => item.name.trim() !== ''),
            ) &&
              !softSkills.some((skill) => skill.trim()) && (
                <ProfileRedirectAlert
                  sectionName='Yetenekler'
                  description='Profilde yeteneklerinizi ekleyerek otomatik doldurabilirsiniz.'
                  targetTab='skills'
                />
              )}

            {/* Technical Skills */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-base font-medium'>
                  Teknik Yetenekler * <span className='text-xs text-muted-foreground'>(En az 1 kategori gerekli)</span>
                </Label>
                <Button type='button' variant='outline' size='sm' onClick={() => addSkill('technical')}>
                  <Plus className='h-4 w-4 mr-2' />
                  Kategori Ekle
                </Button>
              </div>

              {technicalSkills.map((_, catIndex) => (
                <div key={catIndex} className='border rounded-lg p-4 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>Kategori {catIndex + 1}</Label>
                    {technicalSkills.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeSkill('technical', catIndex)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label>Kategori Adı *</Label>
                    <Input
                      placeholder='Frontend, Backend, Database vs.'
                      {...register(`skills.technical.${catIndex}.category`)}
                    />
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label>Yetenekler</Label>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const current = getValues(`skills.technical.${catIndex}.items`)
                          setValue(`skills.technical.${catIndex}.items`, [
                            ...current,
                            { name: '', proficiencyLevel: 'Intermediate' as const },
                          ])
                        }}
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        Yetenek Ekle
                      </Button>
                    </div>

                    {watch(`skills.technical.${catIndex}.items`)?.map((_, itemIndex) => (
                      <div key={itemIndex} className='grid grid-cols-2 gap-2'>
                        <Input
                          placeholder='React, TypeScript vs.'
                          {...register(`skills.technical.${catIndex}.items.${itemIndex}.name`)}
                        />
                        <div className='flex gap-2'>
                          <Select
                            value={
                              watch(`skills.technical.${catIndex}.items.${itemIndex}.proficiencyLevel`) ||
                              'Intermediate'
                            }
                            onValueChange={(value) =>
                              setValue(
                                `skills.technical.${catIndex}.items.${itemIndex}.proficiencyLevel`,
                                value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Seviye seçin' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Beginner'>Beginner</SelectItem>
                              <SelectItem value='Intermediate'>Intermediate</SelectItem>
                              <SelectItem value='Advanced'>Advanced</SelectItem>
                              <SelectItem value='Expert'>Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          {(watch(`skills.technical.${catIndex}.items`)?.length || 0) > 1 && (
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const current = getValues(`skills.technical.${catIndex}.items`)
                                setValue(
                                  `skills.technical.${catIndex}.items`,
                                  current.filter((_, i) => i !== itemIndex),
                                )
                              }}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Soft Skills */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-base font-medium'>
                  Kişisel Yetenekler * <span className='text-xs text-muted-foreground'>(En az 1 adet gerekli)</span>
                </Label>
                <Button type='button' variant='outline' size='sm' onClick={() => addSkill('soft')}>
                  <Plus className='h-4 w-4 mr-2' />
                  Ekle
                </Button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {softSkills.map((_, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input placeholder='Takım çalışması, Liderlik, İletişim' {...register(`skills.soft.${index}`)} />
                    {softSkills.length > 1 && (
                      <Button type='button' variant='outline' size='sm' onClick={() => removeSkill('soft', index)}>
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-base font-medium'>Diller</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const current = getValues('skills.languages') || []
                    setValue('skills.languages', [...current, { language: '', proficiency: 'Intermediate' }])
                  }}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Dil Ekle
                </Button>
              </div>

              <div className='flex items-center w-full gap-4'>
                {languages.map((_, index) => (
                  <div key={index} className='flex w-full gap-2'>
                    <Input
                      className='w-full'
                      placeholder='İngilizce, Almanca vs.'
                      {...register(`skills.languages.${index}.language`)}
                    />
                    <Select
                      value={watch(`skills.languages.${index}.proficiency`) || ''}
                      onValueChange={(value) =>
                        setValue(
                          `skills.languages.${index}.proficiency`,
                          value as 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic',
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Seviye seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Native'>Ana Dil (Native)</SelectItem>
                        <SelectItem value='Fluent'>Akıcı (Fluent)</SelectItem>
                        <SelectItem value='Advanced'>İleri (Advanced)</SelectItem>
                        <SelectItem value='Intermediate'>Orta (Intermediate)</SelectItem>
                        <SelectItem value='Basic'>Temel (Basic)</SelectItem>
                      </SelectContent>
                    </Select>
                    {languages.length > 0 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const current = getValues('skills.languages') || []
                          setValue(
                            'skills.languages',
                            current.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>CV Ayarları</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='language'>Dil *</Label>
                <Select
                  value={watch('configuration.language') || 'TURKISH'}
                  onValueChange={(value) => setValue('configuration.language', value as 'TURKISH' | 'ENGLISH')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Dil seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='TURKISH'>Türkçe</SelectItem>
                    <SelectItem value='ENGLISH'>İngilizce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='cvType'>CV Tipi *</Label>
                <Select
                  value={watch('configuration.cvType') || 'ATS_OPTIMIZED'}
                  onValueChange={(value) =>
                    setValue('configuration.cvType', value as 'ATS_OPTIMIZED' | 'TECHNICAL' | 'EXECUTIVE')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='CV tipi seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ATS_OPTIMIZED'>ATS Optimize</SelectItem>
                    <SelectItem value='TECHNICAL'>Teknik</SelectItem>
                    <SelectItem value='EXECUTIVE'>Yönetici</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='templateStyle'>Şablon Stili *</Label>
                <Select
                  value={watch('configuration.templateStyle') || 'PROFESSIONAL'}
                  onValueChange={(value) =>
                    setValue('configuration.templateStyle', value as 'MINIMAL' | 'PROFESSIONAL' | 'MODERN')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Şablon stili seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MINIMAL'>Minimal</SelectItem>
                    <SelectItem value='PROFESSIONAL'>Profesyonel</SelectItem>
                    <SelectItem value='MODERN'>Modern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='targetCompany'>Hedef Şirket (Opsiyonel)</Label>
                <Input
                  id='targetCompany'
                  placeholder='Google, Microsoft vs.'
                  {...register('configuration.targetCompany')}
                />
              </div>
            </div>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='jobDescription'>İş İlanı Açıklaması (Opsiyonel)</Label>
                <Textarea
                  id='jobDescription'
                  placeholder='CV yi optimize etmek için iş ilanı açıklamasını ekleyebilirsiniz...'
                  rows={3}
                  {...register('configuration.jobDescription')}
                />
              </div>

              <div className='flex items-center space-x-2'>
                <input type='checkbox' id='useAI' {...register('configuration.useAI')} />
                <Label htmlFor='useAI'>Claude AI ile CV optimize et</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Projeler (Opsiyonel)</CardTitle>
              <Button type='button' variant='outline' size='sm' onClick={addProject}>
                <Plus className='h-4 w-4 mr-2' />
                Proje Ekle
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {projects?.map((_, index) => (
              <div key={index} className='border rounded-lg p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>Proje {index + 1}</h4>
                  {projects.length > 1 && (
                    <Button type='button' variant='ghost' size='sm' onClick={() => removeProject(index)}>
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Proje Adı *</Label>
                    <Input placeholder='E-ticaret Web Sitesi' {...register(`projects.${index}.name`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Proje URL&apos;i</Label>
                    <Input placeholder='https://github.com/username/project' {...register(`projects.${index}.url`)} />
                  </div>
                  <div className='space-y-2 md:col-span-2'>
                    <Label>Açıklama *</Label>
                    <Input
                      placeholder='React ve Node.js kullanarak geliştirilen modern e-ticaret platformu'
                      {...register(`projects.${index}.description`)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Başlangıç Tarihi *</Label>
                    <MonthYearPicker
                      value={watch(`projects.${index}.startDate`) || ''}
                      onChange={(value) => setValue(`projects.${index}.startDate`, value || '')}
                      placeholder='Başlangıç tarihi seçin'
                      clearable={false}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Bitiş Tarihi</Label>
                    <MonthYearPicker
                      value={watch(`projects.${index}.endDate`) || ''}
                      onChange={(value) => setValue(`projects.${index}.endDate`, value || '')}
                      placeholder='Bitiş tarihi seçin'
                      clearable={true}
                    />
                  </div>
                  <div className='space-y-2 md:col-span-2'>
                    <Label>Kullanılan Teknolojiler</Label>
                    {watch(`projects.${index}.technologies`)?.map((_, techIndex) => (
                      <div key={techIndex} className='flex gap-2'>
                        <Input
                          placeholder='React, TypeScript, Node.js'
                          {...register(`projects.${index}.technologies.${techIndex}`)}
                        />
                        {watch(`projects.${index}.technologies`)!.length > 1 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const current = getValues(`projects.${index}.technologies`)
                              setValue(
                                `projects.${index}.technologies`,
                                current.filter((_, i) => i !== techIndex),
                              )
                            }}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const current = getValues(`projects.${index}.technologies`)
                        setValue(`projects.${index}.technologies`, [...current, ''])
                      }}
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Teknoloji Ekle
                    </Button>
                  </div>
                  <div className='space-y-2 md:col-span-2'>
                    <Label>Başarılar ve Sonuçlar</Label>
                    {watch(`projects.${index}.achievements`)?.map((_, achIndex) => (
                      <div key={achIndex} className='flex gap-2'>
                        <Input
                          placeholder='Kullanıcı deneyimini %30 artırdı'
                          {...register(`projects.${index}.achievements.${achIndex}`)}
                        />
                        {watch(`projects.${index}.achievements`)!.length > 1 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const current = getValues(`projects.${index}.achievements`)
                              setValue(
                                `projects.${index}.achievements`,
                                current.filter((_, i) => i !== achIndex),
                              )
                            }}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const current = getValues(`projects.${index}.achievements`)
                        setValue(`projects.${index}.achievements`, [...current, ''])
                      }}
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Başarı Ekle
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Sertifikalar (Opsiyonel)</CardTitle>
              <Button type='button' variant='outline' size='sm' onClick={addCertification}>
                <Plus className='h-4 w-4 mr-2' />
                Sertifika Ekle
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {certifications.map((_, index) => (
              <div key={index} className='border rounded-lg p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>Sertifika {index + 1}</h4>
                  <Button type='button' variant='ghost' size='sm' onClick={() => removeCertification(index)}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Sertifika Adı *</Label>
                    <Input placeholder='AWS Solutions Architect' {...register(`certifications.${index}.name`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Veren Kurum *</Label>
                    <Input
                      placeholder='Amazon Web Services'
                      {...register(`certifications.${index}.issuingOrganization`)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Tarih</Label>
                    <MonthYearPicker
                      value={watch(`certifications.${index}.issueDate`) || ''}
                      onChange={(value) => setValue(`certifications.${index}.issueDate`, value || '')}
                      placeholder='Sertifika tarihi seçin'
                      clearable={true}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Son Kullanma Tarihi</Label>
                    <MonthYearPicker
                      value={watch(`certifications.${index}.expirationDate`) || ''}
                      onChange={(value) => setValue(`certifications.${index}.expirationDate`, value || '')}
                      placeholder='Son kullanma tarihi seçin'
                      clearable={true}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Kimlik Numarası</Label>
                    <Input placeholder='ABC123456' {...register(`certifications.${index}.credentialId`)} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Doğrulama URL&apos;i</Label>
                    <Input
                      placeholder='https://verify.example.com/12345'
                      {...register(`certifications.${index}.verificationUrl`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='h-4 w-4 text-destructive' />
              <p className='text-sm text-destructive'>{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className='flex gap-4'>
          <Button
            type='submit'
            disabled={isGenerating || profileLoading || (profileCompleteCheck?.completionPercentage ?? 0) < 50}
            className='flex-1'
          >
            {isGenerating && <Wand2 className='mr-2 h-4 w-4 animate-spin' />}
            {profileLoading ? 'Profil Yükleniyor...' : isGenerating ? 'ATS CV Oluşturuluyor...' : 'ATS CV Oluştur'}
          </Button>
        </div>

        {profileCompleteCheck && profileCompleteCheck.completionPercentage < 50 && (
          <div className='bg-muted/50 border border-muted rounded-lg p-4'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='h-4 w-4 text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>
                ATS CV oluşturmak için profilinizi tamamlamanız gerekmektedir. Lütfen eksik bilgileri doldurun.
              </p>
            </div>
          </div>
        )}
      </form>

      {/* Generated Content */}
      {generatedContent && (
        <>
          <div className='border-t border-border mt-8' />
          <Card className='mt-6'>
            <CardContent className='pt-6'>
              <ContentViewer
                content={generatedContent}
                title='ATS Uyumlu CV'
                type='cv'
                metadata={{
                  createdAt: new Date().toISOString(),
                  wordCount: generatedContent.split(' ').length,
                  characterCount: generatedContent.length,
                  estimatedReadTime: Math.ceil(generatedContent.split(' ').length / 200),
                }}
                onSave={async ({ title, content }) => {
                  console.log('Save ATS CV:', { title, content })
                }}
                onDownload={async (format) => {
                  console.log('Download ATS CV as:', format)
                }}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
