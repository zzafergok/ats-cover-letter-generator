'use client'

import React, { useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import type { Skill } from '@/types/api.types'

interface SkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Skill, 'id'>) => Promise<void>
  skill?: Skill | null
  isLoading?: boolean
}

const skillLevels = [
  { value: 'BEGINNER', label: 'Başlangıç' },
  { value: 'INTERMEDIATE', label: 'Orta' },
  { value: 'ADVANCED', label: 'İleri' },
  { value: 'EXPERT', label: 'Uzman' },
] as const

const skillCategories = ['TECHNICAL', 'SOFT_SKILL', 'LANGUAGE', 'TOOL', 'FRAMEWORK', 'OTHER'] as const

// Zod schema for form validation
const skillSchema = z.object({
  name: z.string().min(1, 'Yetenek adı zorunludur'),
  category: z.enum(['TECHNICAL', 'SOFT_SKILL', 'LANGUAGE', 'TOOL', 'FRAMEWORK', 'OTHER']),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  yearsOfExperience: z.number().min(0, 'Deneyim yılı 0 veya pozitif olmalıdır').max(50, 'Deneyim yılı 50\'den fazla olamaz'),
})

type SkillFormData = z.infer<typeof skillSchema>

export function SkillModal({ isOpen, onClose, onSave, skill, isLoading = false }: SkillModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'TECHNICAL',
      level: 'INTERMEDIATE',
      yearsOfExperience: 0,
    },
  })

  useEffect(() => {
    if (skill) {
      reset({
        name: skill.name || '',
        category: skill.category || 'TECHNICAL',
        level: skill.level || 'INTERMEDIATE',
        yearsOfExperience: skill.yearsOfExperience || 0,
      })
    } else {
      reset({
        name: '',
        category: 'TECHNICAL',
        level: 'INTERMEDIATE',
        yearsOfExperience: 0,
      })
    }
  }, [skill, isOpen, reset])

  const onSubmit = async (data: SkillFormData) => {
    try {
      await onSave(data)
      onClose()
    } catch (error) {
      console.error('Yetenek kaydedilirken hata:', error)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      TECHNICAL: 'Teknik',
      SOFT_SKILL: 'Soft Skill',
      LANGUAGE: 'Dil',
      TOOL: 'Araç',
      FRAMEWORK: 'Framework',
      OTHER: 'Diğer',
    }
    return labels[category] || category
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>{skill ? 'Yeteneği Düzenle' : 'Yeni Yetenek Ekle'}</CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Yetenek Adı *</Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='name'
                    placeholder='JavaScript, React, Liderlik, vb.'
                  />
                )}
              />
              {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor='category'>Kategori</Label>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Kategori seçin' />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryLabel(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className='text-sm text-red-500 mt-1'>{errors.category.message}</p>}
            </div>

            <div>
              <Label htmlFor='level'>Seviye</Label>
              <Controller
                name='level'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seviye seçin' />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.level && <p className='text-sm text-red-500 mt-1'>{errors.level.message}</p>}
            </div>

            <div>
              <Label htmlFor='yearsOfExperience'>Deneyim Yılı</Label>
              <Controller
                name='yearsOfExperience'
                control={control}
                render={({ field }) => (
                  <Input
                    id='yearsOfExperience'
                    type='number'
                    min='0'
                    max='50'
                    placeholder='Kaç yıllık deneyiminiz var?'
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
              {errors.yearsOfExperience && <p className='text-sm text-red-500 mt-1'>{errors.yearsOfExperience.message}</p>}
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