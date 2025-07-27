'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { ATSCVForm } from '@/components/ui/cv/ATSCVForm'

export default function CVGeneratePage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center'>
            <FileText className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>ATS CV Oluşturucu</h1>
            <p className='text-xl text-muted-foreground'>
              Profil bilgilerinizden ATS uyumlu profesyonel CV oluşturun
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto'>
        <ATSCVForm />
      </div>
    </div>
  )
}