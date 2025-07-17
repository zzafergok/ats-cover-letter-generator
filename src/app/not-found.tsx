'use client'

import { Suspense } from 'react'

import { LoadingSpinner } from '@/components/core/loading-spinner'
import NotFoundContent from './NotFoundContent'

export default function NotFound() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NotFoundContent />
    </Suspense>
  )
}
