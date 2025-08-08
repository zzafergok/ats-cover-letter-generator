'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Award } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'

interface CVTemplateFormData {
  certificates?: Array<{
    name: string
    issuer?: string
    date?: string
  }>
  [key: string]: any
}

interface CertificatesStepProps {
  form: UseFormReturn<CVTemplateFormData>
}

export function CertificatesStep({ form }: CertificatesStepProps) {
  const { register, watch, setValue, getValues } = form

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label>Sertifikalar</Label>
        <div
          className={`grid ${(watch('certificates')?.length || 0) > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}
        >
          {watch('certificates')?.map((_, index) => (
            <Card key={index} className='p-4'>
              <div className='space-y-3'>
                <div>
                  <Label>Sertifika Adı</Label>
                  <Input {...register(`certificates.${index}.name`)} placeholder='Sertifika adı' />
                </div>
                <div>
                  <Label>Veren Kuruluş</Label>
                  <Input {...register(`certificates.${index}.issuer`)} placeholder='Veren kuruluş' />
                </div>
                <div>
                  <Label>Tarih</Label>
                  <Input {...register(`certificates.${index}.date`)} placeholder='Tarih (YYYY)' />
                </div>
              </div>
            </Card>
          )) || []}
        </div>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => {
            const current = getValues('certificates') || []
            setValue('certificates', [...current, { name: '', issuer: '', date: '' }])
          }}
        >
          + Sertifika Ekle
        </Button>
      </div>

      <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center'>
              <Award className='h-4 w-4 text-green-600 dark:text-green-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-green-800 dark:text-green-200'>Sertifika İpuçları</h4>
            <ul className='text-xs text-green-700 dark:text-green-300 space-y-1'>
              <li>• Sektörle ilgili sertifikaları önceliklendir</li>
              <li>• Güncel ve geçerli sertifikaları ekle</li>
              <li>• Tanınmış kuruluşlardan alınan sertifikaları vurgula</li>
              <li>• Sertifika numarası varsa belirt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
