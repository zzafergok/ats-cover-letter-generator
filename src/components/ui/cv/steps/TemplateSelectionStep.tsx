'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { ATSFormData } from '@/types/form.types'

// REMOVED: Microsoft ATS API service is no longer available
// import { atsCvMicrosoftApi } from '@/lib/api/api' // Service removed

interface TemplateSelectionStepProps {
  form: UseFormReturn<ATSFormData>
  onNext: () => void
  onPrevious: () => void
}

export function TemplateSelectionStep({ form, onNext, onPrevious }: TemplateSelectionStepProps) {
  // Component disabled due to removed atsCvMicrosoftApi service
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <AlertCircle className='h-12 w-12 text-muted-foreground' />
          </div>
          <CardTitle className='text-xl font-semibold'>Template Service Unavailable</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground mb-4'>
            The Microsoft template selection service has been removed and is no longer available. This step included
            features for:
          </p>
          <ul className='text-sm text-muted-foreground space-y-1 mb-6'>
            <li>• Microsoft CV Templates</li>
            <li>• Template Categories & Languages</li>
            <li>• ATS Score Information</li>
            <li>• Target Role Matching</li>
          </ul>
          <p className='text-sm text-muted-foreground'>
            Please use the available CV generator templates from the main dashboard instead.
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
