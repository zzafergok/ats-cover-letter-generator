/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BarChart3, CheckCircle, XCircle, AlertCircle, Target, TrendingUp, Award, Info } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Progress } from '@/components/core/progress'
import { Badge } from '@/components/core/badge'
import { MonthYearPicker } from '@/components/core/month-year-picker'
import { atsValidationApi } from '@/lib/api/api'
import { ATSValidationData } from '@/types/api.types'
import { useUserProfileStore } from '@/store/userProfileStore'

const validationSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, 'Ad soyad gereklidir'),
    email: z.string().email('Geçerli email gereklidir'),
    phone: z.string().min(10, 'Telefon numarası gereklidir'),
    location: z.string().optional(),
  }),
  professionalSummary: z.string().min(50, 'Profesyonel özet en az 50 karakter olmalıdır'),
  workExperience: z
    .array(
      z.object({
        title: z.string().min(2, 'İş unvanı gereklidir'),
        company: z.string().min(2, 'Şirket adı gereklidir'),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        achievements: z.array(z.string()).min(1, 'En az bir başarı gereklidir'),
      }),
    )
    .min(1, 'En az bir iş deneyimi gereklidir'),
  education: z
    .array(
      z.object({
        degree: z.string().min(2, 'Derece gereklidir'),
        field: z.string().min(2, 'Bölüm gereklidir'),
        school: z.string().min(2, 'Okul adı gereklidir'),
      }),
    )
    .min(1, 'En az bir eğitim gereklidir'),
  skills: z.object({
    technical: z.array(z.string()).min(1, 'En az bir teknik yetenek gereklidir'),
    soft: z.array(z.string()).min(1, 'En az bir kişisel yetenek gereklidir'),
  }),
  jobDescription: z.string().min(100, 'İş tanımı en az 100 karakter olmalıdır'),
})

type ValidationFormData = z.infer<typeof validationSchema>

interface ValidationResult {
  overallScore: number
  sectionScores: {
    formatting: number
    keywords: number
    structure: number
    content: number
  }
  recommendations: Array<{
    section: string
    issue: string
    suggestion: string
    priority: string
  }>
  matchedKeywords: string[]
  missingKeywords: string[]
}

