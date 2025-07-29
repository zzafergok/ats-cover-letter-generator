/*  */
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { AlertCircle } from 'lucide-react'

// REMOVED: CV Optimization service is no longer available
// import { cvOptimizationApi } from '@/lib/api/api' // Service removed
// import { CVOptimizationData, KeywordSuggestionsData, KeywordAnalysisData } from '@/types/api.types' // Types removed

export function CVOptimizer() {
  // Component disabled due to removed cvOptimizationApi service
  return (
    <div className='container mx-auto p-6'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <AlertCircle className='h-12 w-12 text-muted-foreground' />
          </div>
          <CardTitle className='text-xl font-semibold'>CV Optimization Service Unavailable</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground'>
            The CV optimization service has been removed and is no longer available. This component included features
            for:
          </p>
          <ul className='mt-4 text-sm text-muted-foreground space-y-1'>
            <li>• CV Content Optimization</li>
            <li>• Keyword Suggestions</li>
            <li>• Keyword Analysis</li>
            <li>• ATS Compatibility Analysis</li>
          </ul>
          <p className='mt-4 text-sm text-muted-foreground'>Please use the available CV generation services instead.</p>
        </CardContent>
      </Card>
    </div>
  )
}
