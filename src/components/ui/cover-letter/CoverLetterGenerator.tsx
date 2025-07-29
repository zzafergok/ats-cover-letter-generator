'use client'

import React, { useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, User, Briefcase, Star, Send, Download, Loader2 } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import {
  coverLetterSchema,
  coverLetterTypes,
  coverLetterTones,
  type CoverLetterFormValues,
  type CoverLetterType,
  type CoverLetterTone,
} from '@/lib/validations'

type CoverLetterFormData = CoverLetterFormValues

// Display name mappings
const coverLetterTypeDisplayNames: Record<CoverLetterType, string> = {
  TECHNICAL: 'Teknik',
  CREATIVE: 'Yaratıcı',
  MANAGEMENT: 'Yönetim',
  SALES: 'Satış',
}

const coverLetterToneDisplayNames: Record<CoverLetterTone, string> = {
  CONFIDENT: 'Kendine Güvenli',
  PROFESSIONAL: 'Profesyonel',
  ENTHUSIASTIC: 'Hevesli',
  MODEST: 'Alçakgönüllü',
}

interface GeneratedLetterAnalysis {
  wordCount: number
  paragraphCount: number
  keywordDensity: number
  hasPersonalization: boolean
  hasCompanyResearch: boolean
}

interface GeneratedLetter {
  content: string
  analysis: GeneratedLetterAnalysis
}

