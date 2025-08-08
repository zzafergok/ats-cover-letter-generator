'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { GraduationCap, X } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Textarea } from '@/components/core/textarea'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'
import { MonthYearPicker } from '@/components/core/month-year-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

interface CVTemplateFormData {
  education?: Array<{
    degree: string
    university: string
    field: string
    location?: string
    startDate: string
    graduationDate: string
    details?: string
  }>
  [key: string]: any
}

interface CVEducationStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

const degreeOptions = [
  { value: 'Lise Diploması', label: 'Lise Diploması' },
  { value: 'Ön Lisans', label: 'Ön Lisans' },
  { value: 'Lisans', label: 'Lisans' },
  { value: 'Yüksek Lisans', label: 'Yüksek Lisans' },
]

export function CVEducationStep({ form }: CVEducationStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label>Eğitim</Label>
        <div
          className={`grid ${(watch('education')?.length || 0) > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}
        >
          {watch('education')?.map((_, index) => (
            <Card key={index} className='p-4'>
              <div className='flex justify-between items-center mb-3'>
                <h4 className='font-medium text-sm text-muted-foreground'>Eğitim {index + 1}</h4>
                {(watch('education')?.length || 0) > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const current = getValues('education') || []
                      const updated = current.filter((_, i) => i !== index)
                      setValue('education', updated)
                    }}
                    className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
              <div className='space-y-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <Label>Derece</Label>
                    <Select
                      value={watch(`education.${index}.degree`) || ''}
                      onValueChange={(value) => setValue(`education.${index}.degree`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Derece seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        {degreeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Üniversite</Label>
                    <Input {...register(`education.${index}.university`)} placeholder='Üniversite adı' />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <Label>Bölüm</Label>
                    <Input {...register(`education.${index}.field`)} placeholder='Bilgisayar Mühendisliği' />
                  </div>
                  <div>
                    <Label>Lokasyon</Label>
                    <Input {...register(`education.${index}.location`)} placeholder='İstanbul, Türkiye' />
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Başlangıç Tarihi</Label>
                      <MonthYearPicker
                        value={(() => {
                          const dateValue = watch(`education.${index}.startDate`)
                          if (dateValue && dateValue !== '' && dateValue.includes('-') && dateValue.length >= 7) {
                            return dateValue
                          }
                          return undefined
                        })()}
                        onChange={(value) => setValue(`education.${index}.startDate`, value || '')}
                        placeholder='Başlangıç tarihi'
                        clearable={false}
                      />
                    </div>
                    <div>
                      <Label className='text-xs text-muted-foreground'>Mezuniyet Tarihi</Label>
                      <MonthYearPicker
                        value={(() => {
                          const dateValue = watch(`education.${index}.graduationDate`)
                          if (dateValue && dateValue !== '' && dateValue.includes('-') && dateValue.length >= 7) {
                            return dateValue
                          }
                          return undefined
                        })()}
                        onChange={(value) => setValue(`education.${index}.graduationDate`, value || '')}
                        placeholder='Mezuniyet tarihi'
                        clearable={false}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Detaylar</Label>
                  <Textarea
                    {...register(`education.${index}.details`)}
                    placeholder='GPA, bölüm, ödüller, alakalı dersler...'
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          )) || []}
        </div>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => {
            const current = getValues('education') || []
            setValue('education', [
              ...current,
              {
                degree: '',
                university: '',
                field: '',
                location: '',
                startDate: '',
                graduationDate: '',
                details: '',
              },
            ])
          }}
        >
          + Eğitim Ekle
        </Button>
      </div>

      <div className='bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center'>
              <GraduationCap className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-indigo-800 dark:text-indigo-200'>Eğitim İpuçları</h4>
            <ul className='text-xs text-indigo-700 dark:text-indigo-300 space-y-1'>
              <li>• En güncel eğitiminizden başlayarak sıralayın</li>
              <li>• GPA'nız yüksekse (3.5+) belirtmeyi unutmayın</li>
              <li>• İş ile alakalı dersleri ve projeleri vurgulayın</li>
              <li>• Aldığınız ödülleri ve başarıları ekleyin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
