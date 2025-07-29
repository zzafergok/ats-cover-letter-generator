'use client'

import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Bot, Sparkles, Zap, Clock } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Switch } from '@/components/core/switch'
import { Textarea } from '@/components/core/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Badge } from '@/components/core/badge'
import { Alert, AlertDescription } from '@/components/core/alert'
import { atsCvMicrosoftApi } from '@/lib/api/api'
import { ATSFormData } from '@/types/form.types'

interface AIOptimizationStepProps {
  form: UseFormReturn<ATSFormData>
}

interface JobAnalysis {
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
}

export function AIOptimizationStep({ form }: AIOptimizationStepProps) {
  const [useAI, setUseAI] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [targetPosition, setTargetPosition] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<'AUTO' | 'TURKISH' | 'ENGLISH'>('AUTO')
  const [industryType, setIndustryType] = useState('')
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setValue } = form

  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim() || !targetPosition.trim()) {
      setError('İş tanımı ve hedef pozisyon bilgisi gereklidir.')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // Auto-detect language
      const isEnglish =
        /[a-zA-Z]/.test(jobDescription) &&
        jobDescription
          .split(' ')
          .some((word) =>
            ['the', 'and', 'or', 'you', 'will', 'have', 'experience', 'with', 'skills', 'requirements'].includes(
              word.toLowerCase(),
            ),
          )

      const response = await atsCvMicrosoftApi.analyzeJob({
        jobDescription,
        targetPosition: targetPosition.trim(),
        language: selectedLanguage === 'AUTO' ? (isEnglish ? 'ENGLISH' : 'TURKISH') : selectedLanguage,
        industryType: industryType.trim() || undefined,
      })

      if (response.success) {
        setJobAnalysis(response.data)
        // Update form configuration
        setValue('configuration.useAI', true)
        setValue('configuration.jobDescription', jobDescription)
        setValue('configuration.targetCompany', '')

        // If there are recommended templates, update template selection
        if (response.data.recommendedTemplates?.length > 0) {
          localStorage.setItem('selectedMicrosoftTemplate', response.data.recommendedTemplates[0].id)
        }
      }
    } catch (err) {
      console.error('Job analysis error:', err)
      setError('İş tanımı analiz edilirken hata oluştu')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Update form when AI toggle changes
  React.useEffect(() => {
    setValue('configuration.useAI', useAI)
    if (!useAI) {
      setValue('configuration.jobDescription', '')
      setJobAnalysis(null)
    }
  }, [useAI, setValue])

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>AI Optimizasyon</h3>
        <p className='text-muted-foreground'>
          Claude AI ile CV'nizi iş tanımına göre optimize edin ve ATS başarı oranınızı artırın.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bot className='h-5 w-5' />
            Claude AI Optimizasyonu
            <Badge variant='default' className='ml-2 bg-gradient-to-r from-purple-500 to-blue-500'>
              <Sparkles className='h-3 w-3 mr-1' />
              AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
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
                <Label htmlFor='target-position' className='text-sm font-medium'>
                  Hedef Pozisyon <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='target-position'
                  placeholder='ör: Senior Full Stack Developer, Data Scientist...'
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  maxLength={100}
                />
                <p className='text-xs text-muted-foreground'>
                  AI'nın analiz edeceği iş pozisyonu. İş ilanındaki başlık ile aynı olması önerilir.
                </p>
              </div>

              {/* Job Description */}
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
                  <div className='text-xs text-muted-foreground'>{jobDescription.length}/2000 karakter</div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleAnalyzeJob}
                    disabled={!jobDescription.trim() || !targetPosition.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? (
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

              {/* Additional Parameters */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>İş İlanı Dili</Label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={(value: 'AUTO' | 'TURKISH' | 'ENGLISH') => setSelectedLanguage(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='AUTO'>🤖 Otomatik Tespit</SelectItem>
                      <SelectItem value='TURKISH'>🇹🇷 Türkçe</SelectItem>
                      <SelectItem value='ENGLISH'>🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>
                    Sektör <span className='text-muted-foreground'>(Opsiyonel)</span>
                  </Label>
                  <Input
                    placeholder='ör: Teknoloji, Finans, Sağlık...'
                    value={industryType}
                    onChange={(e) => setIndustryType(e.target.value)}
                    maxLength={50}
                  />
                </div>
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Analysis Results */}
              {jobAnalysis && (
                <div className='space-y-4'>
                  {/* Job Analysis Results */}
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
                    <div className='p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700'>
                      <h4 className='font-medium text-sm mb-2 text-blue-800 dark:text-blue-200'>Önerilen Şablonlar</h4>
                      <div className='space-y-2'>
                        {jobAnalysis.recommendedTemplates.map((template) => (
                          <div key={template.id} className='text-xs'>
                            <div className='flex items-center justify-between'>
                              <span className='font-medium text-blue-700 dark:text-blue-300'>{template.name}</span>
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
                    <div className='p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700'>
                      <h4 className='font-medium text-sm mb-2 text-purple-800 dark:text-purple-200'>
                        ATS Optimizasyon İpuçları
                      </h4>
                      <ul className='space-y-1 text-xs text-purple-700 dark:text-purple-300'>
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
        </CardContent>
      </Card>
    </div>
  )
}
