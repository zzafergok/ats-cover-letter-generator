'use client'

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/core/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/core/dialog'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

interface Language {
  language: string
  level: string
}

interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Language) => Promise<void>
  language?: Language | null
  isLoading?: boolean
}

const languageSchema = z.object({
  language: z.string().min(1, 'Dil adı zorunludur'),
  level: z.string().min(1, 'Seviye seçimi zorunludur'),
})

type LanguageFormData = z.infer<typeof languageSchema>

const languageLevels = [
  { value: 'NATIVE', label: 'Ana dil' },
  { value: 'FLUENT', label: 'Akıcı' },
  { value: 'ADVANCED', label: 'İleri' },
  { value: 'INTERMEDIATE', label: 'Orta' },
  { value: 'BASIC', label: 'Başlangıç' },
]

export function LanguageModal({ isOpen, onClose, onSave, language, isLoading }: LanguageModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: '',
      level: '',
    },
  })

  // Form'u dil bilgisiyle doldur
  useEffect(() => {
    if (language) {
      reset({
        language: language.language,
        level: language.level,
      })
    } else {
      reset({
        language: '',
        level: '',
      })
    }
  }, [language, reset])

  const onSubmit = async (data: LanguageFormData) => {
    try {
      await onSave(data)
      handleClose()
    } catch (error) {
      console.error('Dil kaydedilirken hata:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{language ? 'Dil Düzenle' : 'Yeni Dil Ekle'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label htmlFor='language'>Dil *</Label>
            <Controller
              name='language'
              control={control}
              render={({ field }) => <Input {...field} id='language' placeholder='Örn: İngilizce, Almanca' />}
            />
            {errors.language && <p className='text-sm text-red-500 mt-1'>{errors.language.message}</p>}
          </div>

          <div>
            <Label htmlFor='level'>Seviye *</Label>
            <Controller
              name='level'
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Dil seviyenizi seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    {languageLevels.map((level) => (
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

          <div className='flex justify-end space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={handleClose}>
              İptal
            </Button>
            <Button type='submit' disabled={isLoading || isSubmitting}>
              {(isLoading || isSubmitting) && (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
              )}
              {language ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
