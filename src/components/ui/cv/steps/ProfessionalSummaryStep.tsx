'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Briefcase } from 'lucide-react'

import { ProfessionalSummarySection } from '@/components/ui/cv/sections/ProfessionalSummarySection'
import { ATSFormData } from '@/types/form.types'

interface ProfessionalSummaryStepProps {
  form: UseFormReturn<ATSFormData>
}

export function ProfessionalSummaryStep({ form }: ProfessionalSummaryStepProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Profesyonel Özet</h3>
        <p className='text-muted-foreground'>
          Kariyer hedefinizi ve temel yeteneklerinizi özetleyin. Bu bölüm ATS sistemleri tarafından önemle
          değerlendirilir.
        </p>
      </div>

      <ProfessionalSummarySection
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
      />

      <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center'>
              <Briefcase className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-yellow-800 dark:text-yellow-200'>ATS Optimizasyon İpucu</h4>
            <p className='text-xs text-yellow-700 dark:text-yellow-300'>
              Profesyonel özetinizde iş ilanında geçen anahtar kelimeleri kullanın. Sektörünüze özgü terimleri ve
              yetenekleri vurgulayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
