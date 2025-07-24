'use client'

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
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

export function CertificateModal({ isOpen, onClose, onSave, certificate, isLoading = false }: CertificateModalProps) {
  const [formData, setFormData] = useState({
    certificateName: '',
    issuer: '',
    issueMonth: undefined as number | undefined,
    issueYear: undefined as number | undefined,
    expiryMonth: undefined as number | undefined,
    expiryYear: undefined as number | undefined,
    credentialId: '',
    credentialUrl: '',
    description: '',
  })

  useEffect(() => {
    if (certificate) {
      setFormData({
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
      setFormData({
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
  }, [certificate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave(formData)
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
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Label htmlFor='certificateName'>Sertifika Adı *</Label>
                <Input
                  id='certificateName'
                  value={formData.certificateName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, certificateName: e.target.value }))}
                  placeholder='AWS Certified Solutions Architect, PMP, vb.'
                  required
                />
              </div>

              <div className='col-span-2'>
                <Label htmlFor='issuer'>Veren Kuruluş</Label>
                <Input
                  id='issuer'
                  value={formData.issuer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
                  placeholder='Amazon Web Services, PMI, Microsoft, vb.'
                />
              </div>

              <div>
                <Label htmlFor='issueMonth'>Verilme Ayı</Label>
                <select
                  id='issueMonth'
                  value={formData.issueMonth || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, issueMonth: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <option value=''>Ay seçin</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor='issueYear'>Verilme Yılı</Label>
                <select
                  id='issueYear'
                  value={formData.issueYear || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, issueYear: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <option value=''>Yıl seçin</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor='expiryMonth'>Geçerlilik Bitiş Ayı</Label>
                <select
                  id='expiryMonth'
                  value={formData.expiryMonth || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiryMonth: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <option value=''>Ay seçin</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor='expiryYear'>Geçerlilik Bitiş Yılı</Label>
                <select
                  id='expiryYear'
                  value={formData.expiryYear || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiryYear: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <option value=''>Yıl seçin</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor='credentialId'>Kimlik Numarası</Label>
                <Input
                  id='credentialId'
                  value={formData.credentialId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, credentialId: e.target.value }))}
                  placeholder='AWS-SA-2023-123456'
                />
              </div>

              <div>
                <Label htmlFor='credentialUrl'>Doğrulama URL'si</Label>
                <Input
                  id='credentialUrl'
                  type='url'
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, credentialUrl: e.target.value }))}
                  placeholder='https://aws.amazon.com/verification'
                />
              </div>

              <div className='col-span-2'>
                <Label htmlFor='description'>Açıklama</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder='Sertifika hakkında detaylar, kapsadığı konular vb.'
                  rows={3}
                />
              </div>
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={onClose}>
                İptal
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />}
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