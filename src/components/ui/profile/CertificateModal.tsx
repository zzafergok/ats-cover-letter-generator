'use client'

import React, { useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import type { Certificate } from '@/types/api.types'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Certificate, 'id'>) => Promise<void>
  certificate?: Certificate | null
  isLoading?: boolean
}

const months = [
  { value: 1, label: 'Ocak' },
  { value: 2, label: 'Şubat' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'Nisan' },
  { value: 5, label: 'Mayıs' },
  { value: 6, label: 'Haziran' },
  { value: 7, label: 'Temmuz' },
  { value: 8, label: 'Ağustos' },
  { value: 9, label: 'Eylül' },
  { value: 10, label: 'Ekim' },
  { value: 11, label: 'Kasım' },
  { value: 12, label: 'Aralık' },
] as const

// Zod schema for form validation
const certificateSchema = z.object({
  certificateName: z.string().min(1, 'Sertifika adı zorunludur'),
  issuer: z.string().optional(),
  issueMonth: z.number().min(1).max(12).optional(),
  issueYear: z.number().min(1980).max(2030).optional(),
  expiryMonth: z.number().min(1).max(12).optional(),
  expiryYear: z.number().min(1980).max(2030).optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  description: z.string().optional(),
})

type CertificateFormData = z.infer<typeof certificateSchema>

export function CertificateModal({ isOpen, onClose, onSave, certificate, isLoading = false }: CertificateModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      certificateName: '',
      issuer: '',
      issueMonth: undefined,
      issueYear: undefined,
      expiryMonth: undefined,
      expiryYear: undefined,
      credentialId: '',
      credentialUrl: '',
      description: '',
    },
  })

  useEffect(() => {
    if (certificate) {
      reset({
        certificateName: certificate.certificateName || '',
        issuer: certificate.issuer || '',
        issueMonth: certificate.issueMonth,
        issueYear: certificate.issueYear,
        expiryMonth: certificate.expiryMonth,
        expiryYear: certificate.expiryYear,
        credentialId: certificate.credentialId || '',
        credentialUrl: certificate.credentialUrl || '',
        description: certificate.description || '',
      })
    } else {
      reset({
        certificateName: '',
        issuer: '',
        issueMonth: undefined,
        issueYear: undefined,
        expiryMonth: undefined,
        expiryYear: undefined,
        credentialId: '',
        credentialUrl: '',
        description: '',
      })
    }
  }, [certificate, isOpen, reset])

  const onSubmit = async (data: CertificateFormData) => {
    try {
      await onSave(data)
      onClose()
    } catch (error) {
      console.error('Sertifika kaydedilirken hata:', error)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i + 10)

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>{certificate ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ekle'}</CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Label htmlFor='certificateName'>Sertifika Adı *</Label>
                <Controller
                  name='certificateName'
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id='certificateName' placeholder='AWS Certified Solutions Architect, PMP, vb.' />
                  )}
                />
                {errors.certificateName && (
                  <p className='text-sm text-red-500 mt-1'>{errors.certificateName.message}</p>
                )}
              </div>

              <div className='col-span-2'>
                <Label htmlFor='issuer'>Veren Kuruluş</Label>
                <Controller
                  name='issuer'
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id='issuer' placeholder='Amazon Web Services, PMI, Microsoft, vb.' />
                  )}
                />
                {errors.issuer && <p className='text-sm text-red-500 mt-1'>{errors.issuer.message}</p>}
              </div>

              <div>
                <Label htmlFor='issueMonth'>Verilme Ayı</Label>
                <Controller
                  name='issueMonth'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString() || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Ay seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.issueMonth && <p className='text-sm text-red-500 mt-1'>{errors.issueMonth.message}</p>}
              </div>

              <div>
                <Label htmlFor='issueYear'>Verilme Yılı</Label>
                <Controller
                  name='issueYear'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString() || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Yıl seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.issueYear && <p className='text-sm text-red-500 mt-1'>{errors.issueYear.message}</p>}
              </div>

              <div>
                <Label htmlFor='expiryMonth'>Geçerlilik Bitiş Ayı</Label>
                <Controller
                  name='expiryMonth'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString() || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Ay seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.expiryMonth && <p className='text-sm text-red-500 mt-1'>{errors.expiryMonth.message}</p>}
              </div>

              <div>
                <Label htmlFor='expiryYear'>Geçerlilik Bitiş Yılı</Label>
                <Controller
                  name='expiryYear'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString() || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Yıl seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.expiryYear && <p className='text-sm text-red-500 mt-1'>{errors.expiryYear.message}</p>}
              </div>

              <div>
                <Label htmlFor='credentialId'>Kimlik Numarası</Label>
                <Controller
                  name='credentialId'
                  control={control}
                  render={({ field }) => <Input {...field} id='credentialId' placeholder='AWS-SA-2023-123456' />}
                />
                {errors.credentialId && <p className='text-sm text-red-500 mt-1'>{errors.credentialId.message}</p>}
              </div>

              <div>
                <Label htmlFor='credentialUrl'>Doğrulama URL&apos;si</Label>
                <Controller
                  name='credentialUrl'
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id='credentialUrl' type='url' placeholder='https://aws.amazon.com/verification' />
                  )}
                />
                {errors.credentialUrl && <p className='text-sm text-red-500 mt-1'>{errors.credentialUrl.message}</p>}
              </div>

              <div className='col-span-2'>
                <Label htmlFor='description'>Açıklama</Label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id='description'
                      placeholder='Sertifika hakkında detaylar, kapsadığı konular vb.'
                      rows={3}
                    />
                  )}
                />
                {errors.description && <p className='text-sm text-red-500 mt-1'>{errors.description.message}</p>}
              </div>
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={onClose}>
                İptal
              </Button>
              <Button type='submit' disabled={isLoading || isSubmitting}>
                {(isLoading || isSubmitting) && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                )}
                <Save className='h-4 w-4 mr-2' />
                Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
