'use client'

import React from 'react'
import { Zap } from 'lucide-react'
import { CVOptimizer } from '@/components/ui/cv/CVOptimizer'

export default function CVOptimizePage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center'>
            <Zap className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>CV Optimizasyonu</h1>
            <p className='text-xl text-muted-foreground'>
              CV&apos;nizi belirli iş ilanları için optimize edin ve anahtar kelime önerileri alın
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto'>
        <CVOptimizer />
      </div>
    </div>
  )
}
