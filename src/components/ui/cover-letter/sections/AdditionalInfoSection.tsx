'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FileText } from 'lucide-react'
import { Textarea } from '@/components/core/textarea'
import { Form } from '@/components/form/Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

interface AdditionalInfoSectionProps {
  form: UseFormReturn<any>
  disabled?: boolean
}

export function AdditionalInfoSection({ form: _, disabled = false }: AdditionalInfoSectionProps) {
  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
            <FileText className='w-4 h-4 text-primary' />
          </div>
          <CardTitle className='text-lg'>Ek Bilgiler</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Form.Field name='jobDescription' label='İş Tanımı' required>
          {(field) => (
            <Textarea
              placeholder='İş ilanında belirtilen görev ve sorumluluklarınızı buraya yazın...'
              rows={4}
              disabled={disabled}
              {...field}
            />
          )}
        </Form.Field>

        <Form.Field name='workMotivation' label='İş Motivasyonunuz' required>
          {(field) => (
            <Textarea
              placeholder='Sizi motive eden faktörler, kariyer hedefleriniz ve bu pozisyonda nasıl başarılı olacağınızı açıklayın...'
              rows={4}
              disabled={disabled}
              {...field}
            />
          )}
        </Form.Field>
      </CardContent>
    </Card>
  )
}
