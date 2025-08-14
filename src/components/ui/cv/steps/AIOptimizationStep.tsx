'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { ATSFormData } from '@/types/form.types'

// REMOVED: Microsoft ATS API service is no longer available
// import { atsCvMicrosoftApi } from '@/lib/api/api' // Service removed

interface AIOptimizationStepProps {
  form: UseFormReturn<ATSFormData>
  onNext: () => void
  onPrevious: () => void
}

export function AIOptimizationStep({ onNext, onPrevious }: AIOptimizationStepProps) {
  // Component disabled due to removed atsCvMicrosoftApi service
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <AlertCircle className='h-12 w-12 text-muted-foreground' />
          </div>
          <CardTitle className='text-xl font-semibold'>AI Optimization Service Unavailable</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground mb-4'>
            The AI optimization service has been removed and is no longer available. This step included features for:
          </p>
          <ul className='text-sm text-muted-foreground space-y-1 mb-6'>
            <li>• Job Description Analysis</li>
            <li>• Keyword Extraction</li>
            <li>• Template Recommendations</li>
            <li>• ATS Optimization Strategies</li>
          </ul>
          <p className='text-sm text-muted-foreground'>
            Please proceed to the next step to continue with CV generation using available templates.
          </p>
        </CardContent>
      </Card>

      <div className='flex justify-between'>
        <button
          onClick={onPrevious}
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700'
        >
          Skip to Next
        </button>
      </div>
    </div>
  )
}
