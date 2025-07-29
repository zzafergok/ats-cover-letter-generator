/*  */
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  Search,
  FileText,
  CheckCircle,
  ArrowRight,
  Percent,
  Hash,
  Tags,
} from 'lucide-react'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { cvOptimizationApi } from '@/lib/api/api'
import { CVOptimizationData, KeywordSuggestionsData, KeywordAnalysisData } from '@/types/api.types'

const optimizationSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, 'Ad soyad gereklidir'),
    email: z.string().email('Geçerli email gereklidir'),
    phone: z.string().min(10, 'Telefon numarası gereklidir'),
  }),
  professionalSummary: z.string().min(50, 'Profesyonel özet en az 50 karakter olmalıdır'),
  workExperience: z
    .array(
      z.object({
        title: z.string().min(2, 'İş unvanı gereklidir'),
        company: z.string().min(2, 'Şirket adı gereklidir'),
        achievements: z.array(z.string()).min(1, 'En az bir başarı gereklidir'),
      }),
    )
    .min(1, 'En az bir iş deneyimi gereklidir'),
  skills: z.object({
    technical: z.array(z.string()).min(1, 'En az bir teknik yetenek gereklidir'),
  }),
  jobDescription: z.string().min(100, 'İş tanımı en az 100 karakter olmalıdır'),
})

const keywordSuggestionSchema = z.object({
  jobDescription: z.string().min(100, 'İş tanımı en az 100 karakter olmalıdır'),
  targetPosition: z.string().min(2, 'Hedef pozisyon gereklidir'),
})

const keywordAnalysisSchema = z.object({
  content: z.string().min(100, 'CV içeriği en az 100 karakter olmalıdır'),
  jobDescription: z.string().min(100, 'İş tanımı en az 100 karakter olmalıdır'),
})

type OptimizationFormData = z.infer<typeof optimizationSchema>
type KeywordSuggestionFormData = z.infer<typeof keywordSuggestionSchema>
type KeywordAnalysisFormData = z.infer<typeof keywordAnalysisSchema>

interface OptimizationResult {
  optimizedCV: {
    personalInfo: any
    professionalSummary: string
    workExperience: any[]
  }
  optimizationReport: {
    improvementScore: number
    keywordMatchImprovement: number
    changes: Array<{
      section: string
      change: string
      impact: string
    }>
  }
}

interface KeywordSuggestions {
  keywords: {
    critical: string[]
    important: string[]
    recommended: string[]
  }
  phrases: string[]
}

interface KeywordAnalysis {
  matchScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  keywordDensity: Record<string, number>
  suggestions: string[]
}

