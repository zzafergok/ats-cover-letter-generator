'use client'

import React from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { userApi } from '@/lib/api/api'
import { changePasswordSchema, type ChangePasswordRequest } from '@/lib/validations'

export default function SettingsPasswordSection() {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = React.useState(false)
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordRequest) => {
    setIsLoading(true)
    try {
      await userApi.changePassword(data)
      reset()
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center space-x-2'>
          <Lock className='h-5 w-5 text-primary' />
          <div>
            <CardTitle>{t('settings.password.title')}</CardTitle>
            <CardDescription>{t('settings.password.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Mevcut Şifre */}
          <div className='space-y-2'>
            <Label htmlFor='currentPassword'>{t('settings.password.currentPassword')}</Label>
            <div className='relative'>
              <Input
                id='currentPassword'
                type={showPasswords.current ? 'text' : 'password'}
                placeholder={t('settings.password.currentPasswordPlaceholder')}
                {...register('currentPassword')}
                className={errors.currentPassword ? 'border-destructive' : ''}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </Button>
            </div>
            {errors.currentPassword && <p className='text-sm text-destructive'>{errors.currentPassword.message}</p>}
          </div>

          {/* Yeni Şifre */}
          <div className='space-y-2'>
            <Label htmlFor='newPassword'>{t('settings.password.newPassword')}</Label>
            <div className='relative'>
              <Input
                id='newPassword'
                type={showPasswords.new ? 'text' : 'password'}
                placeholder={t('settings.password.newPasswordPlaceholder')}
                {...register('newPassword')}
                className={errors.newPassword ? 'border-destructive' : ''}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </Button>
            </div>
            {errors.newPassword && <p className='text-sm text-destructive'>{errors.newPassword.message}</p>}
          </div>

          {/* Şifre Tekrarı */}
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>{t('settings.password.confirmPassword')}</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder={t('settings.password.confirmPasswordPlaceholder')}
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </Button>
            </div>
            {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword.message}</p>}
          </div>

          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? t('common.loading') : t('settings.password.changePassword')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
