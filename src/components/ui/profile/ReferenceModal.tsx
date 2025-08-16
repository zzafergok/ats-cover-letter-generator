'use client'

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/core/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/core/dialog'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'

interface Reference {
  name: string
  company: string
  contact: string
}

interface ReferenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Reference) => Promise<void>
  reference?: Reference | null
  isLoading?: boolean
}

const referenceSchema = z.object({
  name: z.string().min(1, 'İsim zorunludur'),
  company: z.string().min(1, 'Şirket adı zorunludur'),
  contact: z.string().min(1, 'İletişim bilgisi zorunludur'),
})

type ReferenceFormData = z.infer<typeof referenceSchema>

export function ReferenceModal({ isOpen, onClose, onSave, reference, isLoading }: ReferenceModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReferenceFormData>({
    resolver: zodResolver(referenceSchema),
    defaultValues: {
      name: '',
      company: '',
      contact: '',
    },
  })

  // Form'u referans bilgisiyle doldur
  useEffect(() => {
    if (reference) {
      reset({
        name: reference.name,
        company: reference.company,
        contact: reference.contact,
      })
    } else {
      reset({
        name: '',
        company: '',
        contact: '',
      })
    }
  }, [reference, reset])

  const onSubmit = async (data: ReferenceFormData) => {
    try {
      await onSave(data)
      handleClose()
    } catch (error) {
      console.error('Referans kaydedilirken hata:', error)
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
          <DialogTitle>{reference ? 'Referans Düzenle' : 'Yeni Referans Ekle'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Ad Soyad *</Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => <Input {...field} id='name' placeholder='Referansın adı soyadı' />}
            />
            {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor='company'>Şirket/Kurum *</Label>
            <Controller
              name='company'
              control={control}
              render={({ field }) => <Input {...field} id='company' placeholder='Çalıştığı şirket veya kurum' />}
            />
            {errors.company && <p className='text-sm text-red-500 mt-1'>{errors.company.message}</p>}
          </div>

          <div>
            <Label htmlFor='contact'>İletişim Bilgisi *</Label>
            <Controller
              name='contact'
              control={control}
              render={({ field }) => (
                <Input {...field} id='contact' placeholder='Telefon numarası veya e-posta adresi' />
              )}
            />
            {errors.contact && <p className='text-sm text-red-500 mt-1'>{errors.contact.message}</p>}
          </div>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={handleClose}>
              İptal
            </Button>
            <Button type='submit' disabled={isLoading || isSubmitting}>
              {(isLoading || isSubmitting) && (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
              )}
              {reference ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
