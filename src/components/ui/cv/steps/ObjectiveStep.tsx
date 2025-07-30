'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FileText } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'

interface CVTemplateFormData {
  objective?: string
  [key: string]: any
}

interface ObjectiveStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function ObjectiveStep({ form }: ObjectiveStepProps) {
  const { register } = form

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2 flex items-center gap-2'>
          <FileText className='h-5 w-5 text-primary' />
          Kariyer Hedefi
        </h3>
        <p className='text-muted-foreground'>
          Kariyer hedefinizi ve profesyonel özetinizi yazın. Bu bölüm isteğe bağlıdır.
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <Label htmlFor='objective'>Kariyer Hedefi</Label>
          <Textarea
            id='objective'
            {...register('objective')}
            placeholder='Kariyer hedefinizi ve profesyonel özetinizi yazın...'
            rows={4}
          />
        </div>
      </div>

      <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center'>
              <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-purple-800 dark:text-purple-200'>Kariyer Hedefi İpuçları</h4>
            <ul className='text-xs text-purple-700 dark:text-purple-300 space-y-1'>
              <li>• Kısa ve öz olarak yazın (2-3 cümle yeterli)</li>
              <li>• Hedeflediğiniz pozisyonu ve sektörü belirtin</li>
              <li>• Deneyiminizi ve uzmanlık alanlarınızı vurgulayın</li>
              <li>• Şirkete nasıl değer katacağınızı ifade edin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
