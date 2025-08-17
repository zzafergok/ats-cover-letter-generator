'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Label } from '@/components/core/label'
import { Alert, AlertDescription } from '@/components/core/alert'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Target, AlertCircle, CheckCircle } from 'lucide-react'
import { atsApi } from '@/lib/api/api'
import { ATSMatchAnalysisData, ATSMatchAnalysisResponse } from '@/types/api.types'

interface ATSMatchAnalysisFormProps {
  jobAnalysisId: string
  jobTitle: string
  companyName?: string
  onAnalysisComplete: (result: ATSMatchAnalysisResponse) => void
}

export default function ATSMatchAnalysisForm({
  jobAnalysisId,
  jobTitle,
  companyName,
  onAnalysisComplete,
}: ATSMatchAnalysisFormProps) {
  const [formData, setFormData] = useState<ATSMatchAnalysisData>({
    useUserProfile: true,
    cvData: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCVContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, cvData: value }))
  }

  const handleUseProfileChange = (useProfile: boolean) => {
    setFormData((prev) => ({ ...prev, useUserProfile: useProfile, cvData: useProfile ? null : '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await atsApi.analyzeMatch(jobAnalysisId, formData)
      onAnalysisComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Uyum analizi sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.useUserProfile || (formData.cvData && formData.cvData.trim().length > 0)

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
            <Target className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <CardTitle className='text-2xl'>CV-İş İlanı Uyum Analizi</CardTitle>
            <CardDescription>
              CV'nizi {jobTitle} pozisyonu ile eşleştirip uyum skorunu hesaplayın
              {companyName && ` • ${companyName}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* CV Data Source Selection */}
          <div className='space-y-4 p-4 border rounded-lg bg-muted/20 dark:bg-muted/10'>
            <div className='flex items-center space-x-3'>
              <input
                type='checkbox'
                id='useUserProfile'
                checked={formData.useUserProfile}
                onChange={(e) => handleUseProfileChange(e.target.checked)}
                className='w-4 h-4'
              />
              <Label htmlFor='useUserProfile'>Profil bilgilerimi kullan (Önerilen)</Label>
            </div>

            {!formData.useUserProfile && (
              <div className='space-y-2'>
                <Label htmlFor='cvData'>CV İçeriği *</Label>
                <Textarea
                  id='cvData'
                  value={formData.cvData || ''}
                  onChange={(e) => handleCVContentChange(e.target.value)}
                  placeholder="CV'nizin tam metnini buraya yapıştırın. Eğitim, deneyim, beceriler ve tüm detayları dahil edin..."
                  rows={12}
                  className='font-mono text-sm'
                />
                <div className='flex justify-between text-sm text-muted-foreground'>
                  <span>CV içeriğiniz analiz edilecek</span>
                  <span>{(formData.cvData || '').length} karakter</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='flex items-center justify-between pt-4 border-t'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              {isFormValid ? (
                <>
                  <CheckCircle className='w-4 h-4 text-green-500 dark:text-green-400' />
                  <span>Analiz için hazır</span>
                </>
              ) : (
                <>
                  <AlertCircle className='w-4 h-4 text-orange-500 dark:text-orange-400' />
                  <span>Profil seçin veya CV içeriği girin</span>
                </>
              )}
            </div>

            <Button type='submit' disabled={!isFormValid || isLoading} className='min-w-[140px]'>
              {isLoading ? (
                <>
                  <LoadingSpinner size='sm' className='mr-2' />
                  Analiz Ediliyor...
                </>
              ) : (
                'Uyum Analizini Başlat'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
