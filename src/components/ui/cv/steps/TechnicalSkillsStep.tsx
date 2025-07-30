'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Code } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'

interface CVTemplateFormData {
  technicalSkills?: {
    frontend?: string[]
    backend?: string[]
    database?: string[]
    tools?: string[]
  }
  [key: string]: any
}

interface TechnicalSkillsStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function TechnicalSkillsStep({ form }: TechnicalSkillsStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2 flex items-center gap-2'>
          <Code className='h-5 w-5 text-primary' />
          Teknik Yetenekler
        </h3>
        <p className='text-muted-foreground'>
          Teknik becerilerinizi kategoriler halinde listeleyin. Turkey template'leri için detaylı yetenek bölümü.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Frontend Skills */}
        <div>
          <Label className='text-base font-medium'>Frontend</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
            {watch('technicalSkills.frontend')?.map((_, index) => (
              <div key={index} className='relative'>
                <Input {...register(`technicalSkills.frontend.${index}`)} placeholder='Frontend teknoloji' />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                  onClick={() => {
                    const current = getValues('technicalSkills.frontend') || []
                    setValue(
                      'technicalSkills.frontend',
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
                const current = getValues('technicalSkills.frontend') || []
                setValue('technicalSkills.frontend', [...current, ''])
              }}
            >
              + Frontend Ekle
            </Button>
          </div>
        </div>

        {/* Backend Skills */}
        <div>
          <Label className='text-base font-medium'>Backend</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
            {watch('technicalSkills.backend')?.map((_, index) => (
              <div key={index} className='relative'>
                <Input {...register(`technicalSkills.backend.${index}`)} placeholder='Backend teknoloji' />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                  onClick={() => {
                    const current = getValues('technicalSkills.backend') || []
                    setValue(
                      'technicalSkills.backend',
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
                const current = getValues('technicalSkills.backend') || []
                setValue('technicalSkills.backend', [...current, ''])
              }}
            >
              + Backend Ekle
            </Button>
          </div>
        </div>

        {/* Database Skills */}
        <div>
          <Label className='text-base font-medium'>Database</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
            {watch('technicalSkills.database')?.map((_, index) => (
              <div key={index} className='relative'>
                <Input {...register(`technicalSkills.database.${index}`)} placeholder='Veritabanı teknolojisi' />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                  onClick={() => {
                    const current = getValues('technicalSkills.database') || []
                    setValue(
                      'technicalSkills.database',
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
                const current = getValues('technicalSkills.database') || []
                setValue('technicalSkills.database', [...current, ''])
              }}
            >
              + Database Ekle
            </Button>
          </div>
        </div>

        {/* Tools Skills */}
        <div>
          <Label className='text-base font-medium'>Tools</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
            {watch('technicalSkills.tools')?.map((_, index) => (
              <div key={index} className='relative'>
                <Input {...register(`technicalSkills.tools.${index}`)} placeholder='Araç ve teknoloji' />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                  onClick={() => {
                    const current = getValues('technicalSkills.tools') || []
                    setValue(
                      'technicalSkills.tools',
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
                const current = getValues('technicalSkills.tools') || []
                setValue('technicalSkills.tools', [...current, ''])
              }}
            >
              + Tool Ekle
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-cyan-100 dark:bg-cyan-800 rounded-lg flex items-center justify-center'>
              <Code className='h-4 w-4 text-cyan-600 dark:text-cyan-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-cyan-800 dark:text-cyan-200'>Teknik Yetenek İpuçları</h4>
            <ul className='text-xs text-cyan-700 dark:text-cyan-300 space-y-1'>
              <li>• İş ilanındaki teknolojileri önceliklendir</li>
              <li>• Güncel framework ve araçları ekle</li>
              <li>• Her kategoride en bildiğiniz teknolojileri listele</li>
              <li>• Sektör standartlarına uygun terimleri kullan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}