'use client'

import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import { Logo } from '@/components/ui/brand/logo'
import { LoadingSpinner } from '@/components/core/loading-spinner'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/dashboard')
        } else {
          router.replace('/login')
        }
      }, 100) // Kısa delay ile döngüyü önle

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center space-y-6'>
        <Logo size='lg' showText={true} className='justify-center' />
        <LoadingSpinner size='lg' />
      </div>
    </div>
  )
}
