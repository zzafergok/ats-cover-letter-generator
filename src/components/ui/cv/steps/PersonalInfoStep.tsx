'use client'

import React, { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { User } from 'lucide-react'

import { PersonalInfoSection } from '@/components/ui/cv/sections/PersonalInfoSection'
import { useUserProfileStore } from '@/store/userProfileStore'
import { ATSFormData } from '@/types/form.types'

interface PersonalInfoStepProps {
  form: UseFormReturn<ATSFormData>
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const { profile, isLoading: profileLoading, getProfile } = useUserProfileStore()
  const {
    register,
    formState: { errors },
    setValue,
  } = form

  // Auto-populate from user profile
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

    // Fill personal information from profile
    if (profile.firstName) setValue('personalInfo.firstName', profile.firstName)
    if (profile.lastName) setValue('personalInfo.lastName', profile.lastName)
    if (profile.email) setValue('personalInfo.email', profile.email)
    if (profile.phone) setValue('personalInfo.phone', profile.phone)
    if (profile.address) setValue('personalInfo.address.street', profile.address)
    if (profile.city) setValue('personalInfo.address.city', profile.city)
    if (profile.country) setValue('personalInfo.address.country', profile.country)
    if (profile.linkedin) setValue('personalInfo.linkedIn', profile.linkedin)
    if (profile.github) setValue('personalInfo.github', profile.github)
    if (profile.portfolioWebsite) setValue('personalInfo.portfolio', profile.portfolioWebsite)
  }, [profile, setValue, getProfile])

  if (profileLoading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <div className='text-center space-y-4'>
          <User className='h-8 w-8 animate-pulse text-primary mx-auto' />
          <p className='text-muted-foreground'>Profil bilgileriniz yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Kişisel Bilgiler</h3>
        <p className='text-muted-foreground'>
          İletişim bilgilerinizi girin. Bu bilgiler otomatik olarak profilinizden doldurulmuştur.
        </p>
      </div>

      <PersonalInfoSection register={register} errors={errors} />

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center'>
              <User className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>Profil Senkronizasyonu</h4>
            <p className='text-xs text-blue-700 dark:text-blue-300'>
              Bu bilgiler otomatik olarak profil sayfanızdan alınmıştır. Değişiklik yapmak için profil sayfanızı
              güncelleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
