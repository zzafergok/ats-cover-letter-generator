'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Languages } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

interface CVTemplateFormData {
  languages?: Array<{
    language: string
    level: string
  }>
  [key: string]: any
}

interface LanguagesStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function LanguagesStep({ form }: LanguagesStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2 flex items-center gap-2'>
          <Languages className='h-5 w-5 text-primary' />
          Diller
        </h3>
        <p className='text-muted-foreground'>
          Yabancı dil bilginizi ekleyin. Çok uluslu şirketler için önemli bir avantajdır.
        </p>
      </div>

      <div className='space-y-4'>
        <Label>Diller</Label>
        <div className='space-y-4'>
          {watch('languages')?.map((_, index) => (
            <Card key={index} className='p-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <Label>Dil</Label>
                  <Input {...register(`languages.${index}.language`)} placeholder='Dil' />
                </div>
                <div>
                  <Label>Seviye</Label>
                  <Select
                    value={watch(`languages.${index}.level`)}
                    onValueChange={(value) => setValue(`languages.${index}.level`, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seviye' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Beginner'>Beginner</SelectItem>
                      <SelectItem value='Intermediate'>Intermediate</SelectItem>
                      <SelectItem value='Advanced'>Advanced</SelectItem>
                      <SelectItem value='Native'>Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )) || []}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              const current = getValues('languages') || []
              setValue('languages', [...current, { language: '', level: '' }])
            }}
          >
            + Dil Ekle
          </Button>
        </div>
      </div>

      <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center'>
              <Languages className='h-4 w-4 text-purple-600 dark:text-purple-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-purple-800 dark:text-purple-200'>Dil Seviyesi Rehberi</h4>
            <ul className='text-xs text-purple-700 dark:text-purple-300 space-y-1'>
              <li>
                • <strong>Beginner:</strong> Temel kelimeler ve basit cümleler
              </li>
              <li>
                • <strong>Intermediate:</strong> Günlük konuşma ve okuma
              </li>
              <li>
                • <strong>Advanced:</strong> İş hayatında rahatça kullanım
              </li>
              <li>
                • <strong>Native:</strong> Ana dil seviyesi
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
