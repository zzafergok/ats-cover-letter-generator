'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Badge } from '@/components/core/badge'
import { Progress } from '@/components/core/progress'
import { Alert, AlertDescription } from '@/components/core/alert'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { TrendingUp, CheckCircle, AlertTriangle, Target, Zap, User, ArrowRight } from 'lucide-react'
import { atsApi } from '@/lib/api/api'
import { ATSOptimizationData, ATSOptimizationResponse, ATSApplyOptimizationResponse } from '@/types/api.types'

interface ATSOptimizationDisplayProps {
  matchAnalysisId: string
  matchScore: number
  onOptimizationComplete: (result: ATSOptimizationResponse) => void
  onOptimizationApplied?: (result: ATSApplyOptimizationResponse) => void
}

export default function ATSOptimizationDisplay({
  matchAnalysisId,
  matchScore,
  onOptimizationComplete,
  onOptimizationApplied,
}: ATSOptimizationDisplayProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [optimization, setOptimization] = useState<ATSOptimizationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setError(null)

    const optimizationData: ATSOptimizationData = {
      optimizationLevel: 'ADVANCED',
      targetSections: [
        { section: 'SKILLS', priority: 'HIGH' },
        { section: 'EXPERIENCE', priority: 'HIGH' },
        { section: 'KEYWORDS', priority: 'MEDIUM' },
      ],
      preserveOriginal: false,
    }

    try {
      const result = await atsApi.optimize(matchAnalysisId, optimizationData)
      setOptimization(result)
      onOptimizationComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimizasyon sırasında bir hata oluştu')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleApplyOptimization = async () => {
    if (!optimization?.data.optimization.id) return

    setIsApplying(true)
    setError(null)

    try {
      const result = await atsApi.applyOptimization(optimization.data.optimization.id)
      if (onOptimizationApplied) {
        onOptimizationApplied(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimizasyon uygulanırken bir hata oluştu')
    } finally {
      setIsApplying(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className='space-y-6'>
      {/* Current Score Card */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
              <Target className='w-6 h-6 text-primary' />
            </div>
            <div>
              <CardTitle className='text-xl'>Mevcut Uyum Skoru</CardTitle>
              <CardDescription>CV'nizin iş ilanı ile uyum derecesi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Uyum Yüzdesi</span>
              <span className={`text-2xl font-bold ${getScoreColor(matchScore)}`}>%{matchScore}</span>
            </div>
            <Progress value={matchScore} className='h-2' />
            <div className='flex items-center gap-2'>
              {matchScore >= 80 ? (
                <>
                  <CheckCircle className='w-4 h-4 text-green-500 dark:text-green-400' />
                  <span className='text-sm text-green-700 dark:text-green-300'>Mükemmel eşleşme</span>
                </>
              ) : matchScore >= 60 ? (
                <>
                  <AlertTriangle className='w-4 h-4 text-yellow-500 dark:text-yellow-400' />
                  <span className='text-sm text-yellow-700 dark:text-yellow-300'>İyileştirme önerilir</span>
                </>
              ) : (
                <>
                  <AlertTriangle className='w-4 h-4 text-red-500 dark:text-red-400' />
                  <span className='text-sm text-red-700 dark:text-red-300'>Optimizasyon gerekli</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Action */}
      {!optimization && (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
                <Zap className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>CV Optimizasyonu</CardTitle>
                <CardDescription>CV'nizi iş ilanına göre optimize edin ve uyum skorunuzu artırın</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex items-center gap-2 text-sm'>
                  <CheckCircle className='w-4 h-4 text-green-500 dark:text-green-400' />
                  <span>Anahtar kelime iyileştirmesi</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <CheckCircle className='w-4 h-4 text-green-500 dark:text-green-400' />
                  <span>Beceri optimizasyonu</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <CheckCircle className='w-4 h-4 text-green-500 dark:text-green-400' />
                  <span>İçerik önerileri</span>
                </div>
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleOptimize} disabled={isOptimizing} className='w-full' size='lg'>
                {isOptimizing ? (
                  <>
                    <LoadingSpinner size='sm' className='mr-2' />
                    Optimizasyon Hazırlanıyor...
                  </>
                ) : (
                  <>
                    <Zap className='w-4 h-4 mr-2' />
                    CV'yi Optimize Et
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {optimization && (
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <CardTitle className='text-xl'>Optimizasyon Tamamlandı</CardTitle>
                  <CardDescription>
                    CV'niz başarıyla optimize edildi. Önerilen değişiklikleri inceleyin.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* Predicted Score Improvement */}
                <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='font-medium text-green-800 dark:text-green-300'>Beklenen İyileşme</span>
                    <div className='flex items-center gap-2'>
                      <span className={`font-bold ${getScoreColor(matchScore)}`}>%{matchScore}</span>
                      <ArrowRight className='w-4 h-4 text-green-600 dark:text-green-400' />
                      <span className='font-bold text-green-600 dark:text-green-400'>
                        %{Math.min(100, matchScore + 15)}
                      </span>
                    </div>
                  </div>
                  <Progress value={Math.min(100, matchScore + 15)} className='h-2' />
                </div>

                {/* Optimization Categories */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label className='font-medium'>Anahtar Kelime Önerileri</Label>
                    <div className='flex flex-wrap gap-2'>
                      {['React', 'TypeScript', 'Node.js', 'Agile'].map((keyword) => (
                        <Badge key={keyword} variant='secondary' className='text-xs'>
                          +{keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label className='font-medium'>İyileştirme Alanları</Label>
                    <div className='space-y-1 text-sm text-muted-foreground'>
                      <div>• Teknik beceriler vurgulanacak</div>
                      <div>• Proje deneyimleri detaylandırılacak</div>
                      <div>• ATS dostu format uygulanacak</div>
                    </div>
                  </div>
                </div>

                {/* Apply to Profile Button */}
                <div className='pt-4 border-t'>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-muted-foreground'>
                      Bu optimizasyonları profilinize uygulayabilirsiniz
                    </div>
                    <Button onClick={handleApplyOptimization} disabled={isApplying} variant='outline'>
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium ${className}`}>{children}</div>
}