export function CVOptimizer() {
  const [activeTab, setActiveTab] = useState('optimize')
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestions | null>(null)
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Optimization Form
  const optimizationForm = useForm<OptimizationFormData>({
    resolver: zodResolver(optimizationSchema),
    defaultValues: {
      personalInfo: { fullName: '', email: '', phone: '' },
      professionalSummary: '',
      workExperience: [{ title: '', company: '', achievements: [''] }],
      skills: { technical: [''] },
      jobDescription: '',
    },
  })

  // Keyword Suggestion Form
  const suggestionForm = useForm<KeywordSuggestionFormData>({
    resolver: zodResolver(keywordSuggestionSchema),
    defaultValues: {
      jobDescription: '',
      targetPosition: '',
    },
  })

  // Keyword Analysis Form
  const analysisForm = useForm<KeywordAnalysisFormData>({
    resolver: zodResolver(keywordAnalysisSchema),
    defaultValues: {
      content: '',
      jobDescription: '',
    },
  })

  const onOptimize = async (data: OptimizationFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const optimizationData: CVOptimizationData = {
        cvData: {
          personalInfo: data.personalInfo,
          professionalSummary: data.professionalSummary,
          workExperience: data.workExperience,
          skills: data.skills,
        },
        jobDescription: data.jobDescription,
      }

      const response = await cvOptimizationApi.optimize(optimizationData)

      if (response.success) {
        setOptimizationResult(response.data)
      }
    } catch (err) {
      setError('CV optimizasyonu sırasında bir hata oluştu.')
      console.error('CV optimization error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onGetKeywordSuggestions = async (data: KeywordSuggestionFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const suggestionData: KeywordSuggestionsData = {
        jobDescription: data.jobDescription,
        targetPosition: data.targetPosition,
      }

      const response = await cvOptimizationApi.getKeywordSuggestions(suggestionData)

      if (response.success) {
        setKeywordSuggestions(response.data)
      }
    } catch (err) {
      setError('Anahtar kelime önerileri alınırken bir hata oluştu.')
      console.error('Keyword suggestions error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onAnalyzeKeywords = async (data: KeywordAnalysisFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const analysisData: KeywordAnalysisData = {
        content: data.content,
        jobDescription: data.jobDescription,
      }

      const response = await cvOptimizationApi.analyzeKeywords(analysisData)

      if (response.success) {
        setKeywordAnalysis(response.data)
      }
    } catch (err) {
      setError('Anahtar kelime analizi sırasında bir hata oluştu.')
      console.error('Keyword analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='optimize' className='flex items-center gap-2'>
            <Zap className='w-4 h-4' />
            CV Optimizasyonu
          </TabsTrigger>
          <TabsTrigger value='suggestions' className='flex items-center gap-2'>
            <Lightbulb className='w-4 h-4' />
            Anahtar Kelime Önerileri
          </TabsTrigger>
          <TabsTrigger value='analysis' className='flex items-center gap-2'>
            <Search className='w-4 h-4' />
            Anahtar Kelime Analizi
          </TabsTrigger>
        </TabsList>

        {/* CV Optimization Tab */}
        <TabsContent value='optimize' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Zap className='h-5 w-5' />
                CV Optimizasyonu
              </CardTitle>
              <CardDescription>CV'nizi belirli bir iş ilanına göre optimize edin</CardDescription>
            </CardHeader>
            <CardContent>
              {!optimizationResult ? (
                <form onSubmit={optimizationForm.handleSubmit(onOptimize)} className='space-y-6'>
                  {/* Personal Info */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label>Ad Soyad *</Label>
                      <Input placeholder='Ahmet Yılmaz' {...optimizationForm.register('personalInfo.fullName')} />
                    </div>
                    <div className='space-y-2'>
                      <Label>E-posta *</Label>
                      <Input
                        type='email'
                        placeholder='ahmet@example.com'
                        {...optimizationForm.register('personalInfo.email')}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Telefon *</Label>
                      <Input placeholder='+90 555 123 45 67' {...optimizationForm.register('personalInfo.phone')} />
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className='space-y-2'>
                    <Label>Profesyonel Özet *</Label>
                    <Textarea
                      placeholder='Mevcut profesyonel özet metninizi buraya girin...'
                      rows={4}
                      {...optimizationForm.register('professionalSummary')}
                    />
                  </div>

                  {/* Work Experience Summary */}
                  <div className='space-y-4'>
                    <Label className='text-base font-medium'>İş Deneyimi Özeti</Label>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label>Son Pozisyon *</Label>
                        <Input
                          placeholder='Frontend Developer'
                          {...optimizationForm.register('workExperience.0.title')}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Son Şirket *</Label>
                        <Input placeholder='ABC Teknoloji' {...optimizationForm.register('workExperience.0.company')} />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label>Ana Başarılar *</Label>
                      <Textarea
                        placeholder='Başarılarınızı ve sorumluluklarınızı listeleyin...'
                        {...optimizationForm.register('workExperience.0.achievements.0')}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className='space-y-2'>
                    <Label>Teknik Yetenekler *</Label>
                    <Input
                      placeholder='React, TypeScript, Node.js, AWS (virgülle ayırın)'
                      {...optimizationForm.register('skills.technical.0')}
                    />
                  </div>

                  {/* Job Description */}
                  <div className='space-y-2'>
                    <Label>İş İlanı *</Label>
                    <Textarea
                      placeholder='Optimize etmek istediğiniz iş ilanının tüm metnini buraya kopyalayın...'
                      rows={6}
                      {...optimizationForm.register('jobDescription')}
                    />
                  </div>

                  <Button type='submit' disabled={isLoading} className='w-full'>
                    {isLoading && <Zap className='mr-2 h-4 w-4 animate-spin' />}
                    {isLoading ? 'Optimize Ediliyor...' : "CV'yi Optimize Et"}
                  </Button>
                </form>
              ) : (
                <div className='space-y-6'>
                  {/* Optimization Results Header */}
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold'>Optimizasyon Sonuçları</h3>
                    <Button variant='outline' onClick={() => setOptimizationResult(null)}>
                      Yeni Optimizasyon
                    </Button>
                  </div>

                  {/* Improvement Scores */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card>
                      <CardContent className='pt-6'>
                        <div className='text-center'>
                          <div className='text-3xl font-bold text-green-600 mb-2'>
                            +{optimizationResult.optimizationReport.improvementScore}%
                          </div>
                          <p className='text-sm text-muted-foreground'>Genel İyileştirme</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className='pt-6'>
                        <div className='text-center'>
                          <div className='text-3xl font-bold text-blue-600 mb-2'>
                            +{optimizationResult.optimizationReport.keywordMatchImprovement}%
                          </div>
                          <p className='text-sm text-muted-foreground'>Anahtar Kelime Eşleşmesi</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Changes Made */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <TrendingUp className='h-5 w-5' />
                        Yapılan İyileştirmeler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {optimizationResult.optimizationReport.changes.map((change, index) => (
                          <div key={index} className='border rounded-lg p-4'>
                            <div className='flex items-start gap-3'>
                              <CheckCircle className='h-5 w-5 text-green-600 mt-1 flex-shrink-0' />
                              <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Badge variant='outline'>{change.section}</Badge>
                                  <Badge variant='secondary'>{change.impact}</Badge>
                                </div>
                                <p className='text-sm'>{change.change}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimized Content Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Optimize Edilmiş İçerik
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div>
                          <h4 className='font-medium mb-2'>Profesyonel Özet</h4>
                          <p className='text-sm bg-muted p-3 rounded-lg'>
                            {optimizationResult.optimizedCV.professionalSummary}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyword Suggestions Tab */}
        <TabsContent value='suggestions' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lightbulb className='h-5 w-5' />
                Anahtar Kelime Önerileri
              </CardTitle>
              <CardDescription>Belirli bir pozisyon için anahtar kelime önerileri alın</CardDescription>
            </CardHeader>
            <CardContent>
              {!keywordSuggestions ? (
                <form onSubmit={suggestionForm.handleSubmit(onGetKeywordSuggestions)} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label>Hedef Pozisyon *</Label>
                    <Input placeholder='Frontend Developer' {...suggestionForm.register('targetPosition')} />
                  </div>
                  <div className='space-y-2'>
                    <Label>İş İlanı *</Label>
                    <Textarea
                      placeholder='İş ilanının tüm metnini buraya kopyalayın...'
                      rows={6}
                      {...suggestionForm.register('jobDescription')}
                    />
                  </div>
                  <Button type='submit' disabled={isLoading} className='w-full'>
                    {isLoading && <Lightbulb className='mr-2 h-4 w-4 animate-spin' />}
                    {isLoading ? 'Öneriler Alınıyor...' : 'Anahtar Kelime Önerileri Al'}
                  </Button>
                </form>
              ) : (
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold'>Anahtar Kelime Önerileri</h3>
                    <Button variant='outline' onClick={() => setKeywordSuggestions(null)}>
                      Yeni Öneri
                    </Button>
                  </div>

                  {/* Critical Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-red-600'>
                        <Target className='h-5 w-5' />
                        Kritik Anahtar Kelimeler
                      </CardTitle>
                      <CardDescription>Mutlaka CV'nizde bulunması gereken kelimeler</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex flex-wrap gap-2'>
                        {keywordSuggestions.keywords.critical.map((keyword, index) => (
                          <Badge key={index} variant='destructive'>
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Important Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-yellow-600'>
                        <Hash className='h-5 w-5' />
                        Önemli Anahtar Kelimeler
                      </CardTitle>
                      <CardDescription>CV'nizde bulunması önerilen kelimeler</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex flex-wrap gap-2'>
                        {keywordSuggestions.keywords.important.map((keyword, index) => (
                          <Badge key={index} variant='default'>
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-blue-600'>
                        <Tags className='h-5 w-5' />
                        Önerilen Anahtar Kelimeler
                      </CardTitle>
                      <CardDescription>Ek olarak ekleyebileceğiniz kelimeler</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex flex-wrap gap-2'>
                        {keywordSuggestions.keywords.recommended.map((keyword, index) => (
                          <Badge key={index} variant='secondary'>
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Phrases */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Önemli İfadeler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2'>
                        {keywordSuggestions.phrases.map((phrase, index) => (
                          <div key={index} className='bg-muted p-3 rounded-lg text-sm'>
                            {phrase}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyword Analysis Tab */}
        <TabsContent value='analysis' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Search className='h-5 w-5' />
                Anahtar Kelime Analizi
              </CardTitle>
              <CardDescription>Mevcut CV'nizin anahtar kelime uyumluluğunu analiz edin</CardDescription>
            </CardHeader>
            <CardContent>
              {!keywordAnalysis ? (
                <form onSubmit={analysisForm.handleSubmit(onAnalyzeKeywords)} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label>CV İçeriği *</Label>
                    <Textarea
                      placeholder='Mevcut CV içeriğinizi buraya kopyalayın...'
                      rows={6}
                      {...analysisForm.register('content')}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>İş İlanı *</Label>
                    <Textarea
                      placeholder='Analiz etmek istediğiniz iş ilanını buraya kopyalayın...'
                      rows={6}
                      {...analysisForm.register('jobDescription')}
                    />
                  </div>
                  <Button type='submit' disabled={isLoading} className='w-full'>
                    {isLoading && <Search className='mr-2 h-4 w-4 animate-spin' />}
                    {isLoading ? 'Analiz Ediliyor...' : 'Anahtar Kelime Analizi Yap'}
                  </Button>
                </form>
              ) : (
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold'>Anahtar Kelime Analiz Sonuçları</h3>
                    <Button variant='outline' onClick={() => setKeywordAnalysis(null)}>
                      Yeni Analiz
                    </Button>
                  </div>

                  {/* Match Score */}
                  <Card>
                    <CardContent className='pt-6'>
                      <div className='text-center'>
                        <div className='text-4xl font-bold text-blue-600 mb-2'>{keywordAnalysis.matchScore}%</div>
                        <p className='text-lg text-muted-foreground'>Eşleşme Skoru</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Matched vs Missing Keywords */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2 text-green-600'>
                          <CheckCircle className='h-5 w-5' />
                          Eşleşen Kelimeler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {keywordAnalysis.matchedKeywords.map((keyword, index) => (
                            <Badge key={index} variant='default' className='bg-green-100 text-green-800'>
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2 text-red-600'>
                          <Target className='h-5 w-5' />
                          Eksik Kelimeler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {keywordAnalysis.missingKeywords.map((keyword, index) => (
                            <Badge key={index} variant='destructive' className='bg-red-100 text-red-800'>
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Keyword Density */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Percent className='h-5 w-5' />
                        Kelime Yoğunluğu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-3'>
                        {Object.entries(keywordAnalysis.keywordDensity).map(([keyword, density], index) => (
                          <div key={index} className='flex items-center justify-between'>
                            <span className='font-medium'>{keyword}</span>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-muted-foreground'>{density}%</span>
                              <div className='w-24 bg-muted rounded-full h-2'>
                                <div
                                  className='bg-primary h-2 rounded-full transition-all duration-300'
                                  style={{ width: `${Math.min(density * 10, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Lightbulb className='h-5 w-5' />
                        İyileştirme Önerileri
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-3'>
                        {keywordAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                            <ArrowRight className='h-4 w-4 text-primary mt-1 flex-shrink-0' />
                            <p className='text-sm'>{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Message */}
      {error && (
        <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
          <p className='text-sm text-destructive'>{error}</p>
        </div>
      )}
    </div>
  )
}
