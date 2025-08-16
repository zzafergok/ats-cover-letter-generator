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

import type { Hobby } from '@/types/api.types'

interface HobbyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Hobby, 'id'>) => Promise<void>
  hobby?: Hobby | null
  isLoading?: boolean
}

const hobbySchema = z.object({
  name: z.string().min(1, 'Hobi adı zorunludur'),
  description: z.string().optional(),
})

type HobbyFormData = z.infer<typeof hobbySchema>

export function HobbyModal({ isOpen, onClose, onSave, hobby, isLoading }: HobbyModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HobbyFormData>({
    resolver: zodResolver(hobbySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Form'u hobi bilgisiyle doldur
  useEffect(() => {
    if (hobby) {
      reset({
        name: hobby.name,
        description: hobby.description || '',
      })
    } else {
      reset({
        name: '',
        description: '',
      })
    }
  }, [hobby, reset])

  const onSubmit = async (data: HobbyFormData) => {
    try {
      await onSave(data)
      handleClose()
    } catch (error) {
      console.error('Hobi kaydedilirken hata:', error)
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
          <CardTitle>{hobby ? 'Hobi Düzenle' : 'Yeni Hobi Ekle'}</CardTitle>
          <Button variant='ghost' size='sm' onClick={handleClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Hobi Adı *</Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input {...field} id='name' placeholder='Örn: Kitap okuma, Müzik dinleme' />}
              />
              {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor='description'>Açıklama</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Textarea {...field} id='description' placeholder='Hobi hakkında detaylı açıklama...' rows={3} />
                )}
              />
              {errors.description && <p className='text-sm text-red-500 mt-1'>{errors.description.message}</p>}
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={handleClose}>
                İptal
              </Button>
              <Button type='submit' disabled={isLoading || isSubmitting}>
                {(isLoading || isSubmitting) && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                )}
                {hobby ? 'Güncelle' : 'Ekle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
