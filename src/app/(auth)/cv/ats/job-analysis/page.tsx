'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Badge } from '@/components/core/badge'
import { Alert, AlertDescription } from '@/components/core/alert'
import { FileText, ArrowRight, CheckCircle, Target } from 'lucide-react'
import ATSJobAnalysisForm from '@/components/ui/ats/ATSJobAnalysisForm'
import { ATSJobPostingAnalysisResponse } from '@/types/api.types'
import Link from 'next/link'

export default function JobAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<ATSJobPostingAnalysisResponse | null>(null)

  const handleAnalysisComplete = (result: ATSJobPostingAnalysisResponse) => {
    setAnalysisResult(result)
  }

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
            <FileText className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>İş İlanı Analizi</h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              İş ilanını analiz ederek ATS optimizasyonu için temel bilgileri çıkarın
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Form or Results */}
      {!analysisResult ? (
        <ATSJobAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
      ) : (
        <div className='space-y-6'>
          {/* Success Alert */}
          <Alert className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription className='text-green-800 dark:text-green-300'>
              İş ilanı başarıyla analiz edildi! Artık CV uyum analizine geçebilirsiniz.
            </AlertDescription>
          </Alert>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center'>
                  <CheckCircle className='w-6 h-6 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <CardTitle className='text-2xl'>Analiz Tamamlandı</CardTitle>
                  <CardDescription>İş ilanı başarıyla işlendi ve anahtar bilgiler çıkarıldı</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Job Info Summary */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <h3 className='font-medium text-sm text-muted-foreground'>Pozisyon Bilgileri</h3>
                  <div className='space-y-1'>
                    <p className='font-semibold'>{analysisResult.data.positionTitle}</p>
                    {analysisResult.data.companyName && (
                      <p className='text-muted-foreground'>{analysisResult.data.companyName}</p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <h3 className='font-medium text-sm text-muted-foreground'>Analiz ID</h3>
                  <div className='font-mono text-sm bg-muted dark:bg-muted/60 p-2 rounded'>
                    {analysisResult.data.id}
                  </div>
                </div>
              </div>

              {/* Key Requirements */}
              {analysisResult.data.atsKeywords && (
                <div className='space-y-2'>
                  <h3 className='font-medium text-sm text-muted-foreground'>ATS Anahtar Kelimeler</h3>
                  <div className='flex flex-wrap gap-2'>
                    {analysisResult.data.atsKeywords.slice(0, 10).map((keyword, index) => (
                      <Badge key={index} variant='secondary'>
                        {keyword}
                      </Badge>
                    ))}
                    {analysisResult.data.atsKeywords.length > 10 && (
                      <Badge variant='outline'>+{analysisResult.data.atsKeywords.length - 10} daha</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              {analysisResult.data.requiredSkills && (
                <div className='space-y-2'>
                  <h3 className='font-medium text-sm text-muted-foreground'>Gerekli Beceriler</h3>
                  <div className='flex flex-wrap gap-2'>
                    {analysisResult.data.requiredSkills.slice(0, 8).map((skill, index) => (
                      <Badge key={index} variant='default'>
                        {skill}
                      </Badge>
                    ))}
                    {analysisResult.data.requiredSkills.length > 8 && (
                      <Badge variant='outline'>+{analysisResult.data.requiredSkills.length - 8} daha</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Experience Level */}
              {analysisResult.data.seniorityLevel && (
                <div className='space-y-2'>
                  <h3 className='font-medium text-sm text-muted-foreground'>Deneyim Seviyesi</h3>
                  <Badge variant='outline' className='text-sm'>
                    {analysisResult.data.seniorityLevel}
                  </Badge>
                </div>
              )}

              {/* Next Steps */}
              <div className='pt-6 border-t'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-medium mb-2'>Sonraki Adım</h3>
                    <p className='text-sm text-muted-foreground'>
                      CV'nizi bu iş ilanı ile karşılaştırıp uyum skorunu öğrenin
                    </p>
                  </div>
                  <div className='flex gap-3'>
                    <Button variant='outline' onClick={() => setAnalysisResult(null)}>
                      Yeni Analiz
                    </Button>
                    <Link
                      href={`/cv/ats/match-analysis?jobAnalysisId=${analysisResult.data.id}&jobTitle=${encodeURIComponent(analysisResult.data.positionTitle)}&companyName=${encodeURIComponent(analysisResult.data.companyName || '')}`}
                    >
                      <Button>
                        CV Uyum Analizi
                        <ArrowRight className='w-4 h-4 ml-2' />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <Target className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Anahtar Kelime Çıkarma</h3>
            <p className='text-sm text-muted-foreground'>
              İş ilanından önemli anahtar kelimeleri otomatik olarak çıkarır
            </p>
          </CardContent>
        </Card>

        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <FileText className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>Gereksinim Analizi</h3>
            <p className='text-sm text-muted-foreground'>İş tanımından teknik ve yumuşak becerileri tespit eder</p>
          </CardContent>
        </Card>

        <Card className='border-dashed'>
          <CardContent className='p-4 text-center'>
            <CheckCircle className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
            <h3 className='font-medium mb-1'>ATS Optimizasyonu</h3>
            <p className='text-sm text-muted-foreground'>Başvuru takip sistemleri için optimize edilmiş analiz</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
