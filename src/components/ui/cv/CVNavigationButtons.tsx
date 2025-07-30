'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Sparkles, Clock, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Alert, AlertDescription } from '@/components/core/alert'

interface CVNavigationButtonsProps {
  isFirstStep: boolean
  isLastStep: boolean
  isGenerating: boolean
  error: string | null
  onGoToPrevious: () => void
  onGoToNext: () => void
  onFillDemoData: () => void
  onSubmit: () => void
}

export function CVNavigationButtons({
  isFirstStep,
  isLastStep,
  isGenerating,
  error,
  onGoToPrevious,
  onGoToNext,
  onFillDemoData,
  onSubmit,
}: CVNavigationButtonsProps) {
  return (
    <div className='space-y-4'>
      {/* Navigation Buttons */}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={onGoToPrevious} disabled={isFirstStep}>
          <ChevronLeft className='w-4 h-4 mr-2' />
          Önceki
        </Button>

        <div className='flex gap-2'>
          <Button type='button' variant='outline' onClick={onFillDemoData} className='flex items-center gap-2'>
            <Sparkles className='h-4 w-4' />
            Demo Verilerle Doldur
          </Button>

          {isLastStep ? (
            <Button onClick={onSubmit} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Clock className='h-4 w-4 mr-2 animate-spin' />
                  CV Oluşturuluyor...
                </>
              ) : (
                <>
                  <FileText className='h-4 w-4 mr-2' />
                  CV Oluştur
                </>
              )}
            </Button>
          ) : (
            <Button onClick={onGoToNext}>
              Sonraki
              <ChevronRight className='w-4 h-4 ml-2' />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
