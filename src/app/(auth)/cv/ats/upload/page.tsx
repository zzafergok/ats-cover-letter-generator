'use client'

import React from 'react'
import { Upload } from 'lucide-react'
import { CVUpload } from '@/components/ui/cv/CVUpload'

export default function CVUploadPage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center'>
            <Upload className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>CV Dosyası Yükleme</h1>
            <p className='text-xl text-muted-foreground'>
              Mevcut CV&apos;nizi yükleyerek ATS uyumlu versiyonunu oluşturun
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto'>
        <CVUpload onUploadComplete={() => (window.location.href = '/cv/ats/generate')} />
      </div>
    </div>
  )
}
