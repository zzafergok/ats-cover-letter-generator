'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { User } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'

interface CVTemplateFormData {
  personalInfo: {
    firstName: string
    lastName: string
    jobTitle?: string
    linkedin?: string
    address?: string
    city?: string
    phone?: string
    email: string
  }
  templateType?: string
  [key: string]: any
}

interface PersonalInfoStepProps {
  form: UseFormReturn<CVTemplateFormData>
  selectedTemplate?: string
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='firstName'>Ad *</Label>
            <Input id='firstName' {...register('personalInfo.firstName')} placeholder='Ahmet' />
            {errors.personalInfo?.firstName && (
              <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='lastName'>Soyad *</Label>
            <Input id='lastName' {...register('personalInfo.lastName')} placeholder='Yılmaz' />
            {errors.personalInfo?.lastName && (
              <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.lastName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='jobTitle'>İş Unvanı</Label>
            <Input id='jobTitle' {...register('personalInfo.jobTitle')} placeholder='Yazılım Geliştirici' />
          </div>
          <div>
            <Label htmlFor='email'>Email *</Label>
            <Input id='email' type='email' {...register('personalInfo.email')} placeholder='ahmet@email.com' />
            {errors.personalInfo?.email && (
              <p className='text-sm text-red-600 mt-1'>{errors.personalInfo.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='phone'>Telefon</Label>
            <Input id='phone' {...register('personalInfo.phone')} placeholder='+90 555 123 4567' />
          </div>
          <div>
            <Label htmlFor='linkedin'>LinkedIn</Label>
            <Input id='linkedin' {...register('personalInfo.linkedin')} placeholder='linkedin.com/in/ahmetyilmaz' />
          </div>
          <div>
            <Label htmlFor='city'>Şehir</Label>
            <Input id='city' {...register('personalInfo.city')} placeholder='İstanbul' />
          </div>
          <div>
            <Label htmlFor='address'>Adres</Label>
            <Input id='address' {...register('personalInfo.address')} placeholder='Mahalle, Sokak, No' />
          </div>
        </div>
      </div>

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center'>
              <User className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>Kişisel Bilgi İpuçları</h4>
            <ul className='text-xs text-blue-700 dark:text-blue-300 space-y-1'>
              <li>• Bu bilgiler otomatik olarak profil sayfanızdan alınmıştır</li>
              <li>• Email adresi zorunludur ve doğru formatta olmalıdır</li>
              <li>• Telefon numarasını uluslararası formatta yazın</li>
              <li>• LinkedIn profilinizi ekleyerek profesyonellik katın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