const CoverLetterGenerator = () => {
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<CoverLetterFormData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        city: '',
        linkedin: '',
      },
      jobInfo: {
        positionTitle: '',
        companyName: '',
        department: '',
        hiringManagerName: '',
        jobDescription: '',
      },
      experience: {
        currentPosition: '',
        yearsOfExperience: '',
        relevantSkills: '',
        achievements: '',
        previousCompanies: '',
      },
      coverLetterType: coverLetterTypes[0],
      tone: coverLetterTones[0],
      additionalInfo: {
        reasonForApplying: '',
        companyKnowledge: '',
        careerGoals: '',
      },
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: CoverLetterFormData) => {
    setIsLoading(true)

    const payload = {
      ...data,
      experience: {
        ...data.experience,
        yearsOfExperience: parseInt(data.experience.yearsOfExperience) || 0,
        relevantSkills: data.experience.relevantSkills.split(',').map((skill) => skill.trim()),
        achievements: data.experience.achievements
          ? data.experience.achievements.split(',').map((achievement) => achievement.trim())
          : [],
        previousCompanies: data.experience.previousCompanies
          ? data.experience.previousCompanies.split(',').map((company) => company.trim())
          : [],
      },
    }

    try {
      const response = await fetch('/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (result.success) {
        setGeneratedLetter(result.data)
      }
    } catch (error) {
      console.error('Hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadLetter = () => {
    if (!generatedLetter) return

    const element = document.createElement('a')
    const file = new Blob([generatedLetter.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${watchedValues.personalInfo.fullName}_Cover_Letter.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getFieldError = (path: string): string | undefined => {
    const pathArray = path.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = errors
    for (const key of pathArray) {
      error = error?.[key]
    }
    return error?.message
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container-responsive section-spacing'>
        <div className='max-w-7xl mx-auto'>
          <Card className='mb-8 shadow-theme-lg'>
            <CardHeader className='p-8'>
              <div className='flex items-center gap-4'>
                <div className='flex-shrink-0'>
                  <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                    <FileText className='w-6 h-6 text-primary' />
                  </div>
                </div>
                <div>
                  <CardTitle className='text-3xl'>Ön Yazı Oluşturma Aracı</CardTitle>
                  <p className='text-muted-foreground mt-1'>Profesyonel ön yazınızı AI desteğiyle oluşturun</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <Card className='shadow-theme-sm'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                      <User className='w-4 h-4 text-primary' />
                    </div>
                    <CardTitle className='text-xl'>Kişisel Bilgiler</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='fullName'>Ad Soyad *</Label>
                      <Input id='fullName' {...register('personalInfo.fullName')} placeholder='John Doe' />
                      {getFieldError('personalInfo.fullName') && (
                        <p className='text-sm text-destructive'>{getFieldError('personalInfo.fullName')}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>E-posta *</Label>
                      <Input
                        id='email'
                        type='email'
                        {...register('personalInfo.email')}
                        placeholder='john@example.com'
                      />
                      {getFieldError('personalInfo.email') && (
                        <p className='text-sm text-destructive'>{getFieldError('personalInfo.email')}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Telefon *</Label>
                      <Input id='phone' {...register('personalInfo.phone')} placeholder='+90 555 123 4567' />
                      {getFieldError('personalInfo.phone') && (
                        <p className='text-sm text-destructive'>{getFieldError('personalInfo.phone')}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='city'>Şehir *</Label>
                      <Input id='city' {...register('personalInfo.city')} placeholder='İstanbul' />
                      {getFieldError('personalInfo.city') && (
                        <p className='text-sm text-destructive'>{getFieldError('personalInfo.city')}</p>
                      )}
                    </div>
                    <div className='space-y-2 sm:col-span-2'>
                      <Label htmlFor='linkedin'>LinkedIn Profili</Label>
                      <Input
                        id='linkedin'
                        {...register('personalInfo.linkedin')}
                        placeholder='linkedin.com/in/johndoe'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='shadow-theme-sm'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                      <Briefcase className='w-4 h-4 text-primary' />
                    </div>
                    <CardTitle className='text-xl'>İş Bilgileri</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='positionTitle'>Pozisyon Başlığı *</Label>
                    <Input id='positionTitle' {...register('jobInfo.positionTitle')} placeholder='Software Developer' />
                    {getFieldError('jobInfo.positionTitle') && (
                      <p className='text-sm text-destructive'>{getFieldError('jobInfo.positionTitle')}</p>
                    )}
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='companyName'>Şirket Adı *</Label>
                      <Input id='companyName' {...register('jobInfo.companyName')} placeholder='Tech Company' />
                      {getFieldError('jobInfo.companyName') && (
                        <p className='text-sm text-destructive'>{getFieldError('jobInfo.companyName')}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='department'>Departman</Label>
                      <Input id='department' {...register('jobInfo.department')} placeholder='Engineering' />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='hiringManagerName'>İK Sorumlusu Adı</Label>
                    <Input id='hiringManagerName' {...register('jobInfo.hiringManagerName')} placeholder='Jane Smith' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='jobDescription'>İş Tanımı *</Label>
                    <Textarea
                      id='jobDescription'
                      {...register('jobInfo.jobDescription')}
                      rows={3}
                      placeholder='React ve Node.js geliştirici arıyoruz'
                    />
                    {getFieldError('jobInfo.jobDescription') && (
                      <p className='text-sm text-destructive'>{getFieldError('jobInfo.jobDescription')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className='shadow-theme-sm'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                      <Star className='w-4 h-4 text-primary' />
                    </div>
                    <CardTitle className='text-xl'>Deneyim</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='currentPosition'>Mevcut Pozisyon *</Label>
                      <Input
                        id='currentPosition'
                        {...register('experience.currentPosition')}
                        placeholder='Junior Developer'
                      />
                      {getFieldError('experience.currentPosition') && (
                        <p className='text-sm text-destructive'>{getFieldError('experience.currentPosition')}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='yearsOfExperience'>Deneyim Yılı *</Label>
                      <Input
                        id='yearsOfExperience'
                        type='number'
                        {...register('experience.yearsOfExperience')}
                        placeholder='3'
                        min='0'
                      />
                      {getFieldError('experience.yearsOfExperience') && (
                        <p className='text-sm text-destructive'>{getFieldError('experience.yearsOfExperience')}</p>
                      )}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='relevantSkills'>
                      Yetenekler * <span className='text-muted-foreground text-xs'>(virgülle ayırınız)</span>
                    </Label>
                    <Textarea
                      id='relevantSkills'
                      {...register('experience.relevantSkills')}
                      rows={2}
                      placeholder='React, Node.js, TypeScript, MongoDB'
                    />
                    {getFieldError('experience.relevantSkills') && (
                      <p className='text-sm text-destructive'>{getFieldError('experience.relevantSkills')}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='achievements'>
                      Başarılar <span className='text-muted-foreground text-xs'>(virgülle ayırınız)</span>
                    </Label>
                    <Textarea
                      id='achievements'
                      {...register('experience.achievements')}
                      rows={2}
                      placeholder='Proje teslim süresini %20 azalttım, 5 kişilik takım liderliği yaptım'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='previousCompanies'>
                      Önceki Şirketler <span className='text-muted-foreground text-xs'>(virgülle ayırınız)</span>
                    </Label>
                    <Input
                      id='previousCompanies'
                      {...register('experience.previousCompanies')}
                      placeholder='StartUp Inc, Digital Agency'
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className='shadow-theme-sm'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl'>Ek Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='coverLetterType'>Ön Yazı Türü</Label>
                      <Controller
                        name='coverLetterType'
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {coverLetterTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {coverLetterTypeDisplayNames[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='tone'>Ton</Label>
                      <Controller
                        name='tone'
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {coverLetterTones.map((tone) => (
                                <SelectItem key={tone} value={tone}>
                                  {coverLetterToneDisplayNames[tone]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='reasonForApplying'>Başvuru Sebebi</Label>
                    <Textarea
                      id='reasonForApplying'
                      {...register('additionalInfo.reasonForApplying')}
                      rows={2}
                      placeholder='Şirketin teknoloji vizyonu beni etkiliyor'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='companyKnowledge'>Şirket Hakkında Bilgi</Label>
                    <Textarea
                      id='companyKnowledge'
                      {...register('additionalInfo.companyKnowledge')}
                      rows={2}
                      placeholder='Fintech alanındaki inovasyonlarınızı takip ediyorum'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='careerGoals'>Kariyer Hedefleri</Label>
                    <Textarea
                      id='careerGoals'
                      {...register('additionalInfo.careerGoals')}
                      rows={2}
                      placeholder='Senior Developer olmak istiyorum'
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full py-4 text-base font-semibold shadow-theme-sm hover:shadow-theme-md'
                size='lg'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Send className='w-5 h-5 mr-2' />
                    Ön Yazı Oluştur
                  </>
                )}
              </Button>
            </div>

            <div className='space-y-6'>
              {generatedLetter ? (
                <Card className='shadow-theme-lg'>
                  <CardHeader className='border-b border-border'>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-xl'>Oluşturulan Ön Yazı</CardTitle>
                      <Button
                        type='button'
                        onClick={downloadLetter}
                        variant='outline'
                        size='sm'
                        className='bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700'
                      >
                        <Download className='w-4 h-4 mr-2' />
                        İndir
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className='p-6 space-y-6'>
                    <div className='bg-muted/30 rounded-lg p-6 max-h-[32rem] overflow-y-auto'>
                      <pre className='whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed'>
                        {generatedLetter.content}
                      </pre>
                    </div>

                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                      <Card className='bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'>
                        <CardContent className='p-4 text-center'>
                          <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                            {generatedLetter.analysis.wordCount}
                          </div>
                          <div className='text-sm text-blue-700 dark:text-blue-300'>Kelime</div>
                        </CardContent>
                      </Card>
                      <Card className='bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'>
                        <CardContent className='p-4 text-center'>
                          <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                            {generatedLetter.analysis.paragraphCount}
                          </div>
                          <div className='text-sm text-green-700 dark:text-green-300'>Paragraf</div>
                        </CardContent>
                      </Card>
                      <Card className='bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'>
                        <CardContent className='p-4 text-center'>
                          <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                            {generatedLetter.analysis.keywordDensity.toFixed(1)}%
                          </div>
                          <div className='text-sm text-purple-700 dark:text-purple-300'>Anahtar Kelime</div>
                        </CardContent>
                      </Card>
                      <Card className='bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'>
                        <CardContent className='p-4 text-center'>
                          <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                            {generatedLetter.analysis.hasPersonalization && generatedLetter.analysis.hasCompanyResearch
                              ? '✓'
                              : '✗'}
                          </div>
                          <div className='text-sm text-orange-700 dark:text-orange-300'>Kişiselleştirme</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className='text-center'>
                  <CardContent className='p-8'>
                    <div className='w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <FileText className='w-8 h-8 text-muted-foreground' />
                    </div>
                    <CardTitle className='text-lg mb-2'>Ön Yazı Oluşturmaya Hazır</CardTitle>
                    <p className='text-muted-foreground'>
                      Formu doldurup "Ön Yazı Oluştur" butonuna basarak profesyonel ön yazınızı oluşturabilirsiniz.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CoverLetterGenerator
