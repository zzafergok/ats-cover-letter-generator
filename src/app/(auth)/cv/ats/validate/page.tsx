'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'
import { ATSValidation } from '@/components/ui/cv/ATSValidation'

export default function CVValidatePage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center'>
            <BarChart3 className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>ATS Uyumluluk Analizi</h1>
            <p className='text-xl text-muted-foreground'>
              CV&apos;nizin ATS sistemlerde ne kadar başarılı olacağını analiz edin
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto'>
        <ATSValidation />
      </div>
    </div>
  )
}
