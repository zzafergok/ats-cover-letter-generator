'use client'

import Link from 'next/link'

import React from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, ArrowLeft, Save, Edit, X } from 'lucide-react'

import { useAuth } from '@/providers/AuthProvider'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { userApi } from '@/lib/api/api'
import AuthApiService from '@/lib/services/authApiService'
import { updateUserProfileSchema, type UpdateUserProfileRequest } from '@/lib/validations/profile'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()

  const [isEditing, setIsEditing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserProfileRequest>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data: UpdateUserProfileRequest) => {
    setIsLoading(true)
    try {
      await userApi.updateProfile(data)
      await AuthApiService.getCurrentUser() // Auth provider'dan user bilgilerini yenile
      setIsEditing(false)
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>{t('profile.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center space-x-4 mb-4'>
            <Link href='/dashboard'>
              <Button variant='outline' size='sm' className='flex items-center space-x-2'>
                <ArrowLeft className='h-4 w-4' />
                <span>{t('profile.backToDashboard')}</span>
              </Button>
            </Link>
          </div>

          <div className='flex items-center space-x-3'>
            <User className='h-8 w-8 text-primary' />
            <div>
              <h1 className='text-2xl font-bold text-foreground'>{t('profile.title')}</h1>
              <p className='text-muted-foreground'>{t('profile.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <div>
                <CardTitle>{t('profile.userInfo.title')}</CardTitle>
                <CardDescription>{t('profile.userInfo.description')}</CardDescription>
              </div>

              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant='outline' size='sm'>
                  <Edit className='h-4 w-4 mr-2' />
                  {t('profile.buttons.edit')}
                </Button>
              ) : (
                <div className='flex space-x-2'>
                  <Button onClick={handleSubmit(onSubmit)} size='sm' disabled={isLoading}>
                    <Save className='h-4 w-4 mr-2' />
                    {isLoading ? t('common.loading') : t('profile.buttons.save')}
                  </Button>
                  <Button onClick={handleCancel} variant='outline' size='sm'>
                    <X className='h-4 w-4 mr-2' />
                    {t('profile.buttons.cancel')}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Ad Soyad */}
              <div className='space-y-2'>
                <Label htmlFor='name'>{t('profile.userInfo.fullName')}</Label>
                <Input
                  id='name'
                  placeholder={t('profile.userInfo.fullNamePlaceholder')}
                  disabled={!isEditing}
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>{t('profile.userInfo.email')}</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder={t('profile.userInfo.emailPlaceholder')}
                  disabled={!isEditing}
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
              </div>

              {/* Rol (Sadece göster) */}
              <div className='space-y-2'>
                <Label>{t('profile.userInfo.role')}</Label>
                <Input value={user?.role || t('profile.userInfo.defaultRole')} disabled className='bg-muted' />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Session Info Card */}
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>{t('profile.sessionInfo.title')}</CardTitle>
            <CardDescription>{t('profile.sessionInfo.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-foreground'>{t('profile.sessionInfo.loggedInUser')}</p>
                <p className='text-sm text-muted-foreground'>{user?.email}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-foreground'>{t('profile.sessionInfo.authStatus')}</p>
                <p className='text-sm text-muted-foreground'>{t('profile.sessionInfo.authStatusActive')}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-foreground'>{t('profile.sessionInfo.tokenType')}</p>
                <p className='text-sm text-muted-foreground'>{t('profile.sessionInfo.tokenTypeValue')}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-foreground'>{t('profile.sessionInfo.security')}</p>
                <p className='text-sm text-muted-foreground'>{t('profile.sessionInfo.securityValue')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
