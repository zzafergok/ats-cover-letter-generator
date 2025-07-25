'use client'

import React from 'react'
import { TemplateBasedCoverLetterCreator } from '@/components/ui/cover-letter/TemplateBasedCoverLetterCreator'

export default function TemplatePage() {
  return (
    <div className='container mx-auto p-4 md:p-6 space-y-4 md:space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Şablon Tabanlı Ön Yazı</h1>
          <p className='text-sm md:text-base text-muted-foreground'>
            Hazır şablonlardan seçim yaparak hızlıca profesyonel ön yazı oluşturun
          </p>
        </div>
      </div>

      <TemplateBasedCoverLetterCreator />
    </div>
  )
}
