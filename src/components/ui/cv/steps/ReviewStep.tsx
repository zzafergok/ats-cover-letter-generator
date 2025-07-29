'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { ATSFormData } from '@/types/form.types'

// REMOVED: Microsoft ATS API service is no longer available
// import { atsCvMicrosoftApi } from '@/lib/api/api' // Service removed

interface ReviewStepProps {
  form: UseFormReturn<ATSFormData>
}

export function ReviewStep({ form }: ReviewStepProps) {
  // Component disabled due to removed atsCvMicrosoftApi service
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <AlertCircle className='h-12 w-12 text-muted-foreground' />
          </div>
          <CardTitle className='text-xl font-semibold'>CV Generation Service Unavailable</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground mb-4'>
            The Microsoft ATS CV generation service has been removed and is no longer available. This step included
            features for:
          </p>
          <ul className='text-sm text-muted-foreground space-y-1 mb-6'>
            <li>• CV Review & Validation</li>
            <li>• Microsoft Template Generation</li>
            <li>• ATS-Optimized PDF Export</li>
            <li>• Real-time CV Preview</li>
          </ul>
          <p className='text-sm text-muted-foreground'>
            Please use the available CV generator services from the main dashboard instead.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
