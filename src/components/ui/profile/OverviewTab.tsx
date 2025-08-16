'use client'

import React, { useState } from 'react'
import { GraduationCap, Briefcase, Star, MessageCircle, Edit3, Save, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { Label } from '@/components/core/label'

import type { UserProfile } from '@/types/api.types'

interface OverviewTabProps {
  profile: UserProfile | null
  onUpdateProfile?: (data: Partial<UserProfile>) => Promise<void>
}

const communicationSchema = z.object({
  communication: z.string().optional(),
  leadership: z.string().optional(),
})

type CommunicationFormData = z.infer<typeof communicationSchema>

export function OverviewTab({ profile, onUpdateProfile }: OverviewTabProps) {
  const [isEditingCommunication, setIsEditingCommunication] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      communication: profile?.communication || '',
      leadership: profile?.leadership || '',
    },
  })

  React.useEffect(() => {
    reset({
      communication: profile?.communication || '',
      leadership: profile?.leadership || '',
    })
  }, [profile, reset])

  const onSubmit = async (data: CommunicationFormData) => {
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(data)
      }
      setIsEditingCommunication(false)
    } catch (error) {
      console.error('Beceriler güncellenirken hata:', error)
    }
  }

  const handleCancel = () => {
    reset({
      communication: profile?.communication || '',
      leadership: profile?.leadership || '',
    })
    setIsEditingCommunication(false)
  }

  return (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Education Summary */}
        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Eğitim</CardTitle>
            <GraduationCap className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{profile?.educations?.length || 0}</div>
            <p className='text-xs text-muted-foreground'>Eğitim kaydı</p>
          </CardContent>
        </Card>

        {/* Experience Summary */}
        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>İş Deneyimi</CardTitle>
            <Briefcase className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{profile?.experiences?.length || 0}</div>
            <p className='text-xs text-muted-foreground'>İş deneyimi</p>
          </CardContent>
        </Card>

        {/* Skills Summary */}
        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Yetenekler</CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{profile?.skills?.length || 0}</div>
            <p className='text-xs text-muted-foreground'>Yetenek</p>
          </CardContent>
        </Card>
      </div>

      {/* Communication and Leadership Skills */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <MessageCircle className='h-5 w-5 text-primary' />
              <CardTitle>İletişim ve Liderlik Becerileri</CardTitle>
            </div>
            {!isEditingCommunication && onUpdateProfile && (
              <Button variant='outline' size='sm' onClick={() => setIsEditingCommunication(true)}>
                <Edit3 className='h-4 w-4 mr-2' />
                Düzenle
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingCommunication ? (
            <div className='space-y-4'>
              <div>
                <h4 className='text-sm font-medium text-muted-foreground mb-2'>İletişim Becerileri</h4>
                <p className='text-sm leading-relaxed'>
                  {profile?.communication || 'İletişim becerileri henüz eklenmedi.'}
                </p>
              </div>
              <div>
                <h4 className='text-sm font-medium text-muted-foreground mb-2'>Liderlik Becerileri</h4>
                <p className='text-sm leading-relaxed'>
                  {profile?.leadership || 'Liderlik becerileri henüz eklenmedi.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Label htmlFor='communication'>İletişim Becerileri</Label>
                <Controller
                  name='communication'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id='communication'
                      placeholder='İletişim becerilerinizi açıklayın...'
                      rows={3}
                    />
                  )}
                />
                {errors.communication && <p className='text-sm text-red-500 mt-1'>{errors.communication.message}</p>}
              </div>

              <div>
                <Label htmlFor='leadership'>Liderlik Becerileri</Label>
                <Controller
                  name='leadership'
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} id='leadership' placeholder='Liderlik becerilerinizi açıklayın...' rows={3} />
                  )}
                />
                {errors.leadership && <p className='text-sm text-red-500 mt-1'>{errors.leadership.message}</p>}
              </div>

              <div className='flex space-x-2'>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />}
                  <Save className='h-4 w-4 mr-2' />
                  Kaydet
                </Button>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  <X className='h-4 w-4 mr-2' />
                  İptal
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
