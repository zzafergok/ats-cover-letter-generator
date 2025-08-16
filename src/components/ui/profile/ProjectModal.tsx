'use client'

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { X } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Textarea } from '@/components/core/textarea'
import { Label } from '@/components/core/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Checkbox } from '@/components/core/checkbox'

import type { Project } from '@/types/api.types'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Project, 'id'>) => Promise<void>
  project?: Project | null
  isLoading?: boolean
}

const projectSchema = z.object({
  name: z.string().min(1, 'Proje adı zorunludur'),
  description: z.string().min(1, 'Proje açıklaması zorunludur'),
  technologies: z.string().min(1, 'Teknolojiler zorunludur'),
  link: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  startMonth: z.number().min(1).max(12).optional(),
  startYear: z.number().min(1980).max(2030).optional(),
  endMonth: z.number().min(1).max(12).optional(),
  endYear: z.number().min(1980).max(2030).optional(),
  isCurrent: z.boolean(),
})

type ProjectFormData = z.infer<typeof projectSchema>

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
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1980 + 11 }, (_, i) => currentYear - i + 10).reverse()

export function ProjectModal({ isOpen, onClose, onSave, project, isLoading }: ProjectModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      technologies: '',
      link: '',
      startMonth: undefined,
      startYear: undefined,
      endMonth: undefined,
      endYear: undefined,
      isCurrent: false,
    },
  })

  const watchIsCurrent = watch('isCurrent')

  // Form'u proje bilgisiyle doldur
  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        link: project.link || '',
        startMonth: project.startMonth,
        startYear: project.startYear,
        endMonth: project.endMonth,
        endYear: project.endYear,
        isCurrent: project.isCurrent || false,
      })
    } else {
      reset({
        name: '',
        description: '',
        technologies: '',
        link: '',
        startMonth: undefined,
        startYear: undefined,
        endMonth: undefined,
        endYear: undefined,
        isCurrent: false,
      })
    }
  }, [project, reset])

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await onSave(data)
      handleClose()
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>{project ? 'Proje Düzenle' : 'Yeni Proje Ekle'}</CardTitle>
          <Button variant='ghost' size='sm' onClick={handleClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Proje Adı *</Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input {...field} id='name' placeholder='Proje adını giriniz' />}
              />
              {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor='description'>Proje Açıklaması *</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Textarea {...field} id='description' placeholder='Proje hakkında detaylı açıklama...' rows={4} />
                )}
              />
              {errors.description && <p className='text-sm text-red-500 mt-1'>{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor='technologies'>Kullanılan Teknolojiler *</Label>
              <Controller
                name='technologies'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='technologies' placeholder='React, Node.js, MongoDB (virgülle ayırın)' />
                )}
              />
              {errors.technologies && <p className='text-sm text-red-500 mt-1'>{errors.technologies.message}</p>}
            </div>

            <div>
              <Label htmlFor='link'>Proje Linki</Label>
              <Controller
                name='link'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='link' placeholder='https://github.com/kullanici/proje' type='url' />
                )}
              />
              {errors.link && <p className='text-sm text-red-500 mt-1'>{errors.link.message}</p>}
            </div>

            {/* Tarih Alanları */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Başlangıç Tarihi</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <Controller
                    name='startMonth'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Ay' />
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
                  <Controller
                    name='startYear'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Yıl' />
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
                </div>
              </div>

              <div>
                <Label>Bitiş Tarihi</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <Controller
                    name='endMonth'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={watchIsCurrent}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Ay' />
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
                  <Controller
                    name='endYear'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={watchIsCurrent}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Yıl' />
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
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                name='isCurrent'
                control={control}
                render={({ field }) => (
                  <Checkbox id='isCurrent' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='isCurrent' className='text-sm font-normal'>
                Halen devam eden proje
              </Label>
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={handleClose}>
                İptal
              </Button>
              <Button type='submit' disabled={isLoading || isSubmitting}>
                {(isLoading || isSubmitting) && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                )}
                {project ? 'Güncelle' : 'Ekle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
