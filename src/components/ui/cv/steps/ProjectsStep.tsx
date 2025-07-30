'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FolderOpen } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Textarea } from '@/components/core/textarea'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'

interface CVTemplateFormData {
  projects?: Array<{
    name: string
    description?: string
    technologies?: string[]
  }>
  [key: string]: any
}

interface ProjectsStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function ProjectsStep({ form }: ProjectsStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label>Projeler</Label>
        <div className='space-y-4'>
          {watch('projects')?.map((_, index) => (
            <Card key={index} className='p-4'>
              <div className='space-y-3'>
                <div>
                  <Label>Proje Adı</Label>
                  <Input {...register(`projects.${index}.name`)} placeholder='Proje adı' />
                </div>
                <div>
                  <Label>Proje Açıklaması</Label>
                  <Textarea {...register(`projects.${index}.description`)} placeholder='Proje açıklaması' rows={2} />
                </div>
                <div className='space-y-2'>
                  <Label className='text-sm'>Teknolojiler</Label>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                    {watch(`projects.${index}.technologies`)?.map((_, techIndex) => (
                      <div key={techIndex} className='relative'>
                        <Input {...register(`projects.${index}.technologies.${techIndex}`)} placeholder='Teknoloji' />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white'
                          onClick={() => {
                            const current = getValues(`projects.${index}.technologies`) || []
                            setValue(
                              `projects.${index}.technologies`,
                              current.filter((_, i) => i !== techIndex),
                            )
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    )) || []}
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const current = getValues(`projects.${index}.technologies`) || []
                      setValue(`projects.${index}.technologies`, [...current, ''])
                    }}
                  >
                    + Teknoloji Ekle
                  </Button>
                </div>
              </div>
            </Card>
          )) || []}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              const current = getValues('projects') || []
              setValue('projects', [...current, { name: '', description: '', technologies: [''] }])
            }}
          >
            + Proje Ekle
          </Button>
        </div>
      </div>

      <div className='bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center'>
              <FolderOpen className='h-4 w-4 text-orange-600 dark:text-orange-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-orange-800 dark:text-orange-200'>Proje İpuçları</h4>
            <ul className='text-xs text-orange-700 dark:text-orange-300 space-y-1'>
              <li>• En önemli ve güncel projelerinizi seçin</li>
              <li>• Başarılarınızı ve katkılarınızı vurgulayın</li>
              <li>• Kullanılan teknolojileri detaylandırın</li>
              <li>• Mümkünse proje linklerini ekleyin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
