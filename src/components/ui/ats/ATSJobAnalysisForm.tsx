'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Alert, AlertDescription } from '@/components/core/alert'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { atsApi } from '@/lib/api/api'
import { ATSJobPostingAnalysisData, ATSJobPostingAnalysisResponse } from '@/types/api.types'

interface ATSJobAnalysisFormProps {
  onAnalysisComplete: (result: ATSJobPostingAnalysisResponse) => void
}

export default function ATSJobAnalysisForm({ onAnalysisComplete }: ATSJobAnalysisFormProps) {
  const [formData, setFormData] = useState<ATSJobPostingAnalysisData>({
    jobPostingText: '',
    jobPostingUrl: '',
    companyName: '',
    positionTitle: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof ATSJobPostingAnalysisData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await atsApi.analyzeJobPosting(formData)
      onAnalysisComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analiz sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.positionTitle && formData.jobPostingText

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
            <FileText className='w-6 h-6 text-primary' />
          </div>
          <div>
            <CardTitle className='text-2xl'>İş İlanı Analizi</CardTitle>
            <CardDescription>İş ilanını analiz ederek ATS optimizasyonu için gerekli bilgileri çıkarın</CardDescription>
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
                value={formData.positionTitle}
                onChange={(e) => handleInputChange('positionTitle', e.target.value)}
                placeholder='Örn: Senior Frontend Developer'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='companyName'>Şirket Adı</Label>
              <Input
                id='companyName'
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder='Örn: Tech Company Ltd.'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='jobPostingUrl'>İş İlanı URL'si (İsteğe Bağlı)</Label>
              <Input
                id='jobPostingUrl'
                value={formData.jobPostingUrl}
                onChange={(e) => handleInputChange('jobPostingUrl', e.target.value)}
                placeholder='https://example.com/job-posting'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='jobPostingText'>İş İlanı Metni *</Label>
            <Textarea
              id='jobPostingText'
              value={formData.jobPostingText}
              onChange={(e) => handleInputChange('jobPostingText', e.target.value)}
              placeholder='İş ilanının tam açıklamasını buraya yapıştırın...'
              rows={12}
              required
            />
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
                  <span>Form hazır</span>
                </>
              ) : (
                <>
                  <AlertCircle className='w-4 h-4 text-orange-500 dark:text-orange-400' />
                  <span>Pozisyon adı ve iş tanımı gerekli</span>
                </>
              )}
            </div>

            <Button type='submit' disabled={!isFormValid || isLoading} className='min-w-[120px]'>
              {isLoading ? (
                <>
                  <LoadingSpinner size='sm' className='mr-2' />
                  Analiz Ediliyor...
                </>
              ) : (
                'Analiz Et'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
