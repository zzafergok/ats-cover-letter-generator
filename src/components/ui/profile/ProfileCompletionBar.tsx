'use client'

import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import type { UserProfile } from '@/types/api.types'

interface ProfileCompletionBarProps {
  profile: UserProfile | null
}

interface CompletionItem {
  key: string
  label: string
  isCompleted: boolean
  weight: number
}

export function ProfileCompletionBar({ profile }: ProfileCompletionBarProps) {
  const getCompletionItems = (): CompletionItem[] => {
    if (!profile) return []

    return [
      {
        key: 'basicInfo',
        label: 'Temel Bilgiler',
        isCompleted: !!(profile.firstName && profile.lastName && profile.email),
        weight: 20,
      },
      {
        key: 'about',
        label: 'Hakkımda',
        isCompleted: !!(profile.aboutMe && profile.aboutMe.trim().length > 0),
        weight: 15,
      },
      {
        key: 'phone',
        label: 'Telefon',
        isCompleted: !!(profile.phone && profile.phone.trim().length > 0),
        weight: 10,
      },
      {
        key: 'location',
        label: 'Konum',
        isCompleted: !!(profile.city && profile.city.trim().length > 0),
        weight: 10,
      },
      {
        key: 'education',
        label: 'Eğitim',
        isCompleted: !!(profile.educations && profile.educations.length > 0),
        weight: 15,
      },
      {
        key: 'experience',
        label: 'İş Deneyimi',
        isCompleted: !!(profile.experiences && profile.experiences.length > 0),
        weight: 15,
      },
      {
        key: 'skills',
        label: 'Yetenekler',
        isCompleted: !!(profile.skills && profile.skills.length >= 3),
        weight: 10,
      },
      {
        key: 'courses',
        label: 'Kurslar',
        isCompleted: !!(profile.courses && profile.courses.length > 0),
        weight: 2.5,
      },
      {
        key: 'certificates',
        label: 'Sertifikalar',
        isCompleted: !!(profile.certificates && profile.certificates.length > 0),
        weight: 2.5,
      },
    ]
  }

  const completionItems = getCompletionItems()
  const completedItems = completionItems.filter((item) => item.isCompleted)
  const totalWeight = completionItems.reduce((sum, item) => sum + item.weight, 0)
  const completedWeight = completedItems.reduce((sum, item) => sum + item.weight, 0)
  const completionPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0

  const getProgressColor = () => {
    if (completionPercentage >= 90) return 'bg-green-500'
    if (completionPercentage >= 70) return 'bg-primary'
    if (completionPercentage >= 50) return 'bg-primary/70'
    return 'bg-primary/50'
  }

  const getMissingItems = () => {
    return completionItems.filter((item) => !item.isCompleted)
  }

  const missingItems = getMissingItems()

  return (
    <div className='bg-card rounded-lg border p-6 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>Profil Tamamlanma Durumu</h3>
        <span className='text-2xl font-bold text-primary'>{completionPercentage}%</span>
      </div>

      <div className='mb-4'>
        <div className='w-full bg-muted rounded-full h-3'>
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {completionPercentage < 100 && (
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground font-medium'>
            Profilinizi güçlendirmek için eksik alanları tamamlayın:
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {missingItems.map((item) => (
              <div key={item.key} className='flex items-center space-x-2 text-sm'>
                <Circle className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {completionPercentage === 100 && (
        <div className='flex items-center space-x-2 text-green-600'>
          <CheckCircle2 className='h-5 w-5' />
          <span className='font-medium'>Profiliniz tamamen tamamlanmış! 🎉</span>
        </div>
      )}
    </div>
  )
}
