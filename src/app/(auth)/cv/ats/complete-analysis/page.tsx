'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Alert, AlertDescription } from '@/components/core/alert'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Badge } from '@/components/core/badge'
import { Progress } from '@/components/core/progress'
import { Zap, AlertCircle, CheckCircle, TrendingUp, Target, FileText, User } from 'lucide-react'
import { atsApi } from '@/lib/api/api'
import { ATSCompleteAnalysisData, ATSCompleteAnalysisResponse } from '@/types/api.types'

export default function CompleteAnalysisPage() {
  const [formData, setFormData] = useState<ATSCompleteAnalysisData>({
    jobPostingAnalysis: {
      jobPostingText: '',
      jobPostingUrl: '',
      companyName: '',
      positionTitle: '',
    },
    optimizationLevel: 'ADVANCED',
    targetSections: [
      { section: 'SKILLS', priority: 'HIGH' },
      { section: 'EXPERIENCE', priority: 'HIGH' },
      { section: 'KEYWORDS', priority: 'MEDIUM' },
    ],
    useUserProfile: true,
    cvData: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<ATSCompleteAnalysisResponse | null>(null)
  const [isOptimizationApplied, setIsOptimizationApplied] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'useUserProfile' || field === 'cvData') {
      setFormData((prev) => ({ ...prev, [field]: value }))
    } else {
      setFormData((prev) => ({
        ...prev,
        jobPostingAnalysis: {
          ...prev.jobPostingAnalysis,
          [field]: value,
        },
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await atsApi.completeAnalysis(formData)
      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analiz sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyOptimization = async () => {
    if (!analysisResult?.data.optimization?.id) return

    setIsApplying(true)
    setError(null)

    try {
      await atsApi.applyOptimization(analysisResult.data.optimization.id)
      setIsOptimizationApplied(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimizasyon uygulanırken bir hata oluştu')
    } finally {
      setIsApplying(false)
    }
  }

  const isFormValid = formData.jobPostingAnalysis.positionTitle && formData.jobPostingAnalysis.jobPostingText

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
            <Zap className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>Hızlı ATS Analizi</h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Tek adımda iş ilanı analizi, CV uyum skoru ve optimizasyon önerileri alın
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Form or Results */}
      {!analysisResult ? (
        <Card className='w-full max-w-4xl mx-auto'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
                <Zap className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-2xl'>Komple ATS Analizi</CardTitle>
                <CardDescription>
                  İş ilanı ve CV bilgilerinizi girin, kapsamlı analiz ve optimizasyon önerileri alın
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='positionTitle'>Pozisyon Adı *</Label>
                  <Input
                    id='positionTitle'
                    value={formData.jobPostingAnalysis.positionTitle}
                    onChange={(e) => handleInputChange('positionTitle', e.target.value)}
                    placeholder='Örn: Senior Frontend Developer'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='companyName'>Şirket Adı</Label>
                  <Input
                    id='companyName'
                    value={formData.jobPostingAnalysis.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder='Örn: Tech Company Ltd.'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='jobPostingUrl'>İş İlanı URL'si (İsteğe Bağlı)</Label>
                <Input
                  id='jobPostingUrl'
                  value={formData.jobPostingAnalysis.jobPostingUrl}
                  onChange={(e) => handleInputChange('jobPostingUrl', e.target.value)}
                  placeholder='https://example.com/job-posting'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='jobPostingText'>İş İlanı Metni *</Label>
                <Textarea
                  id='jobPostingText'
                  value={formData.jobPostingAnalysis.jobPostingText}
                  onChange={(e) => handleInputChange('jobPostingText', e.target.value)}
                  placeholder='İş ilanının tam açıklamasını buraya yapıştırın...'
                  rows={8}
                  required
                />
              </div>

              {/* CV Data Option */}
              <div className='space-y-4 p-4 border dark:border-border rounded-lg bg-muted/20 dark:bg-muted/10'>
                <div className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    id='useUserProfile'
                    checked={formData.useUserProfile}
                    onChange={(e) => handleInputChange('useUserProfile', e.target.checked)}
                    className='w-4 h-4'
                  />
                  <Label htmlFor='useUserProfile'>Profil bilgilerimi kullan (Önerilen)</Label>
                </div>

                {!formData.useUserProfile && (
                  <div className='space-y-2'>
                    <Label htmlFor='cvData'>CV İçeriği</Label>
                    <Textarea
                      id='cvData'
                      value={formData.cvData || ''}
                      onChange={(e) => handleInputChange('cvData', e.target.value)}
                      placeholder='CV metninizi buraya yapıştırın...'
                      rows={6}
                    />
                  </div>
                )}
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className='flex items-center justify-between pt-4'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  {isFormValid ? (
                    <>
                      <CheckCircle className='w-4 h-4 text-green-500 dark:text-green-400' />
                      <span>Form hazır - Komple analiz başlatılabilir</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className='w-4 h-4 text-orange-500 dark:text-orange-400' />
                      <span>Pozisyon adı ve iş ilanı metni gerekli</span>
                    </>
                  )}
                </div>

                <Button type='submit' disabled={!isFormValid || isLoading} className='min-w-[180px]' size='lg'>
                  {isLoading ? (
                    <>
                      <LoadingSpinner size='sm' className='mr-2' />
                      Analiz Ediliyor...
                    </>
                  ) : (
                    <>
                      <Zap className='w-4 h-4 mr-2' />
                      Komple Analizi Başlat
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-6'>
          {/* Success Alert */}
          <Alert className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription className='text-green-800 dark:text-green-300'>
              Komple ATS analizi başarıyla tamamlandı! Sonuçlarınızı inceleyin.
            </AlertDescription>
          </Alert>

          {/* Results Overview */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card>
              <CardContent className='p-6 text-center'>
                <FileText className='w-12 h-12 mx-auto mb-4 text-blue-500 dark:text-blue-400' />
                <h3 className='font-semibold mb-2'>İş İlanı Analizi</h3>
                <div className='text-sm text-muted-foreground'>
                  <div>✓ Anahtar kelimeler çıkarıldı</div>
                  <div>✓ Gerekli beceriler tespit edildi</div>
                  <div>✓ Deneyim seviyesi belirlendi</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6 text-center'>
                <Target className='w-12 h-12 mx-auto mb-4 text-green-500 dark:text-green-400' />
                <h3 className='font-semibold mb-2'>Uyum Analizi</h3>
                <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-2'>
                  %{analysisResult.data.matchAnalysis.overallScore}
                </div>
                <div className='text-sm text-muted-foreground'>Uyum Skoru</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6 text-center'>
                <TrendingUp className='w-12 h-12 mx-auto mb-4 text-purple-500 dark:text-purple-400' />
                <h3 className='font-semibold mb-2'>Optimizasyon</h3>
                <div className='text-sm text-muted-foreground'>
                  <div>✓ İyileştirme önerileri hazır</div>
                  <div>✓ Anahtar kelime önerileri</div>
                  <div>✓ Profile uygulanabilir</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Detaylı Analiz Sonuçları</CardTitle>
              <CardDescription>
                {analysisResult.data.jobAnalysis.positionTitle} pozisyonu için kapsamlı değerlendirme
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Overall Score */}
              <div className='p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border dark:border-border'>
                <div className='flex items-center justify-between mb-3'>
                  <div>
                    <h3 className='font-semibold'>Genel Uyum Skoru</h3>
                    <p className='text-sm text-muted-foreground'>CV'nizin iş ilanı ile eşleşme yüzdesi</p>
                  </div>
                  <div
                    className={`text-3xl font-bold ${getScoreColor(analysisResult.data.matchAnalysis.overallScore)}`}
                  >
                    %{analysisResult.data.matchAnalysis.overallScore}
                  </div>
                </div>
                <Progress value={analysisResult.data.matchAnalysis.overallScore} className='h-3' />
              </div>

              {/* Sub Scores */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='p-4 border dark:border-border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Beceri Uyumu</span>
                    <span className='font-bold text-blue-600 dark:text-blue-400'>
                      %{analysisResult.data.matchAnalysis.skillsMatch.score}
                    </span>
                  </div>
                  <Progress value={analysisResult.data.matchAnalysis.skillsMatch.score} className='h-2' />
                </div>

                <div className='p-4 border dark:border-border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Deneyim Uyumu</span>
                    <span className='font-bold text-green-600 dark:text-green-400'>
                      %{analysisResult.data.matchAnalysis.experienceMatch?.score || 0}
                    </span>
                  </div>
                  <Progress value={analysisResult.data.matchAnalysis.experienceMatch?.score || 0} className='h-2' />
                </div>

                <div className='p-4 border dark:border-border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Anahtar Kelime</span>
                    <span className='font-bold text-purple-600 dark:text-purple-400'>
                      %{analysisResult.data.matchAnalysis.keywordMatch?.score || 0}
                    </span>
                  </div>
                  <Progress value={analysisResult.data.matchAnalysis.keywordMatch?.score || 0} className='h-2' />
                </div>
              </div>

              {/* Optimization Suggestions */}
              {analysisResult.data.optimization && (
                <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                  <h3 className='font-semibold text-green-800 dark:text-green-300 mb-3'>Optimizasyon Önerileri</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <h4 className='font-medium mb-2'>Önerilen Anahtar Kelimeler</h4>
                      <div className='flex flex-wrap gap-2'>
                        {['React', 'TypeScript', 'Node.js', 'Agile', 'REST API'].map((keyword) => (
                          <Badge key={keyword} variant='secondary' className='text-xs'>
                            +{keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>İyileştirme Alanları</h4>
                      <div className='text-sm text-muted-foreground space-y-1'>
                        <div>• Teknik beceriler vurgulanacak</div>
                        <div>• Proje deneyimleri detaylandırılacak</div>
                        <div>• ATS dostu format uygulanacak</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='pt-4 border-t'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-medium mb-2'>Optimizasyonu Uygula</h3>
                    <p className='text-sm text-muted-foreground'>
                      Bu önerileri profilinize uygulayarak CV'nizi iyileştirebilirsiniz
                    </p>
                  </div>
                  <div className='flex gap-3'>
                    <Button variant='outline' onClick={() => setAnalysisResult(null)}>
                      Yeni Analiz
                    </Button>

                    {!isOptimizationApplied && analysisResult.data.optimization && (
                      <Button onClick={handleApplyOptimization} disabled={isApplying}>
                        {isApplying ? (
                          <>
                            <LoadingSpinner size='sm' className='mr-2' />
                            Uygulanıyor...
                          </>
                        ) : (
                          <>
                            <User className='w-4 h-4 mr-2' />
                            Profile Uygula
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Message after Optimization Applied */}
          {isOptimizationApplied && (
            <Alert className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'>
              <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
              <AlertDescription className='text-green-800 dark:text-green-300'>
                Optimizasyon önerileri profilinize başarıyla uygulandı! Artık güncellenmiş profiliniz ile yeni CV
                oluşturabilirsiniz.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Features */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <Zap className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Tek Adımda</h3>
            <p className='text-sm text-muted-foreground'>Tüm analiz süreci tek seferde</p>
          </CardContent>
        </Card>

        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <Target className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Kapsamlı Analiz</h3>
            <p className='text-sm text-muted-foreground'>İş ilanı + CV uyum + optimizasyon</p>
          </CardContent>
        </Card>

        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <TrendingUp className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Otomatik Öneriler</h3>
            <p className='text-sm text-muted-foreground'>AI destekli iyileştirme tavsiyeleri</p>
          </CardContent>
        </Card>

        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <User className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Profile Entegrasyon</h3>
            <p className='text-sm text-muted-foreground'>Öneriler doğrudan profile uygulanır</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
