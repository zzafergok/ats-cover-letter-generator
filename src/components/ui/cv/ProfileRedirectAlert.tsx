'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/core/alert'
import { Button } from '@/components/core/button'

interface ProfileRedirectAlertProps {
  sectionName: string
  description: string
  targetTab: string
  buttonText?: string
  className?: string
}

export function ProfileRedirectAlert({
  sectionName,
  description,
  targetTab,
  buttonText,
  className = '',
}: ProfileRedirectAlertProps) {
  const router = useRouter()

  return (
    <Alert className={`border-amber-200 bg-amber-50 dark:bg-amber-950/20 ${className}`}>
      <AlertTriangle className='h-4 w-4 text-amber-600' />
      <AlertDescription>
        <div className='space-y-2'>
          <p className='text-sm text-amber-800 dark:text-amber-200'>
            <span className='font-medium'>{sectionName}</span> bilgileriniz profilde tanımlanmamış. {description}
          </p>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push(`/profile?tab=${targetTab}`)}
            className='mt-2 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20'
          >
            <ExternalLink className='h-4 w-4 mr-2' />
            {buttonText || `Profilde ${sectionName} Ekle`}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
