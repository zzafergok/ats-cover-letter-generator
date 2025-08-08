'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Briefcase, X } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Textarea } from '@/components/core/textarea'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'
import { MonthYearPicker } from '@/components/core/month-year-picker'
import { Checkbox } from '@/components/core/checkbox'

interface CVTemplateFormData {
  experience?: Array<{
    jobTitle: string
    company: string
    location?: string
    startDate: string
    endDate?: string
    description?: string
    isCurrent?: boolean
  }>
  [key: string]: any
}

interface CVWorkExperienceStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function CVWorkExperienceStep({ form }: CVWorkExperienceStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label>İş Deneyimi</Label>
        <div
          className={`grid ${(watch('experience')?.length || 0) > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}
        >
          {watch('experience')?.map((_, index) => (
            <Card key={index} className='p-4'>
              <div className='flex justify-between items-center mb-3'>
                <h4 className='font-medium text-sm text-muted-foreground'>Deneyim {index + 1}</h4>
                {(watch('experience')?.length || 0) > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const current = getValues('experience') || []
                      const updated = current.filter((_, i) => i !== index)
                      setValue('experience', updated)
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
                    <Label>İş Unvanı</Label>
                    <Input {...register(`experience.${index}.jobTitle`)} placeholder='İş unvanı' />
                  </div>
                  <div>
                    <Label>Şirket Adı</Label>
                    <Input {...register(`experience.${index}.company`)} placeholder='Şirket adı' />
                  </div>
                  <div>
                    <Label>Lokasyon</Label>
                    <Input {...register(`experience.${index}.location`)} placeholder='İstanbul, Türkiye' />
                  </div>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Başlangıç Tarihi</Label>
                        <MonthYearPicker
                          value={(() => {
                            const dateValue = watch(`experience.${index}.startDate`)
                            if (dateValue && dateValue !== '' && dateValue.includes('-') && dateValue.length >= 7) {
                              return dateValue
                            }
                            return undefined
                          })()}
                          onChange={(value) => setValue(`experience.${index}.startDate`, value || '')}
                          placeholder='Başlangıç tarihi'
                          clearable={false}
                        />
                      </div>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Bitiş Tarihi</Label>
                        <MonthYearPicker
                          value={(() => {
                            const dateValue = watch(`experience.${index}.endDate`)
                            const isCurrent = watch(`experience.${index}.isCurrent`)
                            if (isCurrent) return undefined
                            if (dateValue && dateValue !== '' && dateValue.includes('-') && dateValue.length >= 7) {
                              return dateValue
                            }
                            return undefined
                          })()}
                          onChange={(value) => setValue(`experience.${index}.endDate`, value || '')}
                          placeholder='Bitiş tarihi'
                          clearable={true}
                          disabled={watch(`experience.${index}.isCurrent`)}
                        />
                      </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id={`experience-${index}-current`}
                        checked={watch(`experience.${index}.isCurrent`) || false}
                        onCheckedChange={(checked) => {
                          setValue(`experience.${index}.isCurrent`, !!checked)
                          if (checked) {
                            setValue(`experience.${index}.endDate`, '')
                          }
                        }}
                      />
                      <Label htmlFor={`experience-${index}-current`} className='text-sm font-normal cursor-pointer'>
                        Halen burada çalışıyorum
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>İş Tanımı</Label>
                  <Textarea
                    {...register(`experience.${index}.description`)}
                    placeholder='İş tanımı, sorumluluklarınız ve başarılarınız...'
                    rows={3}
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
            const current = getValues('experience') || []
            setValue('experience', [
              ...current,
              {
                jobTitle: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                description: '',
                isCurrent: false,
              },
            ])
          }}
        >
          + Deneyim Ekle
        </Button>
      </div>

      <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center'>
              <Briefcase className='h-4 w-4 text-green-600 dark:text-green-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-green-800 dark:text-green-200'>İş Deneyimi İpuçları</h4>
            <ul className='text-xs text-green-700 dark:text-green-300 space-y-1'>
              <li>• En güncel pozisyonunuzdan başlayarak kronolojik sırayla ekleyin</li>
              <li>• Başarılarınızı sayısal verilerle destekleyin</li>
              <li>• İş tanımında eylem fiilleri kullanın (yönetti, geliştirdi, artırdı)</li>
              <li>• İlgili teknolojileri ve yetenekleri vurgulayın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
