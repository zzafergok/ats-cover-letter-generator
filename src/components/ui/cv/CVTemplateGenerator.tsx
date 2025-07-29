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
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap
} from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Badge } from '@/components/core/badge'
import { Separator } from '@/components/core/separator'
import { LoadingSpinner } from '@/components/core/loading-spinner'

import { cvGeneratorApi } from '@/lib/api/api'
import { useUserProfileStore } from '@/store/userProfileStore'

// CV Template Form Schema
const cvTemplateSchema = z.object({
  templateType: z.enum(['basic_hr', 'office_manager', 'simple_classic', 'stylish_accounting', 'minimalist_turkish']),
  personalInfo: z.object({
    fullName: z.string().min(1, 'İsim gereklidir'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Geçerli email adresi gereklidir'),
  }),
  objective: z.string().optional(),
  experience: z.array(z.object({
    jobTitle: z.string().min(1, 'İş unvanı gereklidir'),
    company: z.string().min(1, 'Şirket adı gereklidir'),
    location: z.string().optional(),
    startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  education: z.array(z.object({
    degree: z.string().min(1, 'Derece gereklidir'),
    university: z.string().min(1, 'Üniversite adı gereklidir'),
    location: z.string().optional(),
    graduationDate: z.string().optional(),
    details: z.string().optional(),
  })).optional(),
  communication: z.string().optional(),
  leadership: z.string().optional(),
  references: z.array(z.object({
    name: z.string().min(1, 'İsim gereklidir'),
    company: z.string().min(1, 'Şirket adı gereklidir'),
    contact: z.string().min(1, 'İletişim bilgisi gereklidir'),
  })).optional(),
})

type CVTemplateFormData = z.infer<typeof cvTemplateSchema>

interface CVTemplate {
  id: string
  name: string
  description: string
  language: string
}

export function CVTemplateGenerator() {
  const { profile, getProfile } = useUserProfileStore()
  const [templates, setTemplates] = useState<CVTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedCV, setGeneratedCV] = useState<{
    id: string
    templateType: string
    fileName: string
    generatedAt: string
  } | null>(null)

  const form = useForm<CVTemplateFormData>({
    resolver: zodResolver(cvTemplateSchema),
    defaultValues: {
      templateType: 'basic_hr',
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      objective: '',
      experience: [{
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }],
      education: [{
        degree: '',
        university: '',
        location: '',
        graduationDate: '',
        details: '',
      }],
      communication: '',
      leadership: '',
      references: [{
        name: '',
        company: '',
        contact: '',
      }],
    },
  })

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = form
  const selectedTemplate = watch('templateType')

  // Load CV templates
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingTemplates(true)
      try {
        const response = await cvGeneratorApi.getTemplates()
        if (response.success) {
          setTemplates(response.data)
        }
      } catch (err) {
        console.error('Template loading error:', err)
        setError('Template\'ler yüklenirken hata oluştu')
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])

  // Load user profile data
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

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
      const formattedExperiences = profile.experiences.slice(0, 3).map(exp => ({
        jobTitle: exp.position,
        company: exp.companyName,
        location: exp.location || '',
        startDate: `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}`,
        endDate: exp.isCurrent ? '' : `${exp.endYear}-${String(exp.endMonth).padStart(2, '0')}`,
        description: exp.description || '',
      }))
      setValue('experience', formattedExperiences)
    }

    // Auto-fill education from profile
    if (profile.educations?.length > 0) {
      const formattedEducations = profile.educations.slice(0, 2).map(edu => ({
        degree: edu.degree || '',
        university: edu.schoolName,
        location: '',
        graduationDate: `${edu.endYear || edu.startYear}`,
        details: edu.fieldOfStudy ? `Field: ${edu.fieldOfStudy}` : '',
      }))
      setValue('education', formattedEducations)
    }
  }, [profile, setValue, getProfile])

  const onSubmit = async (data: CVTemplateFormData) => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await cvGeneratorApi.generate({
        templateType: data.templateType,
        data: {
          personalInfo: data.personalInfo,
          objective: data.objective,
          experience: data.experience,
          education: data.education,
          communication: data.communication,
          leadership: data.leadership,
          references: data.references,
        }
      })

      if (response.success) {
        setGeneratedCV({
          id: response.data.id,
          templateType: response.data.templateType,
          fileName: `CV_${data.templateType}_${Date.now()}.pdf`,
          generatedAt: response.data.createdAt,
        })
      }
    } catch (err) {
      console.error('CV generation error:', err)
      setError('CV oluşturulurken hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedCV) return

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
    } catch (err) {
      console.error('Download error:', err)
      setError('CV indirme sırasında hata oluştu')
    }
  }

  const fillDemoData = () => {
    setValue('personalInfo.fullName', 'Ahmet Yılmaz')
    setValue('personalInfo.email', 'ahmet.yilmaz@email.com')
    setValue('personalInfo.phone', '+90 555 123 4567')
    setValue('personalInfo.address', 'Beşiktaş Mah. Teknoloji Cad. No:42/8')
    setValue('personalInfo.city', 'İstanbul')
    setValue('personalInfo.state', 'İstanbul')
    setValue('personalInfo.zipCode', '34353')
    
    setValue('objective', '5+ yıl deneyimli Full Stack Developer. Modern web teknolojileri ile kullanıcı odaklı çözümler geliştirme konusunda uzman.')
    
    setValue('experience', [
      {
        jobTitle: 'Senior Full Stack Developer',
        company: 'Tech Solutions Inc.',
        location: 'İstanbul',
        startDate: '2022-01',
        endDate: '',
        description: 'React, Node.js ve AWS ile modern web uygulamaları geliştirme. Mikroservis mimarisi tasarımı ve implementasyonu.',
      },
      {
        jobTitle: 'Full Stack Developer',
        company: 'Digital Agency Pro',
        location: 'İstanbul',
        startDate: '2020-03',
        endDate: '2021-12',
        description: 'E-commerce platformları geliştirme. RESTful API tasarımı ve frontend-backend entegrasyonu.',
      }
    ])

    setValue('education', [
      {
        degree: 'Computer Engineering',
        university: 'İstanbul Teknik Üniversitesi',
        location: 'İstanbul',
        graduationDate: '2020',
        details: 'GPA: 3.7/4.0 - Software Engineering focus',
      }
    ])

    setValue('communication', 'Excellent written and verbal communication skills in Turkish and English. Experience in client presentations and technical documentation.')
    setValue('leadership', 'Led cross-functional teams of 5+ developers. Mentored junior developers and implemented agile development processes.')
    
    setValue('references', [
      {
        name: 'Mehmet Demir',
        company: 'Tech Solutions Inc.',
        contact: 'mehmet.demir@techsolutions.com | +90 555 987 6543',
      }
    ])
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                CV Template Generator
                <Badge variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Beta
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Profesyonel CV template'leri kullanarak modern ve etkileyici CV'nizi oluşturun.
              </p>

              {/* Template Selection */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-medium">CV Template Seçimi</Label>
                {isLoadingTemplates ? (
                  <div className="flex items-center justify-center p-4">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-muted-foreground">Template'ler yükleniyor...</span>
                  </div>
                ) : (
                  <Select value={selectedTemplate} onValueChange={(value) => setValue('templateType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Template seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic_hr">Basic HR Resume</SelectItem>
                      <SelectItem value="office_manager">Office Manager Resume</SelectItem>
                      <SelectItem value="simple_classic">Simple Classic Resume</SelectItem>
                      <SelectItem value="stylish_accounting">Stylish Accounting Resume</SelectItem>
                      <SelectItem value="minimalist_turkish">Minimalist Turkish Resume</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Kişisel Bilgiler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Ad Soyad *</Label>
                        <Input
                          id="fullName"
                          {...register('personalInfo.fullName')}
                          placeholder="Ahmet Yılmaz"
                        />
                        {errors.personalInfo?.fullName && (
                          <p className="text-sm text-red-600 mt-1">{errors.personalInfo.fullName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('personalInfo.email')}
                          placeholder="ahmet@email.com"
                        />
                        {errors.personalInfo?.email && (
                          <p className="text-sm text-red-600 mt-1">{errors.personalInfo.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          {...register('personalInfo.phone')}
                          placeholder="+90 555 123 4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Şehir</Label>
                        <Input
                          id="city"
                          {...register('personalInfo.city')}
                          placeholder="İstanbul"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Adres</Label>
                      <Input
                        id="address"
                        {...register('personalInfo.address')}
                        placeholder="Mahalle, Sokak, No"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Objective */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Kariyer Hedefi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      {...register('objective')}
                      placeholder="Kariyer hedefinizi ve profesyonel özetinizi yazın..."
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fillDemoData}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Demo Verilerle Doldur
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="flex items-center gap-2 flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        CV Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        CV Oluştur
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview/Result Section */}
        <div className="space-y-6">
          {generatedCV ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  CV Başarıyla Oluşturuldu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">CV Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Template:</span> {generatedCV.templateType}</p>
                    <p><span className="font-medium">Dosya Adı:</span> {generatedCV.fileName}</p>
                    <p><span className="font-medium">Oluşturulma:</span> {new Date(generatedCV.generatedAt).toLocaleString('tr-TR')}</p>
                  </div>
                </div>

                <Button onClick={handleDownload} className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  PDF İndir
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setGeneratedCV(null)}
                  className="w-full"
                >
                  Yeni CV Oluştur
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>CV Önizleme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">CV Önizlemesi</h3>
                  <p className="text-muted-foreground mb-4">
                    Formu doldurun ve CV'nizi oluşturun
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Mevcut Template: <Badge variant="outline">{selectedTemplate}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Özellikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Aktif Template:</span>
                  <Badge variant="secondary">{selectedTemplate}</Badge>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  Bu template ile profesyonel görünümlü CV'nizi PDF formatında oluşturabilirsiniz.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}