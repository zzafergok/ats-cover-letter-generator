'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { BarChart3 } from 'lucide-react'
import { ATSValidation } from '@/components/ui/cv/ATSValidation'

export default function CVAnalysisPage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center'>
            <BarChart3 className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>CV Analizi</h1>
            <p className='text-xl text-muted-foreground'>CV&apos;nizin ATS uyumluluğunu ve performansını analiz edin</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5' />
              ATS Uyumluluk Analizi
            </CardTitle>
            <CardDescription>
              CV&apos;nizin başvuru takip sistemlerinde ne kadar başarılı olacağını detaylı olarak analiz edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ATSValidation />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
