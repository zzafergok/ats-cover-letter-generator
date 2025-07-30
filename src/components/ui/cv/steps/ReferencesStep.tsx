'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Users } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'

interface CVTemplateFormData {
  references?: Array<{
    name?: string
    company?: string
    contact?: string
  }>
  [key: string]: any
}

interface ReferencesStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function ReferencesStep({ form }: ReferencesStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2 flex items-center gap-2'>
          <Users className='h-5 w-5 text-primary' />
          Referanslar
        </h3>
        <p className='text-muted-foreground'>
          İş referanslarınızı ekleyin. Bu bölüm isteğe bağlıdır ancak güvenilirliğinizi artırır.
        </p>
      </div>

      <div className='space-y-4'>
        <Label>Referanslar</Label>
        <div className='space-y-4'>
          {watch('references')?.map((_, index) => (
            <Card key={index} className='p-4'>
              <div className='space-y-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <Label>İsim</Label>
                    <Input {...register(`references.${index}.name`)} placeholder='Referans kişi adı' />
                  </div>
                  <div>
                    <Label>Şirket</Label>
                    <Input {...register(`references.${index}.company`)} placeholder='Şirket adı' />
                  </div>
                </div>
                <div>
                  <Label>İletişim</Label>
                  <Input {...register(`references.${index}.contact`)} placeholder='Email | Telefon' />
                </div>
              </div>
            </Card>
          )) || []}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              const current = getValues('references') || []
              setValue('references', [...current, { name: '', company: '', contact: '' }])
            }}
          >
            + Referans Ekle
          </Button>
        </div>
      </div>

      <div className='bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center'>
              <Users className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-indigo-800 dark:text-indigo-200'>Referans İpuçları</h4>
            <ul className='text-xs text-indigo-700 dark:text-indigo-300 space-y-1'>
              <li>• Önceki yöneticilerinizi veya iş arkadaşlarınızı ekleyin</li>
              <li>• Referans vermeden önce izin alın</li>
              <li>• Güncel iletişim bilgilerini kontrol edin</li>
              <li>• Sizi iyi tanıyan kişileri seçin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
