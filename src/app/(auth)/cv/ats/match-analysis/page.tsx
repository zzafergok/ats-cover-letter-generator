'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Badge } from '@/components/core/badge'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Progress } from '@/components/core/progress'
import { Target, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import ATSMatchAnalysisForm from '@/components/ui/ats/ATSMatchAnalysisForm'
import ATSOptimizationDisplay from '@/components/ui/ats/ATSOptimizationDisplay'
import { ATSMatchAnalysisResponse, ATSOptimizationResponse } from '@/types/api.types'
import Link from 'next/link'

export default function MatchAnalysisPage() {
  const searchParams = useSearchParams()
  const [matchResult, setMatchResult] = useState<ATSMatchAnalysisResponse | null>(null)
  const [optimizationResult, setOptimizationResult] = useState<ATSOptimizationResponse | null>(null)
  const [isOptimizationApplied, setIsOptimizationApplied] = useState(false)
  const [showAllMissingSkills, setShowAllMissingSkills] = useState(false)
  const [showAllMatchedSkills, setShowAllMatchedSkills] = useState(false)

  const jobAnalysisId = searchParams.get('jobAnalysisId')
  const jobTitle = searchParams.get('jobTitle') || 'İş Pozisyonu'
  const companyName = searchParams.get('companyName') || ''

  useEffect(() => {
    if (!jobAnalysisId) {
      // Redirect to job analysis if no job analysis ID
      window.location.href = '/cv/ats/job-analysis'
    }
  }, [jobAnalysisId])

  const handleMatchAnalysisComplete = (result: ATSMatchAnalysisResponse) => {
    setMatchResult(result)
  }

  const handleOptimizationComplete = (result: ATSOptimizationResponse) => {
    setOptimizationResult(result)
  }

  const handleOptimizationApplied = () => {
    setIsOptimizationApplied(true)
  }

  if (!jobAnalysisId) {
    return (
      <div className='container mx-auto p-6'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>İş analizi ID'si bulunamadı. Lütfen önce iş ilanı analizini tamamlayın.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
            <Target className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>CV-İş İlanı Uyum Analizi</h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              {jobTitle} pozisyonu için CV uyum skorunuzu hesaplayın ve optimizasyon önerileri alın
              {companyName && ` • ${companyName}`}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Form */}
      {!matchResult && (
        <ATSMatchAnalysisForm
          jobAnalysisId={jobAnalysisId}
          jobTitle={jobTitle}
          companyName={companyName}
          onAnalysisComplete={handleMatchAnalysisComplete}
        />
      )}

      {/* Match Results */}
      {matchResult && (
        <div className='space-y-6'>
          {/* Success Alert */}
          <Alert className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription className='text-green-800 dark:text-green-300'>
              CV uyum analizi tamamlandı! Skorunuzu inceleyin ve optimizasyon önerilerini görün.
            </AlertDescription>
          </Alert>

          {/* Match Score Card */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <CardTitle className='text-2xl'>Uyum Analizi Sonuçları</CardTitle>
                  <CardDescription>CV'nizin {jobTitle} pozisyonu ile uyum derecesi</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Overall Score */}
              <div className='p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border dark:border-border'>
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>Genel Uyum Skoru</h3>
                    <p className='text-sm text-muted-foreground'>CV'nizin iş ilanı ile eşleşme yüzdesi</p>
                  </div>
                  <div className='text-right'>
                    <div className='text-3xl font-bold text-primary'>
                      %{matchResult.data.matchAnalysis.overallScore}
                    </div>
                    <div className='text-sm text-muted-foreground'>100 üzerinden</div>
                  </div>
                </div>
                <Progress value={matchResult.data.matchAnalysis.overallScore} className='h-3' />
              </div>

              {/* Detailed Scores */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='p-4 border dark:border-border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Beceri Uyumu</span>
                    <span className='font-bold text-blue-600 dark:text-blue-400'>
                      %{matchResult.data.matchAnalysis.skillsMatch.score}
                    </span>
                  </div>
                  <Progress value={matchResult.data.matchAnalysis.skillsMatch.score} className='h-2' />
                  <div className='text-xs text-muted-foreground mt-1'>
                    {matchResult.data.matchAnalysis.skillsMatch.matched}/
                    {matchResult.data.matchAnalysis.skillsMatch.totalRequired} beceri eşleşti
                  </div>
                </div>

                <div className='p-4 border dark:border-border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Deneyim Uyumu</span>
                    <span className='font-bold text-green-600 dark:text-green-400'>
                      %{matchResult.data.matchAnalysis.experienceMatch?.score || 0}
                    </span>
                  </div>
                  <Progress value={matchResult.data.matchAnalysis.experienceMatch?.score || 0} className='h-2' />
                  <div className='text-xs text-muted-foreground mt-1'>Deneyim seviyesi uyumu</div>
                </div>

                <div className='p-4 border dark:border-border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Anahtar Kelime</span>
                    <span className='font-bold text-purple-600 dark:text-purple-400'>
                      %{matchResult.data.matchAnalysis.keywordMatch?.score || 0}
                    </span>
                  </div>
                  <Progress value={matchResult.data.matchAnalysis.keywordMatch?.score || 0} className='h-2' />
                  <div className='text-xs text-muted-foreground mt-1'>ATS anahtar kelime eşleşmesi</div>
                </div>
              </div>

              {/* Missing Skills */}
              {matchResult.data.matchAnalysis.missingSkills &&
                matchResult.data.matchAnalysis.missingSkills.length > 0 && (
                  <div className='space-y-2'>
                    <h3 className='font-medium text-sm text-muted-foreground'>Eksik Beceriler</h3>
                    <div className='flex flex-wrap gap-2'>
                      {(showAllMissingSkills
                        ? matchResult.data.matchAnalysis.missingSkills
                        : matchResult.data.matchAnalysis.missingSkills.slice(0, 8)
                      ).map((skill, index) => (
                        <Badge key={index} variant='destructive' className='text-xs'>
                          {skill}
                        </Badge>
                      ))}
                      {matchResult.data.matchAnalysis.missingSkills.length > 8 && !showAllMissingSkills && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllMissingSkills(true)}
                        >
                          +{matchResult.data.matchAnalysis.missingSkills.length - 8} daha
                        </Badge>
                      )}
                      {showAllMissingSkills && matchResult.data.matchAnalysis.missingSkills.length > 8 && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllMissingSkills(false)}
                        >
                          Daha az göster
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Matched Skills */}
              {matchResult.data.matchAnalysis.matchedSkills &&
                matchResult.data.matchAnalysis.matchedSkills.length > 0 && (
                  <div className='space-y-2'>
                    <h3 className='font-medium text-sm text-muted-foreground'>Eşleşen Beceriler</h3>
                    <div className='flex flex-wrap gap-2'>
                      {(showAllMatchedSkills
                        ? matchResult.data.matchAnalysis.matchedSkills
                        : matchResult.data.matchAnalysis.matchedSkills.slice(0, 8)
                      ).map((skill, index) => (
                        <Badge key={index} variant='default' className='text-xs'>
                          ✓ {skill}
                        </Badge>
                      ))}
                      {matchResult.data.matchAnalysis.matchedSkills.length > 8 && !showAllMatchedSkills && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllMatchedSkills(true)}
                        >
                          +{matchResult.data.matchAnalysis.matchedSkills.length - 8} daha
                        </Badge>
                      )}
                      {showAllMatchedSkills && matchResult.data.matchAnalysis.matchedSkills.length > 8 && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllMatchedSkills(false)}
                        >
                          Daha az göster
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className='pt-4 border-t'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-medium mb-2'>Sonraki Adımlar</h3>
                    <p className='text-sm text-muted-foreground'>
                      CV'nizi optimize ederek uyum skorunuzu artırabilirsiniz
                    </p>
                  </div>
                  <div className='flex gap-3'>
                    <Button variant='outline' onClick={() => setMatchResult(null)}>
                      Yeni Analiz
                    </Button>
                    <Link href='/cv/ats/job-analysis'>
                      <Button variant='outline'>Farklı İş İlanı</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Section */}
          <ATSOptimizationDisplay
            matchAnalysisId={matchResult.data.matchAnalysis.id}
            matchScore={matchResult.data.matchAnalysis.overallScore}
            onOptimizationComplete={handleOptimizationComplete}
            onOptimizationApplied={handleOptimizationApplied}
          />

          {/* Optimization Results */}
          {optimizationResult && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-green-500' />
                  Optimizasyon Tamamlandı
                </CardTitle>
                <CardDescription>
                  CV optimizasyonu başarıyla tamamlandı. Sonuçları aşağıda görüntüleyebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium text-green-800 dark:text-green-300'>Optimizasyon Durumu</h3>
                        <p className='text-sm text-green-600 dark:text-green-400'>CV'niz başarıyla optimize edildi</p>
                      </div>
                      <Badge variant='default' className='bg-green-600 dark:bg-green-500'>
                        Tamamlandı
                      </Badge>
                    </div>
                  </div>

                  {isOptimizationApplied && (
                    <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        <span className='text-sm font-medium text-blue-800 dark:text-blue-300'>
                          Optimizasyon profilinize uygulandı
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message after Optimization Applied */}
          {isOptimizationApplied && (
            <Alert className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'>
              <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
              <AlertDescription className='text-green-800 dark:text-green-300'>
                Optimizasyon önerileri profilinize başarıyla uygulandı! Şimdi yeni bir CV oluşturabilir veya mevcut
                CV'nizi güncelleyebilirsiniz.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Help Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <Target className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Uyum Skoru</h3>
            <p className='text-sm text-muted-foreground'>CV'nizin iş ilanı ile ne kadar uyumlu olduğunu ölçer</p>
          </CardContent>
        </Card>

        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <TrendingUp className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Optimizasyon</h3>
            <p className='text-sm text-muted-foreground'>Skorunuzu artırmak için kişiselleştirilmiş öneriler</p>
          </CardContent>
        </Card>

        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <CheckCircle className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>ATS Dostu</h3>
            <p className='text-sm text-muted-foreground'>Başvuru takip sistemleri için optimize edilmiş analiz</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
