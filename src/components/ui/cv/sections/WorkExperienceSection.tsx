'use client'

import React from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { Briefcase, Plus, X } from 'lucide-react'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { MonthYearPicker } from '@/components/core/month-year-picker'
import { FormError } from '@/components/core/form-error'
import { ATSFormData } from '@/types/form.types'

interface WorkExperienceSectionProps {
  register: UseFormRegister<ATSFormData>
  errors: FieldErrors<ATSFormData>
  watch: UseFormWatch<ATSFormData>
  setValue: UseFormSetValue<ATSFormData>
  getValues: UseFormGetValues<ATSFormData>
}

export function WorkExperienceSection({ register, errors, watch, setValue, getValues }: WorkExperienceSectionProps) {
  const workExperience = watch('workExperience') || []

  const addWorkExperience = () => {
    const current = getValues('workExperience')
    setValue('workExperience', [
      ...current,
      {
        id: '',
        position: '',
        companyName: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        achievements: ['', ''],
      },
    ])
  }

  const removeWorkExperience = (index: number) => {
    const current = getValues('workExperience')
    if (current.length > 1) {
      setValue(
        'workExperience',
        current.filter((_, i) => i !== index),
      )
    }
  }

  const addAchievement = (expIndex: number) => {
    const current = getValues('workExperience')
    const updatedExperience = [...current]
    updatedExperience[expIndex].achievements.push('')
    setValue('workExperience', updatedExperience)
  }

  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const current = getValues('workExperience')
    const updatedExperience = [...current]
    if (updatedExperience[expIndex].achievements.length > 2) {
      updatedExperience[expIndex].achievements = updatedExperience[expIndex].achievements.filter(
        (_, i) => i !== achievementIndex,
      )
      setValue('workExperience', updatedExperience)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Briefcase className='h-5 w-5' />
            İş Deneyimi
          </div>
          <Button type='button' variant='outline' size='sm' onClick={addWorkExperience}>
            <Plus className='h-4 w-4 mr-2' />
            Deneyim Ekle
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {workExperience.map((exp, index) => (
          <div key={index} className='border rounded-lg p-4 space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='font-medium'>İş Deneyimi #{index + 1}</h4>
              {workExperience.length > 1 && (
                <Button type='button' variant='outline' size='sm' onClick={() => removeWorkExperience(index)}>
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
              <div className='flex flex-col gap-2'>
                <Label>Pozisyon *</Label>
                <Input
                  {...register(`workExperience.${index}.position`)}
                  placeholder='Senior Software Developer'
                  className={errors.workExperience?.[index]?.position ? 'border-destructive' : ''}
                />
                <FormError message={errors.workExperience?.[index]?.position?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Şirket Adı *</Label>
                <Input
                  {...register(`workExperience.${index}.companyName`)}
                  placeholder='ABC Technology'
                  className={errors.workExperience?.[index]?.companyName ? 'border-destructive' : ''}
                />
                <FormError message={errors.workExperience?.[index]?.companyName?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Konum *</Label>
                <Input
                  {...register(`workExperience.${index}.location`)}
                  placeholder='İstanbul, Türkiye'
                  className={errors.workExperience?.[index]?.location ? 'border-destructive' : ''}
                />
                <FormError message={errors.workExperience?.[index]?.location?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Başlangıç Tarihi *</Label>
                <MonthYearPicker
                  value={watch(`workExperience.${index}.startDate`) || ''}
                  onChange={(value) => setValue(`workExperience.${index}.startDate`, value || '')}
                />
                <FormError message={errors.workExperience?.[index]?.startDate?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Bitiş Tarihi</Label>
                <MonthYearPicker
                  value={watch(`workExperience.${index}.endDate`) || ''}
                  onChange={(value) => setValue(`workExperience.${index}.endDate`, value || '')}
                  disabled={watch(`workExperience.${index}.isCurrentRole`)}
                />
              </div>

              <div className='flex items-center space-x-2'>
                <input type='checkbox' id={`current-${index}`} {...register(`workExperience.${index}.isCurrentRole`)} />
                <Label htmlFor={`current-${index}`}>Halen çalışıyorum</Label>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label>Teknolojiler</Label>
              <Input
                {...register(`workExperience.${index}.technologies`)}
                placeholder='React, Node.js, MongoDB, Docker...'
              />
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-base font-medium'>
                  Başarılar ve Sorumluluklar *{' '}
                  <span className='text-xs text-muted-foreground'>(En az 1 adet gerekli)</span>
                </Label>
                <Button type='button' variant='outline' size='sm' onClick={() => addAchievement(index)}>
                  <Plus className='h-4 w-4 mr-2' />
                  Ekle
                </Button>
              </div>
              <div className='space-y-2'>
                {exp.achievements?.map((_, achievementIndex) => (
                  <div key={achievementIndex} className='flex gap-2 w-full'>
                    <Textarea
                      {...register(`workExperience.${index}.achievements.${achievementIndex}`)}
                      placeholder='Proje yönetimi ve ekip liderliği yaparak 15 kişilik geliştirme ekibini yönettim...'
                      rows={2}
                      className='flex w-full'
                    />
                    {exp.achievements.length > 1 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeAchievement(index, achievementIndex)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.workExperience?.[index]?.achievements && (
                <FormError message={errors.workExperience?.[index]?.achievements?.message} />
              )}
            </div>
          </div>
        ))}
        <FormError message={errors.workExperience?.message} />
      </CardContent>
    </Card>
  )
}
