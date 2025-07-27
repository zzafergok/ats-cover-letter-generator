'use client'

import React from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { FileText, Plus, X } from 'lucide-react'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { ATSFormData } from '@/types/form.types'

interface ProfessionalSummarySectionProps {
  register: UseFormRegister<ATSFormData>
  errors: FieldErrors<ATSFormData>
  watch: UseFormWatch<ATSFormData>
  setValue: UseFormSetValue<ATSFormData>
  getValues: UseFormGetValues<ATSFormData>
}

export function ProfessionalSummarySection({
  register,
  errors,
  watch,
  setValue,
  getValues,
}: ProfessionalSummarySectionProps) {
  const keySkills = watch('professionalSummary.keySkills') || []
  const summaryText = watch('professionalSummary.summary') || ''

  const addKeySkill = () => {
    const current = getValues('professionalSummary.keySkills')
    setValue('professionalSummary.keySkills', [...current, ''])
  }

  const removeKeySkill = (index: number) => {
    const current = getValues('professionalSummary.keySkills')
    if (current.length > 3) {
      setValue(
        'professionalSummary.keySkills',
        current.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='h-5 w-5' />
          Profesyonel Özet
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='targetPosition'>Hedef Pozisyon *</Label>
            <Input
              id='targetPosition'
              {...register('professionalSummary.targetPosition')}
              placeholder='Örn: Senior Full Stack Developer'
              className={errors.professionalSummary?.targetPosition ? 'border-red-500' : ''}
            />
            {errors.professionalSummary?.targetPosition && (
              <p className='text-sm text-red-500 mt-1'>{errors.professionalSummary?.targetPosition?.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='yearsOfExperience'>Deneyim Yılı *</Label>
            <Input
              id='yearsOfExperience'
              type='number'
              min='0'
              max='50'
              {...register('professionalSummary.yearsOfExperience', { valueAsNumber: true })}
              className={errors.professionalSummary?.yearsOfExperience ? 'border-red-500' : ''}
            />
            {errors.professionalSummary?.yearsOfExperience && (
              <p className='text-sm text-red-500 mt-1'>{errors.professionalSummary?.yearsOfExperience?.message}</p>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='summary'>Profesyonel Özet *</Label>
          <div className='relative'>
            <Textarea
              id='summary'
              {...register('professionalSummary.summary')}
              placeholder='Kendinizi ve profesyonel hedeflerinizi kısaca açıklayın...'
              rows={4}
              className={errors.professionalSummary?.summary ? 'border-red-500' : ''}
              maxLength={500}
            />
            <div className='absolute bottom-2 left-3 text-xs text-muted-foreground'>
              {summaryText.length}/500 karakter
            </div>
          </div>
          {errors.professionalSummary?.summary && (
            <p className='text-sm text-red-500 mt-1'>{errors.professionalSummary?.summary?.message}</p>
          )}
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label className='text-base font-medium'>
              Anahtar Yetenekler * <span className='text-xs text-muted-foreground'>(En az 3 adet gerekli)</span>
            </Label>
            <Button type='button' variant='outline' size='sm' onClick={addKeySkill}>
              <Plus className='h-4 w-4 mr-2' />
              Ekle
            </Button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {keySkills.map((_, index) => (
              <div key={index} className='flex gap-2'>
                <Input
                  placeholder='React, Node.js, Python...'
                  {...register(`professionalSummary.keySkills.${index}`)}
                />
                {keySkills.length > 3 && (
                  <Button type='button' variant='outline' size='sm' onClick={() => removeKeySkill(index)}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.professionalSummary?.keySkills && (
            <p className='text-sm text-red-500'>{errors.professionalSummary?.keySkills?.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
