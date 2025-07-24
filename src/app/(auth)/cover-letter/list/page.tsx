'use client'

import React from 'react'
import { CoverLetterList } from '@/components/ui/cover-letter/CoverLetterList'

export default function CoverLetterListPage() {
  return (
    <div className='container mx-auto py-6 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight'>Ön Yazı Arşivi</h1>
          <p className='text-muted-foreground mt-2'>Oluşturduğunuz tüm ön yazıları görüntüleyin, indirin veya silin.</p>
        </div>
        <CoverLetterList />
      </div>
    </div>
  )
}
