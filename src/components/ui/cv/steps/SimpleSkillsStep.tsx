'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Code } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'

interface CVTemplateFormData {
  skills?: string[]
  [key: string]: any
}

interface SimpleSkillsStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function SimpleSkillsStep({ form }: SimpleSkillsStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label>Yetenekler</Label>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
          {watch('skills')?.map((_, index) => (
            <div key={index} className='relative'>
              <Input {...register(`skills.${index}`)} placeholder='Yetenek ekleyin' />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                onClick={() => {
                  const current = getValues('skills') || []
                  setValue(
                    'skills',
                    current.filter((_, i) => i !== index),
                  )
                }}
              >
                ×
              </Button>
            </div>
          )) || []}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              const current = getValues('skills') || []
              setValue('skills', [...current, ''])
            }}
          >
            + Yetenek Ekle
          </Button>
        </div>
      </div>

      <div className='bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-teal-100 dark:bg-teal-800 rounded-lg flex items-center justify-center'>
              <Code className='h-4 w-4 text-teal-600 dark:text-teal-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-teal-800 dark:text-teal-200'>Yetenek İpuçları</h4>
            <ul className='text-xs text-teal-700 dark:text-teal-300 space-y-1'>
              <li>• İş tanımına uygun yetenekleri seçin</li>
              <li>• Hem teknik hem de yönetimsel yetenekleri ekleyin</li>
              <li>• Microsoft Office, proje yönetimi gibi temel yetenekleri dahil edin</li>
              <li>• Sektör standartlarını kullanın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
