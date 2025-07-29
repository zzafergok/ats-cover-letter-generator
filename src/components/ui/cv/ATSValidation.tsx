/*  */
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { AlertCircle } from 'lucide-react'

// REMOVED: ATS Validation service is no longer available
// import { atsValidationApi } from '@/lib/api/api' // Service removed

export function ATSValidation() {
  // Component disabled due to removed atsValidationApi service
  return (
    <div className='container mx-auto p-6'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <AlertCircle className='h-12 w-12 text-muted-foreground' />
          </div>
          <CardTitle className='text-xl font-semibold'>ATS Validation Service Unavailable</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground'>
            The ATS validation service has been removed and is no longer available. This component included features
            for:
          </p>
          <ul className='mt-4 text-sm text-muted-foreground space-y-1'>
            <li>• ATS Compatibility Validation</li>
            <li>• CV Structure Analysis</li>
            <li>• ATS Score Calculation</li>
            <li>• Best Practices Recommendations</li>
          </ul>
          <p className='mt-4 text-sm text-muted-foreground'>Please use the available CV generation services instead.</p>
        </CardContent>
      </Card>
    </div>
  )
}
