'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Target } from 'lucide-react'
import { Textarea } from '@/components/core/textarea'
import { Form } from '@/components/form/Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

interface MotivationSectionProps {
  form: UseFormReturn<any>
}

export function MotivationSection({ form: _ }: MotivationSectionProps) {
  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
            <Target className='w-4 h-4 text-primary' />
          </div>
          <CardTitle className='text-lg'>Motivasyon & Gerekçeler</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Form.Field name='whyPosition' label='Bu Pozisyonu Neden Seçtiniz?' required>
          {(field) => (
            <Textarea
              placeholder='Bu pozisyonun sizin için neden uygun olduğunu, hangi yeteneklerinizin bu rolle uyumlu olduğunu açıklayın...'
              rows={4}
              {...field}
            />
          )}
        </Form.Field>

        <Form.Field name='whyCompany' label='Bu Şirketi Neden Seçtiniz?' required>
          {(field) => (
            <Textarea
              placeholder='Bu şirketin size neden çekici geldiğini, şirket kültürü ve değerleri hakkındaki düşüncelerinizi açıklayın...'
              rows={4}
              {...field}
            />
          )}
        </Form.Field>
      </CardContent>
    </Card>
  )
}