export function ATSValidation() {
  const { profile, getProfile } = useUserProfileStore()
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
      },
      professionalSummary: '',
      workExperience: [
        {
          title: '',
          company: '',
          startDate: '',
          achievements: [''],
        },
      ],
      education: [
        {
          degree: '',
          field: '',
          school: '',
        },
      ],
      skills: {
        technical: [''],
        soft: [''],
      },
      jobDescription: '',
    },
  })

  // Load profile data and auto-fill if available
  useEffect(() => {
    const loadProfile = async () => {
      if (!profile) {
        await getProfile()
      }
    }
    loadProfile()
  }, [profile, getProfile])

  useEffect(() => {
    if (profile) {
      const fullName =
        profile.firstName && profile.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile.firstName || profile.lastName || ''

      if (fullName) setValue('personalInfo.fullName', fullName)
      if (profile.email) setValue('personalInfo.email', profile.email)
      if (profile.phone) setValue('personalInfo.phone', profile.phone)
      if (profile.city) setValue('personalInfo.location', profile.city)
      if (profile.aboutMe) setValue('professionalSummary', profile.aboutMe)

      // Fill work experience if available
      if (profile.experiences && profile.experiences.length > 0) {
        const firstExp = profile.experiences[0]
        setValue('workExperience.0.title', firstExp.position)
        setValue('workExperience.0.company', firstExp.companyName)
        const startDate = `${firstExp.startYear}-${firstExp.startMonth?.toString().padStart(2, '0') || '01'}`
        setValue('workExperience.0.startDate', startDate)
        if (firstExp.achievements || firstExp.description) {
          setValue('workExperience.0.achievements.0', firstExp.achievements || firstExp.description || '')
        }
      }

      // Fill education if available
      if (profile.educations && profile.educations.length > 0) {
        const firstEdu = profile.educations[0]
        setValue('education.0.degree', firstEdu.degree || '')
        setValue('education.0.field', firstEdu.fieldOfStudy || '')
        setValue('education.0.school', firstEdu.schoolName)
      }

      // Fill skills if available
      if (profile.skills && profile.skills.length > 0) {
        const technicalSkills = profile.skills
          .filter(
            (skill) => skill.category === 'TECHNICAL' || skill.category === 'TOOL' || skill.category === 'FRAMEWORK',
          )
          .map((skill) => skill.name)
          .join(', ')

        const softSkills = profile.skills
          .filter((skill) => skill.category === 'SOFT_SKILL' || skill.category === 'OTHER')
          .map((skill) => skill.name)
          .join(', ')

        if (technicalSkills) setValue('skills.technical.0', technicalSkills)
        if (softSkills) setValue('skills.soft.0', softSkills)
      }
    }
  }, [profile, setValue])

  const onSubmit = async (data: ValidationFormData) => {
    try {
      setIsValidating(true)
      setError(null)

      const validationData: ATSValidationData = {
        cvData: {
          personalInfo: data.personalInfo,
          professionalSummary: data.professionalSummary,
          workExperience: data.workExperience,
          education: data.education,
          skills: data.skills,
        },
        jobDescription: data.jobDescription,
      }

      const response = await atsValidationApi.validate(validationData)

      if (response.success) {
        setValidationResult(response.data)
      }
    } catch (err) {
      setError('ATS analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('ATS validation error:', err)
    } finally {
      setIsValidating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Mükemmel'
    if (score >= 60) return 'İyi'
    if (score >= 40) return 'Orta'
    return 'Düşük'
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'yüksek':
        return <XCircle className='h-4 w-4 text-red-500' />
      case 'medium':
      case 'orta':
        return <AlertCircle className='h-4 w-4 text-yellow-500' />
      case 'low':
      case 'düşük':
        return <Info className='h-4 w-4 text-blue-500' />
      default:
        return <Info className='h-4 w-4 text-gray-500' />
    }
  }

  return (
    <div className='space-y-6'>
      {!validationResult && (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='fullName'>Ad Soyad *</Label>
                  <Input id='fullName' placeholder='Ahmet Yılmaz' {...register('personalInfo.fullName')} />
                  {errors.personalInfo?.fullName && (
                    <p className='text-sm text-destructive'>{errors.personalInfo.fullName.message}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>E-posta *</Label>
                  <Input id='email' type='email' placeholder='ahmet@example.com' {...register('personalInfo.email')} />
                  {errors.personalInfo?.email && (
                    <p className='text-sm text-destructive'>{errors.personalInfo.email.message}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Telefon *</Label>
                  <Input id='phone' placeholder='+90 555 123 45 67' {...register('personalInfo.phone')} />
                  {errors.personalInfo?.phone && (
                    <p className='text-sm text-destructive'>{errors.personalInfo.phone.message}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='location'>Konum</Label>
                  <Input id='location' placeholder='İstanbul, Türkiye' {...register('personalInfo.location')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profesyonel Özet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <Label htmlFor='professionalSummary'>Profesyonel Özet *</Label>
                <Textarea
                  id='professionalSummary'
                  placeholder='Deneyimli frontend developer olarak React, TypeScript ve modern web teknolojilerinde uzmanım...'
                  rows={4}
                  {...register('professionalSummary')}
                />
                <p className='text-xs text-muted-foreground'>{watch('professionalSummary')?.length || 0} karakter</p>
                {errors.professionalSummary && (
                  <p className='text-sm text-destructive'>{errors.professionalSummary.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Simplified Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle>İş Deneyimi (Özet)</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label>Son Pozisyon *</Label>
                  <Input placeholder='Frontend Developer' {...register('workExperience.0.title')} />
                </div>
                <div className='space-y-2'>
                  <Label>Son Şirket *</Label>
                  <Input placeholder='ABC Teknoloji' {...register('workExperience.0.company')} />
                </div>
              </div>
              <div className='space-y-2'>
                <Label>Başlangıç Tarihi *</Label>
                <MonthYearPicker
                  placeholder='Başlangıç tarihi seçin'
                  value={watch('workExperience.0.startDate') || ''}
                  onChange={(value) => setValue('workExperience.0.startDate', value || '')}
                  error={!!errors.workExperience?.[0]?.startDate}
                />
                {errors.workExperience?.[0]?.startDate && (
                  <p className='text-sm text-destructive'>{errors.workExperience[0].startDate.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label>Ana Başarılar *</Label>
                <Textarea
                  placeholder='React ve TypeScript ile 5 farklı proje geliştirdim...'
                  {...register('workExperience.0.achievements.0')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Eğitim</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label>Derece *</Label>
                  <Input placeholder='Lisans' {...register('education.0.degree')} />
                </div>
                <div className='space-y-2'>
                  <Label>Bölüm *</Label>
                  <Input placeholder='Bilgisayar Mühendisliği' {...register('education.0.field')} />
                </div>
                <div className='space-y-2'>
                  <Label>Okul *</Label>
                  <Input placeholder='İstanbul Teknik Üniversitesi' {...register('education.0.school')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Yetenekler</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>Teknik Yetenekler *</Label>
                <Input
                  placeholder='React, TypeScript, Node.js, AWS (virgülle ayırın)'
                  {...register('skills.technical.0')}
                />
              </div>
              <div className='space-y-2'>
                <Label>Kişisel Yetenekler *</Label>
                <Input
                  placeholder='Takım çalışması, Liderlik, İletişim (virgülle ayırın)'
                  {...register('skills.soft.0')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Target className='h-5 w-5' />
                İş İlanı
              </CardTitle>
              <CardDescription>CV'nizi hangi iş ilanına göre analiz etmek istiyorsunuz?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <Label htmlFor='jobDescription'>İş Tanımı *</Label>
                <Textarea
                  id='jobDescription'
                  placeholder='İş ilanından tüm metni kopyalayıp buraya yapıştırın...'
                  rows={6}
                  {...register('jobDescription')}
                />
                <p className='text-xs text-muted-foreground'>{watch('jobDescription')?.length || 0} karakter</p>
                {errors.jobDescription && <p className='text-sm text-destructive'>{errors.jobDescription.message}</p>}
              </div>
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
          <Button type='submit' disabled={isValidating} className='w-full'>
            {isValidating && <BarChart3 className='mr-2 h-4 w-4 animate-spin' />}
            {isValidating ? 'ATS Analizi Yapılıyor...' : 'ATS Analizi Başlat'}
          </Button>
        </form>
      )}

      {/* Validation Results */}
      {validationResult && (
        <div className='space-y-6'>
          {/* Header with action */}
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>ATS Analiz Sonuçları</h2>
            <Button
              variant='outline'
              onClick={() => {
                setValidationResult(null)
                setError(null)
              }}
            >
              Yeni Analiz
            </Button>
          </div>

          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Award className='h-5 w-5' />
                Genel ATS Skoru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center space-y-4'>
                <div className={`text-6xl font-bold ${getScoreColor(validationResult.overallScore)}`}>
                  {validationResult.overallScore}
                </div>
                <div className='text-lg text-muted-foreground'>{getScoreLabel(validationResult.overallScore)}</div>
                <Progress value={validationResult.overallScore} className='w-full h-3' />
              </div>
            </CardContent>
          </Card>

          {/* Section Scores */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Bölüm Skorları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Formatlar</span>
                    <span className={`font-bold ${getScoreColor(validationResult.sectionScores.formatting)}`}>
                      {validationResult.sectionScores.formatting}
                    </span>
                  </div>
                  <Progress value={validationResult.sectionScores.formatting} className='h-2' />
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Anahtar Kelimeler</span>
                    <span className={`font-bold ${getScoreColor(validationResult.sectionScores.keywords)}`}>
                      {validationResult.sectionScores.keywords}
                    </span>
                  </div>
                  <Progress value={validationResult.sectionScores.keywords} className='h-2' />
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Yapı</span>
                    <span className={`font-bold ${getScoreColor(validationResult.sectionScores.structure)}`}>
                      {validationResult.sectionScores.structure}
                    </span>
                  </div>
                  <Progress value={validationResult.sectionScores.structure} className='h-2' />
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>İçerik</span>
                    <span className={`font-bold ${getScoreColor(validationResult.sectionScores.content)}`}>
                      {validationResult.sectionScores.content}
                    </span>
                  </div>
                  <Progress value={validationResult.sectionScores.content} className='h-2' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords Analysis */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                  Eşleşen Anahtar Kelimeler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {validationResult.matchedKeywords.map((keyword, index) => (
                    <Badge key={index} variant='default' className='bg-green-100 text-green-800'>
                      {keyword}
                    </Badge>
                  ))}
                  {validationResult.matchedKeywords.length === 0 && (
                    <p className='text-muted-foreground text-sm'>Eşleşen anahtar kelime bulunamadı</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <XCircle className='h-5 w-5 text-red-600' />
                  Eksik Anahtar Kelimeler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {validationResult.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant='destructive' className='bg-red-100 text-red-800'>
                      {keyword}
                    </Badge>
                  ))}
                  {validationResult.missingKeywords.length === 0 && (
                    <p className='text-muted-foreground text-sm'>Tüm önemli anahtar kelimeler mevcut</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5' />
                İyileştirme Önerileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {validationResult.recommendations.map((rec, index) => (
                  <div key={index} className='border rounded-lg p-4'>
                    <div className='flex items-start gap-3'>
                      {getPriorityIcon(rec.priority)}
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Badge variant='outline'>{rec.section}</Badge>
                          <Badge
                            variant={
                              rec.priority.toLowerCase() === 'high' || rec.priority.toLowerCase() === 'yüksek'
                                ? 'destructive'
                                : rec.priority.toLowerCase() === 'medium' || rec.priority.toLowerCase() === 'orta'
                                  ? 'default'
                                  : 'secondary'
                            }
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <h4 className='font-medium mb-1'>{rec.issue}</h4>
                        <p className='text-sm text-muted-foreground'>{rec.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {validationResult.recommendations.length === 0 && (
                  <p className='text-center text-muted-foreground py-8'>
                    🎉 Harika! CV'niz ATS sistemler için optimize edilmiş görünüyor.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
