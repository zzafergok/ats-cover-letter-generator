'use client'

import React, { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { GraduationCap } from 'lucide-react'

import { EducationSection } from '@/components/ui/cv/sections/EducationSection'
import { useUserProfileStore } from '@/store/userProfileStore'
import { ATSFormData } from '@/types/form.types'

interface EducationStepProps {
  form: UseFormReturn<ATSFormData>
}

export function EducationStep({ form }: EducationStepProps) {
  const { profile, getProfile } = useUserProfileStore()
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form

  // Auto-populate education from profile
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

    // Fill education from profile
    if (profile.educations?.length > 0) {
      const formattedEducations = profile.educations.map((edu) => ({
        id: edu.id,
        institution: edu.schoolName,
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        location: '',
        startDate: `${edu.startYear}-01-01`,
        endDate: edu.isCurrent ? '' : `${edu.endYear}-12-31`,
      }))
      setValue('education', formattedEducations)
    }
  }, [profile, setValue, getProfile])

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Eğitim Bilgileri</h3>
        <p className='text-muted-foreground'>
          Eğitim geçmişinizi en yeniden eskiye doğru sıralayın. İlgili dersleri ve başarıları belirtin.
        </p>
      </div>

      <EducationSection register={register} errors={errors} watch={watch} setValue={setValue} getValues={getValues} />

      <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center'>
              <GraduationCap className='h-4 w-4 text-purple-600 dark:text-purple-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-purple-800 dark:text-purple-200'>Eğitim Optimizasyon İpucu</h4>
            <p className='text-xs text-purple-700 dark:text-purple-300'>
              Pozisyonla ilgili dersleri ve projeleri vurgulayın. GPA'nizi yalnızca 3.5 ve üzerindeyse belirtin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
