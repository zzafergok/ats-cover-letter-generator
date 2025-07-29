'use client'

import React, { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Zap } from 'lucide-react'

import { SkillsSection } from '@/components/ui/cv/sections/SkillsSection'
import { useUserProfileStore } from '@/store/userProfileStore'
import { ATSFormData } from '@/types/form.types'

interface SkillsStepProps {
  form: UseFormReturn<ATSFormData>
}

export function SkillsStep({ form }: SkillsStepProps) {
  const { profile, getProfile } = useUserProfileStore()
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form

  // Auto-populate skills from profile
  useEffect(() => {
    if (!profile) {
      getProfile()
      return
    }

    // Fill skills from profile
    if (profile.skills?.length > 0) {
      const technicalSkills = profile.skills.map((skill) => ({
        category: skill.category || 'Genel',
        items: [
          {
            name: skill.name,
            proficiencyLevel: 'Intermediate' as const,
          },
        ],
      }))
      setValue('skills.technical', technicalSkills)
    }
  }, [profile, setValue, getProfile])

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Yetenekler</h3>
        <p className='text-muted-foreground'>
          Teknik yeteneklerinizi, dil becerilerinizi ve kişisel özelliklerinizi belirtin. ATS sistemleri bu bölümü
          önemle tarar.
        </p>
      </div>

      <SkillsSection register={register} errors={errors} watch={watch} setValue={setValue} getValues={getValues} />

      <div className='bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center'>
              <Zap className='h-4 w-4 text-orange-600 dark:text-orange-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-orange-800 dark:text-orange-200'>Yetenek Seçimi İpuçları</h4>
            <ul className='text-xs text-orange-700 dark:text-orange-300 space-y-1'>
              <li>• İş ilanındaki gereksinimlere uygun yetenekleri önceliklendir</li>
              <li>• Seviye belirtirken gerçekçi ol</li>
              <li>• Güncel teknolojileri ve araçları ekle</li>
              <li>• Sektör standartlarını kullan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
