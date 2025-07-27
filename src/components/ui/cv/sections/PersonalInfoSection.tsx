'use client'

import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { FormError } from '@/components/core/form-error'
import { ATSFormData } from '@/types/form.types'

interface PersonalInfoSectionProps {
  register: UseFormRegister<ATSFormData>
  errors: FieldErrors<ATSFormData>
}

export function PersonalInfoSection({ register, errors }: PersonalInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5' />
          Kişisel Bilgiler
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='firstName'>Ad *</Label>
            <Input
              id='firstName'
              {...register('personalInfo.firstName')}
              className={errors.personalInfo?.firstName ? 'border-destructive' : ''}
            />
            <FormError message={errors.personalInfo?.firstName?.message} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='lastName'>Soyad *</Label>
            <Input
              id='lastName'
              {...register('personalInfo.lastName')}
              className={errors.personalInfo?.lastName ? 'border-destructive' : ''}
            />
            <FormError message={errors.personalInfo?.lastName?.message} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='email' className='flex items-center gap-1'>
              <Mail className='h-4 w-4' />
              E-posta *
            </Label>
            <Input
              id='email'
              type='email'
              {...register('personalInfo.email')}
              className={errors.personalInfo?.email ? 'border-destructive' : ''}
            />
            <FormError message={errors.personalInfo?.email?.message} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='phone' className='flex items-center gap-1'>
              <Phone className='h-4 w-4' />
              Telefon *
            </Label>
            <Input
              id='phone'
              {...register('personalInfo.phone')}
              className={errors.personalInfo?.phone ? 'border-destructive' : ''}
            />
            <FormError message={errors.personalInfo?.phone?.message} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='city' className='flex items-center gap-1'>
              <MapPin className='h-4 w-4' />
              Şehir *
            </Label>
            <Input
              id='city'
              {...register('personalInfo.address.city')}
              className={errors.personalInfo?.address?.city ? 'border-destructive' : ''}
            />
            <FormError message={errors.personalInfo?.address?.city?.message} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='country'>Ülke *</Label>
            <Input
              id='country'
              {...register('personalInfo.address.country')}
              className={errors.personalInfo?.address?.country ? 'border-destructive' : ''}
            />
            <FormError message={errors.personalInfo?.address?.country?.message} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='linkedIn' className='flex items-center gap-1'>
              <Linkedin className='h-4 w-4' />
              LinkedIn
            </Label>
            <Input id='linkedIn' {...register('personalInfo.linkedIn')} placeholder='https://linkedin.com/in/...' />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='github'>GitHub</Label>
            <Input id='github' {...register('personalInfo.github')} placeholder='https://github.com/...' />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='portfolio' className='flex items-center gap-1'>
              <Globe className='h-4 w-4' />
              Portfolio/Website
            </Label>
            <Input id='portfolio' {...register('personalInfo.portfolio')} placeholder='https://...' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
