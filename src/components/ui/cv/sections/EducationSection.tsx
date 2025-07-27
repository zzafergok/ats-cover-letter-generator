'use client'

import React from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { GraduationCap, Plus, X } from 'lucide-react'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { MonthYearPicker } from '@/components/core/month-year-picker'
import { FormError } from '@/components/core/form-error'
import { ATSFormData } from '@/types/form.types'

interface EducationSectionProps {
  register: UseFormRegister<ATSFormData>
  errors: FieldErrors<ATSFormData>
  watch: UseFormWatch<ATSFormData>
  setValue: UseFormSetValue<ATSFormData>
  getValues: UseFormGetValues<ATSFormData>
}

export function EducationSection({ register, errors, watch, setValue, getValues }: EducationSectionProps) {
  const education = watch('education') || []

  const addEducation = () => {
    const current = getValues('education')
    setValue('education', [
      ...current,
      {
        id: '',
        degree: '',
        fieldOfStudy: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
      },
    ])
  }

  const removeEducation = (index: number) => {
    const current = getValues('education')
    if (current.length > 1) {
      setValue(
        'education',
        current.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <GraduationCap className='h-5 w-5' />
            Eğitim
          </div>
          <Button type='button' variant='outline' size='sm' onClick={addEducation}>
            <Plus className='h-4 w-4 mr-2' />
            Eğitim Ekle
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {education.map((edu, index) => (
          <div key={index} className='border rounded-lg p-4 space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='font-medium'>Eğitim #{index + 1}</h4>
              {education.length > 1 && (
                <Button type='button' variant='outline' size='sm' onClick={() => removeEducation(index)}>
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
              <div className='flex flex-col gap-2'>
                <Label>Derece *</Label>
                <Input
                  {...register(`education.${index}.degree`)}
                  placeholder='Lisans, Yüksek Lisans, Doktora...'
                  className={errors.education?.[index]?.degree ? 'border-destructive' : ''}
                />
                <FormError message={errors.education?.[index]?.degree?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Bölüm *</Label>
                <Input
                  {...register(`education.${index}.fieldOfStudy`)}
                  placeholder='Bilgisayar Mühendisliği, İşletme...'
                  className={errors.education?.[index]?.fieldOfStudy ? 'border-destructive' : ''}
                />
                <FormError message={errors.education?.[index]?.fieldOfStudy?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Okul/Üniversite *</Label>
                <Input
                  {...register(`education.${index}.institution`)}
                  placeholder='İstanbul Teknik Üniversitesi'
                  className={errors.education?.[index]?.institution ? 'border-destructive' : ''}
                />
                <FormError message={errors.education?.[index]?.institution?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Konum *</Label>
                <Input
                  {...register(`education.${index}.location`)}
                  placeholder='İstanbul, Türkiye'
                  className={errors.education?.[index]?.location ? 'border-destructive' : ''}
                />
                <FormError message={errors.education?.[index]?.location?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Başlangıç Tarihi *</Label>
                <MonthYearPicker
                  value={watch(`education.${index}.startDate`) || ''}
                  onChange={(value) => setValue(`education.${index}.startDate`, value || '')}
                />
                <FormError message={errors.education?.[index]?.startDate?.message} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Bitiş Tarihi</Label>
                <MonthYearPicker
                  value={watch(`education.${index}.endDate`) || ''}
                  onChange={(value) => setValue(`education.${index}.endDate`, value || '')}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Not Ortalaması (GPA)</Label>
                <Input
                  type='number'
                  step='0.01'
                  min='0'
                  max='4'
                  {...register(`education.${index}.gpa`, { valueAsNumber: true })}
                  placeholder='3.45'
                />
              </div>
            </div>
          </div>
        ))}
        <FormError message={errors.education?.message} />
      </CardContent>
    </Card>
  )
}
