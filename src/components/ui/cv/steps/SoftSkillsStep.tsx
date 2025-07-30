'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Users } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'

interface CVTemplateFormData {
  communication?: string
  leadership?: string
  [key: string]: any
}

interface SoftSkillsStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function SoftSkillsStep({ form }: SoftSkillsStepProps) {
  const { register } = form

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <Label htmlFor='communication'>İletişim Becerileri</Label>
          <Textarea
            id='communication'
            {...register('communication')}
            placeholder='İletişim becerilerinizi açıklayın...'
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor='leadership'>Liderlik Becerileri</Label>
          <Textarea
            id='leadership'
            {...register('leadership')}
            placeholder='Liderlik deneyimlerinizi açıklayın...'
            rows={3}
          />
        </div>
      </div>

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center'>
              <Users className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>Soft Skills İpuçları</h4>
            <ul className='text-xs text-blue-700 dark:text-blue-300 space-y-1'>
              <li>• Konkret örnekler vererek destekleyin</li>
              <li>• Takım çalışması deneyimlerinizi vurgulayın</li>
              <li>• Problem çözme yeteneklerinizi belirtin</li>
              <li>• Müşteri ilişkileri ve sunum deneyiminizi ekleyin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
