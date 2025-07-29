'use client'

import React, { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Briefcase } from 'lucide-react'

import { WorkExperienceSection } from '@/components/ui/cv/sections/WorkExperienceSection'
import { useUserProfileStore } from '@/store/userProfileStore'
import { ATSFormData } from '@/types/form.types'

interface WorkExperienceStepProps {
  form: UseFormReturn<ATSFormData>
}

export function WorkExperienceStep({ form }: WorkExperienceStepProps) {
  const { profile, getProfile } = useUserProfileStore()
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form

  // Auto-populate work experience from profile
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

    // Fill work experience from profile
    if (profile.experiences?.length > 0) {
      const formattedExperiences = profile.experiences.map((exp) => ({
        id: exp.id,
        companyName: exp.companyName,
        position: exp.position,
        location: exp.location || '',
        startDate: `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}-01`,
        endDate: exp.isCurrent ? '' : `${exp.endYear}-${String(exp.endMonth).padStart(2, '0')}-01`,
        isCurrentRole: exp.isCurrent,
        achievements: Array.isArray(exp.achievements) ? exp.achievements : exp.achievements ? [exp.achievements] : [''],
      }))
      setValue('workExperience', formattedExperiences)
    }
  }, [profile, setValue, getProfile])

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>İş Deneyimi</h3>
        <p className='text-muted-foreground'>
          Çalışma geçmişinizi en yeniden eski sıraya göre ekleyin. Başarılarınızı sayısal verilerle destekleyin.
        </p>
      </div>

      <WorkExperienceSection
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
      />

      <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center'>
              <Briefcase className='h-4 w-4 text-green-600 dark:text-green-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-green-800 dark:text-green-200'>Başarı Yazma İpuçları</h4>
            <ul className='text-xs text-green-700 dark:text-green-300 space-y-1'>
              <li>• Sayısal veriler kullanın (örn: "%30 artış sağladım")</li>
              <li>• Etkin fiillerle başlayın (Geliştirdim, Yönettim, Optimize ettim)</li>
              <li>• İş tanımındaki anahtar kelimeleri kullanın</li>
              <li>• Somut sonuçlarınızı vurgulayın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
