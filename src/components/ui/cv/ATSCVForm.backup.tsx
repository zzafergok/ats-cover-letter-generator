'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle, Clock, Wand2, FileText, Sparkles, Bot, Zap, Target, Database } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Badge } from '@/components/core/badge'
import { Switch } from '@/components/core/switch'
import { Textarea } from '@/components/core/textarea'
import { Label } from '@/components/core/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Input } from '@/components/core/input'
import { PersonalInfoSection } from '@/components/ui/cv/sections/PersonalInfoSection'
import { ProfessionalSummarySection } from '@/components/ui/cv/sections/ProfessionalSummarySection'
import { WorkExperienceSection } from '@/components/ui/cv/sections/WorkExperienceSection'
import { EducationSection } from '@/components/ui/cv/sections/EducationSection'
import { SkillsSection } from '@/components/ui/cv/sections/SkillsSection'
import { ProfileRedirectAlert } from '@/components/ui/cv/ProfileRedirectAlert'
import { useUserProfileStore } from '@/store/userProfileStore'
import { atsFormSchema, ATSFormData } from '@/types/form.types'

export function ATSCVForm() {
  const { profile, isLoading: profileLoading, getProfile } = useUserProfileStore()
  const [generatedCV, setGeneratedCV] = useState<{
    template: string
    downloadedAt: string
    fileName: string
    success: boolean
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  // const [isDownloading, setIsDownloading] = useState(false) // Disabled for now
  const [error, setError] = useState<string | null>(null)

  // Microsoft Templates
  const [microsoftTemplates, setMicrosoftTemplates] = useState<
    Array<{
      id: string
      name: string
      category: string
      language: string
      atsScore: number
      sections: string[]
      description?: string
      targetRoles?: string[]
      experienceLevel?: string
    }>
  >([])
  const [selectedMicrosoftTemplate, setSelectedMicrosoftTemplate] = useState<string>('')
  const [isLoadingMicrosoftTemplates, setIsLoadingMicrosoftTemplates] = useState(false)

  // Job Analysis
  const [jobAnalysis, setJobAnalysis] = useState<{
    jobAnalysis: {
      position: string
      language: string
      keywords: string[]
      requirements: string[]
      experienceLevel: string
      technicalSkills: string[]
      softSkills: string[]
    }
    recommendedTemplates: Array<{
      id: string
      name: string
      category: string
      atsScore: number
      matchReason: string
      sections: string[]
      targetIndustries: string[]
    }>
    optimization: {
      suggestedKeywords: string[]
      cvSections: string[]
      atsStrategies: string[]
    }
  } | null>(null)
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false)

  // AI Settings
  const [useAI, setUseAI] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<'AUTO' | 'TURKISH' | 'ENGLISH'>('AUTO')
  const [selectedIndustryType, setSelectedIndustryType] = useState('')
  const [targetPositionForAnalysis, setTargetPositionForAnalysis] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
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

  // Microsoft Templates yükle
  useEffect(() => {
    const fetchMicrosoftTemplates = async () => {
      setIsLoadingMicrosoftTemplates(true)
      try {
        // const response = await atsCvMicrosoftApi.getTemplates()
        // if (response.success) {
        //   setMicrosoftTemplates(response.data.templates)
        //   // İlk template'i varsayılan olarak seç
        //   if (response.data.templates.length > 0) {
        //     setSelectedMicrosoftTemplate(response.data.templates[0].id)
        //   }
        // }
      } catch (err) {
        console.error('Microsoft Templates yüklenirken hata:', err)
        setError("Microsoft ATS template'leri yüklenirken hata oluştu")
      } finally {
        setIsLoadingMicrosoftTemplates(false)
      }
    }

    fetchMicrosoftTemplates()
  }, [])

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

  // İş tanımı analizi
  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) return

    // targetPosition'ı AI section'ından al
    if (!targetPositionForAnalysis.trim()) {
      setError('İş analizi için hedef pozisyon bilgisi gereklidir. Lütfen hedef pozisyonu belirtin.')
      return
    }

    setIsAnalyzingJob(true)
    try {
      // // İş tanımının dilini otomatik tespit et
      // const isEnglish =
      //   /[a-zA-Z]/.test(jobDescription) &&
      //   jobDescription
      //     .split(' ')
      //     .some((word) =>
      //       ['the', 'and', 'or', 'you', 'will', 'have', 'experience', 'with', 'skills', 'requirements'].includes(
      //         word.toLowerCase(),
      //       ),
      //     )
      // const response = await atsCvMicrosoftApi.analyzeJob({
      //   jobDescription,
      //   targetPosition: targetPositionForAnalysis.trim(),
      //   language: selectedLanguage === 'AUTO' ? (isEnglish ? 'ENGLISH' : 'TURKISH') : selectedLanguage,
      //   industryType: selectedIndustryType.trim() || undefined, // Opsiyonal
      // })
      // if (response.success) {
      //   setJobAnalysis(response.data)
      //   // Önerilen template'i seç (ilk template'i seç)
      //   if (response.data.recommendedTemplates?.length > 0) {
      //     setSelectedMicrosoftTemplate(response.data.recommendedTemplates[0].id)
      //   }
      // }
    } catch (err) {
      console.error('İş tanımı analiz hatası:', err)
      setError('İş tanımı analiz edilirken hata oluştu')
    } finally {
      setIsAnalyzingJob(false)
    }
  }

  // CV download fonksiyonu - Şimdilik disabled
  // const handleDownloadCV = async (templateId: string) => {
  //   // Download functionality will be implemented later
  // }

  // Dummy data ile formu doldur
  const fillWithDummyData = () => {
    // Kişisel Bilgiler
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

    // Profesyonel Özet
    setValue(
      'professionalSummary.summary',
      '5+ yıl deneyimli Full Stack Developer. React, Node.js, TypeScript ve AWS ile modern web uygulamaları geliştirme konusunda uzman. Mikroservis mimarileri ve RESTful API tasarımında deneyimli. Problem çözme odaklı, takım çalışmasında güçlü yazılım geliştirici.',
    )
    setValue('professionalSummary.targetPosition', 'Senior Full Stack Developer')
    setValue('professionalSummary.yearsOfExperience', 5)
    setValue('professionalSummary.keySkills', ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'PostgreSQL'])

    // İş Deneyimi
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
          'CI/CD pipeline kurarak deployment süresini %60 kısalttım',
          'Team lead olarak 5 kişilik geliştirici ekibini yönettim',
        ],
        technologies: 'React, Node.js, MongoDB, AWS, Docker, Kubernetes',
        industryType: 'Teknoloji',
      },
      {
        id: '2',
        companyName: 'Digital Agency Pro',
        position: 'Full Stack Developer',
        location: 'İstanbul, Türkiye',
        startDate: '2020-03-01',
        endDate: '2021-12-31',
        isCurrentRole: false,
        achievements: [
          'E-commerce platformu geliştirerek şirkete %25 gelir artışı sağladım',
          'Modern React.js ve TypeScript ile 10+ proje tamamladım',
          'RESTful API tasarımı ve database optimizasyonu gerçekleştirdim',
        ],
        technologies: 'React, Express.js, PostgreSQL, Redis',
        industryType: 'Dijital Pazarlama',
      },
    ])

    // Eğitim
    setValue('education', [
      {
        id: '1',
        institution: 'İstanbul Technical University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Engineering',
        location: 'İstanbul, Türkiye',
        startDate: '2016-09-01',
        endDate: '2020-06-01',
        gpa: 3.7,
        honors: "Magna Cum Laude, Dean's List 2019-2020, Best Graduation Project Award",
        relevantCoursework:
          'Data Structures and Algorithms, Software Engineering, Database Systems, Web Programming, Machine Learning, Computer Networks',
      },
    ])

    // Yetenekler
    setValue('skills.technical', [
      {
        category: 'Programming Languages',
        items: [
          { name: 'JavaScript', proficiencyLevel: 'Expert' },
          { name: 'TypeScript', proficiencyLevel: 'Advanced' },
          { name: 'Python', proficiencyLevel: 'Intermediate' },
          { name: 'Java', proficiencyLevel: 'Intermediate' },
        ],
      },
      {
        category: 'Frontend Technologies',
        items: [
          { name: 'React', proficiencyLevel: 'Expert' },
          { name: 'Next.js', proficiencyLevel: 'Advanced' },
          { name: 'Vue.js', proficiencyLevel: 'Intermediate' },
          { name: 'HTML/CSS', proficiencyLevel: 'Expert' },
        ],
      },
      {
        category: 'Backend Technologies',
        items: [
          { name: 'Node.js', proficiencyLevel: 'Expert' },
          { name: 'Express.js', proficiencyLevel: 'Advanced' },
          { name: 'MongoDB', proficiencyLevel: 'Advanced' },
          { name: 'PostgreSQL', proficiencyLevel: 'Advanced' },
        ],
      },
      {
        category: 'Cloud & DevOps',
        items: [
          { name: 'AWS', proficiencyLevel: 'Advanced' },
          { name: 'Docker', proficiencyLevel: 'Advanced' },
          { name: 'Kubernetes', proficiencyLevel: 'Intermediate' },
          { name: 'CI/CD', proficiencyLevel: 'Advanced' },
        ],
      },
    ])

    setValue('skills.languages', [
      { language: 'Turkish', proficiency: 'Native' },
      { language: 'English', proficiency: 'Advanced' },
    ])

    setValue('skills.soft', ['Team Leadership', 'Problem Solving', 'Communication', 'Project Management', 'Mentoring'])

    // Sertifikalar
    setValue('certifications', [
      {
        id: '1',
        name: 'AWS Certified Solutions Architect',
        issuingOrganization: 'Amazon Web Services',
        issueDate: '2023-05-15',
        expirationDate: '2026-05-15',
        credentialId: 'AWS-SAA-123456',
        verificationUrl: 'https://aws.amazon.com/verification',
      },
      {
        id: '2',
        name: 'MongoDB Certified Developer',
        issuingOrganization: 'MongoDB University',
        issueDate: '2022-11-20',
        credentialId: 'MONGO-DEV-789',
        verificationUrl: 'https://university.mongodb.com/certification',
      },
    ])

    // Projeler
    setValue('projects', [
      {
        id: '1',
        name: 'E-Commerce Microservices Platform',
        description:
          'Yüksek trafikli e-commerce uygulaması için mikroservis mimarisi. Docker ve Kubernetes ile containerize edilmiş, AWS üzerinde deploy edilmiş.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Kubernetes'],
        startDate: '2023-01-01',
        endDate: '2023-08-01',
        url: 'https://github.com/ahmet-yilmaz/ecommerce-microservices',
        achievements: [
          '100K+ concurrent user desteği',
          '%99.9 uptime sağladı',
          'Auto-scaling ile cost optimization %30 azaltma',
        ],
      },
      {
        id: '2',
        name: 'Real-time Chat Application',
        description:
          'WebSocket tabanlı gerçek zamanlı chat uygulaması. React frontend, Node.js backend ve Socket.io ile geliştirildi.',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
        startDate: '2022-06-01',
        endDate: '2022-09-01',
        url: 'https://github.com/ahmet-yilmaz/realtime-chat',
        achievements: ['1000+ simultaneous connections', 'End-to-end encryption', 'Mobile responsive design'],
      },
    ])

    // Konfigürasyon
    setValue('configuration.language', 'TURKISH')
    setValue('configuration.cvType', 'ATS_OPTIMIZED')
    setValue('configuration.templateStyle', 'PROFESSIONAL')
    setValue('configuration.useAI', false)
    setValue('configuration.targetCompany', 'Microsoft Turkey')
    setValue(
      'configuration.jobDescription',
      'Aranan senior full stack developer pozisyonu için React, Node.js, TypeScript deneyimi gerekli. AWS cloud services bilgisi artı. Mikroservis mimarisi deneyimi olan, team lead yapabilecek, problem solving becerileri güçlü adaylar aranıyor.',
    )

    // AI ayarları için hedef pozisyon ve iş tanımı da dolduralım
    setTargetPositionForAnalysis('Senior Full Stack Developer')
    setSelectedIndustryType('Teknoloji')
    setJobDescription(
      'Aranan senior full stack developer pozisyonu için React, Node.js, TypeScript deneyimi gerekli. AWS cloud services bilgisi artı. Mikroservis mimarisi deneyimi olan, team lead yapabilecek, problem solving becerileri güçlü adaylar aranıyor. 5+ yıl deneyim, modern web teknolojileri, cloud services, DevOps bilgisi. Takım liderliği, mentorluk deneyimi olan adaylar tercih edilir.',
    )
  }

  const onSubmit = async (data: ATSFormData) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    setIsGenerating(true)
    setError(null)

    try {
      // // Microsoft ATS API formatına dönüştür - tam detaylı parametreler
      // const microsoftData = {
      //   personalInfo: {
      //     firstName: data.personalInfo.firstName,
      //     lastName: data.personalInfo.lastName,
      //     email: data.personalInfo.email,
      //     phone: data.personalInfo.phone,
      //     address: {
      //       city: data.personalInfo.address.city,
      //       country: data.personalInfo.address.country,
      //     },
      //     linkedIn: data.personalInfo.linkedIn || undefined,
      //     github: data.personalInfo.github || undefined,
      //     portfolio: data.personalInfo.portfolio || undefined,
      //   },
      //   professionalSummary: {
      //     summary: data.professionalSummary.summary,
      //     targetPosition: data.professionalSummary.targetPosition,
      //     yearsOfExperience: data.professionalSummary.yearsOfExperience,
      //     keySkills: data.professionalSummary.keySkills.filter((skill) => skill.trim()),
      //   },
      //   workExperience: data.workExperience
      //     .filter((exp) => exp.companyName && exp.position)
      //     .map((exp) => ({
      //       id: exp.id || crypto.randomUUID(),
      //       companyName: exp.companyName,
      //       position: exp.position,
      //       location: exp.location,
      //       startDate: exp.startDate,
      //       endDate: exp.isCurrentRole ? undefined : exp.endDate,
      //       isCurrentRole: exp.isCurrentRole,
      //       achievements: exp.achievements.filter((achievement) => achievement.trim()),
      //     })),
      //   education: data.education
      //     .filter((edu) => edu.institution && edu.degree)
      //     .map((edu) => ({
      //       id: edu.id || crypto.randomUUID(),
      //       institution: edu.institution,
      //       degree: edu.degree,
      //       fieldOfStudy: edu.fieldOfStudy,
      //       location: edu.location,
      //       startDate: edu.startDate,
      //       endDate: edu.endDate,
      //     })),
      //   skills: {
      //     technical: data.skills.technical
      //       .filter((techGroup) => techGroup.category && techGroup.items.some((item) => item.name.trim()))
      //       .map((techGroup) => ({
      //         category: techGroup.category,
      //         items: techGroup.items
      //           .filter((item) => item.name.trim())
      //           .map((item) => ({
      //             name: item.name,
      //             proficiencyLevel: item.proficiencyLevel,
      //           })),
      //       })),
      //     languages: (data.skills.languages || [])
      //       .filter((lang) => lang.language.trim())
      //       .map((lang) => ({
      //         language: lang.language,
      //         proficiency: lang.proficiency,
      //       })),
      //     soft: data.skills.soft.filter((skill) => skill.trim()),
      //   },
      //   certifications: (data.certifications || []).map((cert) => ({
      //     id: cert.id || crypto.randomUUID(),
      //     name: cert.name,
      //     issuingOrganization: cert.issuingOrganization,
      //     issueDate: cert.issueDate || '',
      //     expirationDate: cert.expirationDate,
      //     credentialId: cert.credentialId,
      //     verificationUrl: cert.verificationUrl,
      //   })),
      //   projects: (data.projects || []).map((project) => ({
      //     id: project.id || crypto.randomUUID(),
      //     name: project.name,
      //     description: project.description,
      //     technologies: project.technologies,
      //     startDate: project.startDate,
      //     endDate: project.endDate,
      //     url: project.url,
      //     achievements: project.achievements,
      //   })),
      //   configuration: {
      //     language: data.configuration.language,
      //     microsoftTemplateId: selectedMicrosoftTemplate,
      //     useAIOptimization: useAI,
      //     jobDescription: useAI ? jobDescription : undefined,
      //     targetCompany: data.configuration.targetCompany || undefined,
      //   },
      // }
      // // Microsoft ATS API'den PDF blob'u al
      // const pdfBlob = await atsCvMicrosoftApi.generate(microsoftData)
      // // PDF'i otomatik indir
      // const fileName = `${data.personalInfo.firstName}_${data.personalInfo.lastName}_${selectedMicrosoftTemplate}_CV.pdf`
      // const url = window.URL.createObjectURL(pdfBlob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = fileName
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
      // window.URL.revokeObjectURL(url)
      // // Başarı durumunu işaretle
      // setGeneratedCV({
      //   template: selectedMicrosoftTemplate,
      //   downloadedAt: new Date().toISOString(),
      //   fileName: fileName,
      //   success: true,
      // })
      // console.log('Microsoft ATS CV başarıyla oluşturuldu ve indirildi:', fileName)
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

        {/* Microsoft ATS Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Microsoft ATS Template Seçimi
              <Badge variant='default' className='ml-2 bg-gradient-to-r from-blue-500 to-green-500'>
                <Sparkles className='h-3 w-3 mr-1' />
                Yeni
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                Microsoft'un resmi ATS template'lerini kullanarak yüksek geçiş oranına sahip CV'ler oluşturun.
              </p>
              {isLoadingMicrosoftTemplates ? (
                <div className='flex items-center justify-center p-8'>
                  <Clock className='h-4 w-4 animate-spin mr-2' />
                  <span className='text-sm text-muted-foreground'>Microsoft Template'lar yükleniyor...</span>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {microsoftTemplates.map((template) => (
                    <button
                      key={template.id}
                      type='button'
                      onClick={() => setSelectedMicrosoftTemplate(template.id)}
                      className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                        selectedMicrosoftTemplate === template.id
                          ? 'border-primary bg-primary/5 text-primary shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className='font-medium'>{template.name}</div>
                      <div className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                        {template.description || 'Microsoft ATS uyumlu profesyonel şablon'}
                      </div>
                      <div className='flex items-center gap-2 mt-3'>
                        <Badge variant='outline' className='text-xs'>
                          {template.category}
                        </Badge>
                        <Badge variant='secondary' className='text-xs bg-green-100 text-green-700'>
                          ATS {template.atsScore}%
                        </Badge>
                        {template.language === 'turkish' && (
                          <Badge variant='secondary' className='text-xs'>
                            🇹🇷 Türkçe
                          </Badge>
                        )}
                        {template.language === 'english' && (
                          <Badge variant='secondary' className='text-xs'>
                            🇺🇸 English
                          </Badge>
                        )}
                      </div>
                      {template.experienceLevel && (
                        <div className='text-xs text-muted-foreground mt-2'>
                          <Target className='h-3 w-3 inline mr-1' />
                          {template.experienceLevel} seviye
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Bot className='h-5 w-5' />
              Claude AI ile Akıllı Optimizasyon
              <Badge variant='default' className='ml-2 bg-gradient-to-r from-purple-500 to-blue-500'>
                <Sparkles className='h-3 w-3 mr-1' />
                AI
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='ai-toggle' className='text-sm font-medium'>
                    AI Optimizasyonunu Etkinleştir
                  </Label>
                  <p className='text-xs text-muted-foreground mt-1'>
                    İş tanımına göre CV'nizi optimize eder ve Microsoft ATS sistemlerine uyumluluğunu artırır
                  </p>
                </div>
                <Switch id='ai-toggle' checked={useAI} onCheckedChange={setUseAI} />
              </div>

              {useAI && (
                <div className='space-y-4 p-4 bg-muted/30 rounded-lg border'>
                  {/* Target Position Input */}
                  <div className='space-y-2'>
                    <Label htmlFor='target-position-analysis' className='text-sm font-medium'>
                      Hedef Pozisyon <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='target-position-analysis'
                      placeholder='ör: Senior Full Stack Developer, Data Scientist, Product Manager...'
                      value={targetPositionForAnalysis}
                      onChange={(e) => setTargetPositionForAnalysis(e.target.value)}
                      maxLength={100}
                    />
                    <p className='text-xs text-muted-foreground'>
                      AI'nın analiz edeceği iş pozisyonu. İş ilanındaki başlık ile aynı olması önerilir.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='job-description' className='text-sm font-medium'>
                      İş Tanımı <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea
                      id='job-description'
                      placeholder="İş tanımını buraya yapıştırın. AI bu bilgilere göre CV'nizi Microsoft ATS sistemlerine optimize edecek..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={4}
                      maxLength={2000}
                    />
                    <div className='flex items-center justify-between'>
                      <div className='text-xs text-muted-foreground'>
                        {jobDescription.length}/2000 karakter
                        {!targetPositionForAnalysis.trim() && (
                          <span className='block text-orange-600 mt-1'>
                            ⚠️ İş analizi için hedef pozisyon belirtmelisiniz
                          </span>
                        )}
                      </div>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={handleAnalyzeJob}
                        disabled={!jobDescription.trim() || isAnalyzingJob || !targetPositionForAnalysis.trim()}
                      >
                        {isAnalyzingJob ? (
                          <>
                            <Clock className='h-3 w-3 mr-1 animate-spin' />
                            Analiz Ediliyor...
                          </>
                        ) : (
                          <>
                            <Zap className='h-3 w-3 mr-1' />
                            İş İlanını Analiz Et
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Additional Analysis Parameters */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Language Selection */}
                    <div className='space-y-2'>
                      <Label htmlFor='language-select' className='text-sm font-medium'>
                        İş İlanı Dili
                      </Label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={(value: 'AUTO' | 'TURKISH' | 'ENGLISH') => setSelectedLanguage(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Dil seçin' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='AUTO'>🤖 Otomatik Tespit</SelectItem>
                          <SelectItem value='TURKISH'>🇹🇷 Türkçe</SelectItem>
                          <SelectItem value='ENGLISH'>🇺🇸 English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Industry Type */}
                    <div className='space-y-2'>
                      <Label htmlFor='industry-input' className='text-sm font-medium'>
                        Sektör <span className='text-muted-foreground'>(Opsiyonel)</span>
                      </Label>
                      <Input
                        id='industry-input'
                        placeholder='ör: Teknoloji, Finans, Sağlık...'
                        value={selectedIndustryType}
                        onChange={(e) => setSelectedIndustryType(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {jobAnalysis && (
                    <div className='space-y-4'>
                      {/* Analysis Results */}
                      <div className='p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700'>
                        <h4 className='font-medium text-sm mb-2 text-green-800 dark:text-green-200'>
                          İş İlanı Analiz Sonuçları
                        </h4>
                        <div className='space-y-2 text-xs'>
                          <div>
                            <span className='font-medium text-green-700 dark:text-green-300'>Pozisyon:</span>{' '}
                            <span className='text-foreground'>{jobAnalysis.jobAnalysis.position}</span>
                          </div>
                          <div>
                            <span className='font-medium text-green-700 dark:text-green-300'>Deneyim Seviyesi:</span>{' '}
                            <span className='text-foreground'>{jobAnalysis.jobAnalysis.experienceLevel}</span>
                          </div>
                          <div>
                            <span className='font-medium text-green-700 dark:text-green-300'>Dil:</span>{' '}
                            <span className='text-foreground'>{jobAnalysis.jobAnalysis.language}</span>
                          </div>
                          <div>
                            <span className='font-medium text-green-700 dark:text-green-300'>Anahtar Kelimeler:</span>{' '}
                            <span className='text-foreground'>
                              {jobAnalysis.jobAnalysis.keywords?.slice(0, 5).join(', ') || 'Bulunamadı'}
                              {jobAnalysis.jobAnalysis.keywords?.length > 5 && '...'}
                            </span>
                          </div>
                          <div>
                            <span className='font-medium text-green-700 dark:text-green-300'>Teknik Beceriler:</span>{' '}
                            <span className='text-foreground'>
                              {jobAnalysis.jobAnalysis.technicalSkills?.slice(0, 5).join(', ') || 'Bulunamadı'}
                              {jobAnalysis.jobAnalysis.technicalSkills?.length > 5 && '...'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Templates */}
                      {jobAnalysis.recommendedTemplates?.length > 0 && (
                        <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                          <h4 className='font-medium text-sm mb-2 text-blue-800'>Önerilen Şablonlar</h4>
                          <div className='space-y-2'>
                            {jobAnalysis.recommendedTemplates.map((template) => (
                              <div key={template.id} className='text-xs'>
                                <div className='flex items-center justify-between'>
                                  <span className='font-medium text-blue-700'>{template.name}</span>
                                  <Badge variant='secondary' className='text-xs'>
                                    ATS {template.atsScore}%
                                  </Badge>
                                </div>
                                <div className='text-muted-foreground mt-1'>{template.matchReason}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Optimization Tips */}
                      {jobAnalysis.optimization?.atsStrategies?.length > 0 && (
                        <div className='p-3 bg-purple-50 rounded-lg border border-purple-200'>
                          <h4 className='font-medium text-sm mb-2 text-purple-800'>ATS Optimizasyon İpuçları</h4>
                          <ul className='space-y-1 text-xs text-purple-700'>
                            {jobAnalysis.optimization.atsStrategies.slice(0, 3).map((tip, idx) => (
                              <li key={idx} className='flex items-start'>
                                <span className='mr-2'>•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <Alert>
                    <Sparkles className='h-4 w-4' />
                    <AlertDescription className='text-sm'>
                      Claude AI, iş tanımındaki anahtar kelimeleri analiz ederek CV'nizde bu kelimelerin kullanımını
                      optimize edecek ve Microsoft ATS sistemlerinin puanlama kriterlerine uygun hale getirecek.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-6'>
            {/* Dummy Data Button */}
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

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={
                isGenerating ||
                missingProfileFields.length > 0 ||
                !selectedMicrosoftTemplate ||
                (useAI && !jobDescription.trim())
              }
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
                    reset()
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
      )}
    </div>
  )
}
