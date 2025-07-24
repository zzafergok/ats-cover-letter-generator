'use client'

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import type { Course } from '@/types/api.types'

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Course, 'id'>) => Promise<void>
  course?: Course | null
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

export function CourseModal({ isOpen, onClose, onSave, course, isLoading = false }: CourseModalProps) {
  const [formData, setFormData] = useState({
    courseName: '',
    provider: '',
    startMonth: undefined as number | undefined,
    startYear: undefined as number | undefined,
    endMonth: undefined as number | undefined,
    endYear: undefined as number | undefined,
    duration: '',
    description: '',
  })

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || '',
        provider: course.provider || '',
        startMonth: course.startMonth,
        startYear: course.startYear,
        endMonth: course.endMonth,
        endYear: course.endYear,
        duration: course.duration || '',
        description: course.description || '',
      })
    } else {
      setFormData({
        courseName: '',
        provider: '',
        startMonth: undefined,
        startYear: undefined,
        endMonth: undefined,
        endYear: undefined,
        duration: '',
        description: '',
      })
    }
  }, [course])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Kurs kaydedilirken hata:', error)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i + 5)

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>{course ? 'Kursu Düzenle' : 'Yeni Kurs Ekle'}</CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Label htmlFor='courseName'>Kurs Adı *</Label>
                <Input
                  id='courseName'
                  value={formData.courseName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, courseName: e.target.value }))}
                  placeholder='React Advanced Patterns, AWS Solutions Architect, vb.'
                  required
                />
              </div>

              <div className='col-span-2'>
                <Label htmlFor='provider'>Kurs Sağlayıcısı</Label>
                <Input
                  id='provider'
                  value={formData.provider}
                  onChange={(e) => setFormData((prev) => ({ ...prev, provider: e.target.value }))}
                  placeholder='Udemy, Coursera, BTK Akademi, vb.'
                />
              </div>

              <div>
                <Label htmlFor='startMonth'>Başlangıç Ayı</Label>
                <Select
                  value={formData.startMonth?.toString() || ''}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, startMonth: value ? parseInt(value) : undefined }))}
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
              </div>

              <div>
                <Label htmlFor='startYear'>Başlangıç Yılı</Label>
                <Select
                  value={formData.startYear?.toString() || ''}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, startYear: value ? parseInt(value) : undefined }))}
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
              </div>

              <div>
                <Label htmlFor='endMonth'>Bitiş Ayı</Label>
                <Select
                  value={formData.endMonth?.toString() || ''}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, endMonth: value ? parseInt(value) : undefined }))}
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
              </div>

              <div>
                <Label htmlFor='endYear'>Bitiş Yılı</Label>
                <Select
                  value={formData.endYear?.toString() || ''}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, endYear: value ? parseInt(value) : undefined }))}
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
              </div>

              <div className='col-span-2'>
                <Label htmlFor='duration'>Kurs Süresi</Label>
                <Input
                  id='duration'
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder='20 saat, 8 hafta, 3 ay, vb.'
                />
              </div>

              <div className='col-span-2'>
                <Label htmlFor='description'>Açıklama</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder='Kurs hakkında detaylar, öğrendikleriniz, sertifika bilgisi vb.'
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