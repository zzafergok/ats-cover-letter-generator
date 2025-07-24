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

// Zod schema for form validation
const courseSchema = z.object({
  courseName: z.string().min(1, 'Kurs adı zorunludur'),
  provider: z.string().optional(),
  startMonth: z.number().min(1).max(12).optional(),
  startYear: z.number().min(1980).max(2030).optional(),
  endMonth: z.number().min(1).max(12).optional(),
  endYear: z.number().min(1980).max(2030).optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

export function CourseModal({ isOpen, onClose, onSave, course, isLoading = false }: CourseModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: '',
      provider: '',
      startMonth: undefined,
      startYear: undefined,
      endMonth: undefined,
      endYear: undefined,
      duration: '',
      description: '',
    },
  })

  useEffect(() => {
    if (course) {
      reset({
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
      reset({
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
  }, [course, isOpen, reset])

  const onSubmit = async (data: CourseFormData) => {
    try {
      await onSave(data)
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
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Label htmlFor='courseName'>Kurs Adı *</Label>
                <Controller
                  name='courseName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='courseName'
                      placeholder='React Advanced Patterns, AWS Solutions Architect, vb.'
                    />
                  )}
                />
                {errors.courseName && <p className='text-sm text-red-500 mt-1'>{errors.courseName.message}</p>}
              </div>

              <div className='col-span-2'>
                <Label htmlFor='provider'>Kurs Sağlayıcısı</Label>
                <Controller
                  name='provider'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='provider'
                      placeholder='Udemy, Coursera, BTK Akademi, vb.'
                    />
                  )}
                />
                {errors.provider && <p className='text-sm text-red-500 mt-1'>{errors.provider.message}</p>}
              </div>

              <div>
                <Label htmlFor='startMonth'>Başlangıç Ayı</Label>
                <Controller
                  name='startMonth'
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
                {errors.startMonth && <p className='text-sm text-red-500 mt-1'>{errors.startMonth.message}</p>}
              </div>

              <div>
                <Label htmlFor='startYear'>Başlangıç Yılı</Label>
                <Controller
                  name='startYear'
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
                {errors.startYear && <p className='text-sm text-red-500 mt-1'>{errors.startYear.message}</p>}
              </div>

              <div>
                <Label htmlFor='endMonth'>Bitiş Ayı</Label>
                <Controller
                  name='endMonth'
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
                {errors.endMonth && <p className='text-sm text-red-500 mt-1'>{errors.endMonth.message}</p>}
              </div>

              <div>
                <Label htmlFor='endYear'>Bitiş Yılı</Label>
                <Controller
                  name='endYear'
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
                {errors.endYear && <p className='text-sm text-red-500 mt-1'>{errors.endYear.message}</p>}
              </div>

              <div className='col-span-2'>
                <Label htmlFor='duration'>Kurs Süresi</Label>
                <Controller
                  name='duration'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='duration'
                      placeholder='20 saat, 8 hafta, 3 ay, vb.'
                    />
                  )}
                />
                {errors.duration && <p className='text-sm text-red-500 mt-1'>{errors.duration.message}</p>}
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
                      placeholder='Kurs hakkında detaylar, öğrendikleriniz, sertifika bilgisi vb.'
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