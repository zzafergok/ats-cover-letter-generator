'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Briefcase } from 'lucide-react'
import { Input } from '@/components/core/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Form } from '@/components/form/Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

interface BasicInfoSectionProps {
  form: UseFormReturn<any>
}

export function BasicInfoSection({ form: _ }: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
            <Briefcase className='w-4 h-4 text-primary' />
          </div>
          <CardTitle className='text-lg'>Temel İş Bilgileri</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Form.Field name='positionTitle' label='Pozisyon Başlığı' required>
            {(field) => <Input placeholder='Senior Yazılım Geliştirici' {...field} />}
          </Form.Field>

          <Form.Field name='companyName' label='Şirket Adı' required>
            {(field) => <Input placeholder='Tech Şirket A.Ş.' {...field} />}
          </Form.Field>
        </div>

        <Form.Field name='language' label='Dil Seçimi'>
          {(field) => (
            <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
              <SelectTrigger>
                <SelectValue placeholder='Dil seçin' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='TURKISH'>Türkçe</SelectItem>
                <SelectItem value='ENGLISH'>English</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Form.Field>
      </CardContent>
    </Card>
  )
}
