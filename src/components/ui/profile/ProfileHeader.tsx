'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Globe, Edit3, User, Palette, Save, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { locationApi } from '@/lib/api/api'
import { avatarColors } from '@/constants/profile'

import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'
import { Avatar, AvatarFallback } from '@/components/core/avatar'
import { Input } from '@/components/core/input'
import { Textarea } from '@/components/core/textarea'
import { Label } from '@/components/core/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import type { UserProfile, Province, District } from '@/types/api.types'

interface ProfileHeaderProps {
  profile: UserProfile | null
  isLoading: boolean
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>
}

// Zod schema for profile validation
const profileSchema = z.object({
  firstName: z.string().min(1, 'Ad zorunludur'),
  lastName: z.string().min(1, 'Soyad zorunludur'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  github: z.string().url('Geçerli bir GitHub URL giriniz').optional().or(z.literal('')),
  linkedin: z.string().url('Geçerli bir LinkedIn URL giriniz').optional().or(z.literal('')),
  portfolioWebsite: z.string().url('Geçerli bir website URL giriniz').optional().or(z.literal('')),
  aboutMe: z.string().optional(),
  avatarColor: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileHeader({ profile, isLoading, onUpdateProfile }: ProfileHeaderProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Location state
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('')
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      github: '',
      linkedin: '',
      portfolioWebsite: '',
      aboutMe: '',
      avatarColor: '#3B82F6',
    },
  })

  const watchFirstName = watch('firstName')
  const watchLastName = watch('lastName')
  const watchAvatarColor = watch('avatarColor')

  // Get avatar style based on hex color
  const getAvatarStyle = (hexColor: string) => {
    const fallbackColor = '#3B82F6'
    const finalColor = hexColor && hexColor !== '' ? hexColor : fallbackColor
    const selectedColor = avatarColors.find((colorItem) => colorItem.color.toLowerCase() === finalColor.toLowerCase())

    return {
      backgroundColor: finalColor,
      color: selectedColor?.textColor || '#ffffff',
    }
  }

  // Load provinces on component mount
  const loadProvinces = async () => {
    setIsLoadingProvinces(true)
    try {
      const response = await locationApi.getProvinces()
      setProvinces(response.data)
    } catch (error) {
      console.error('Şehirler yüklenemedi:', error)
    } finally {
      setIsLoadingProvinces(false)
    }
  }

  // Load districts when province is selected
  const loadDistricts = async (provinceCode: string) => {
    setIsLoadingDistricts(true)
    try {
      const response = await locationApi.getDistrictsByProvinceCode(provinceCode)
      setDistricts(response.data)
    } catch (error) {
      console.error('İlçeler yüklenemedi:', error)
      setDistricts([])
    } finally {
      setIsLoadingDistricts(false)
    }
  }

  // Handle province selection
  const handleProvinceChange = (provinceCode: string, provinceName: string) => {
    setSelectedProvinceCode(provinceCode)
    setValue('city', provinceName)
    setValue('address', '')
    loadDistricts(provinceCode)
  }

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      const formData = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        portfolioWebsite: profile.portfolioWebsite || '',
        aboutMe: profile.aboutMe || '',
        avatarColor: profile.avatarColor || '#3B82F6',
      }

      reset(formData)

      // Find and set the province code if city exists
      if (profile.city && provinces.length > 0) {
        const province = provinces.find((p) => p.name === profile.city)
        if (province) {
          setSelectedProvinceCode(province.code)
          loadDistricts(province.code)
        }
      }
    }
  }, [profile, provinces, reset])

  useEffect(() => {
    loadProvinces()
  }, [])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await onUpdateProfile(data)
      setIsEditingProfile(false)
      setShowColorPicker(false)
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
    }
  }

  const handleCancel = () => {
    setIsEditingProfile(false)
    setShowColorPicker(false)
    // Reset form to original profile data
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        portfolioWebsite: profile.portfolioWebsite || '',
        aboutMe: profile.aboutMe || '',
        avatarColor: profile.avatarColor || '#3B82F6',
      })
    }
  }

  return (
    <Card className='mb-8 border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10'>
      <CardContent className='p-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8'>
          {/* Avatar */}
          <div className='relative'>
            <Avatar className='h-24 w-24 shadow-lg'>
              <AvatarFallback
                className='text-2xl font-semibold'
                style={getAvatarStyle(profile?.avatarColor || '#3B82F6')}
              >
                {profile?.firstName?.charAt(0)}
                {profile?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isEditingProfile && (
              <div className='relative'>
                <Button
                  size='sm'
                  className='absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg'
                  variant='secondary'
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Palette className='h-3 w-3' />
                </Button>

                {/* Color Picker Dropdown */}
                {showColorPicker && (
                  <div className='absolute top-full right-0 mt-2 p-3 bg-background border border-border rounded-lg shadow-lg z-10 w-48'>
                    <p className='text-sm font-medium mb-2'>Avatar Rengi</p>
                    <div className='grid grid-cols-5 gap-2'>
                      {avatarColors.map((color) => (
                        <button
                          key={color.color}
                          type='button'
                          className={`w-8 h-8 rounded-full border-2 ${
                            watchAvatarColor?.toLowerCase() === color.color.toLowerCase()
                              ? 'border-foreground'
                              : 'border-border'
                          } hover:scale-110 transition-transform`}
                          style={{ backgroundColor: color.color }}
                          onClick={() => {
                            setValue('avatarColor', color.color)
                            setShowColorPicker(false)
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-1'>
            {!isEditingProfile ? (
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h1 className='text-3xl font-bold text-foreground'>
                    {profile?.firstName} {profile?.lastName}
                  </h1>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsEditingProfile(true)}
                    className='flex items-center space-x-2'
                  >
                    <Edit3 className='h-4 w-4' />
                    <span>Düzenle</span>
                  </Button>
                </div>

                <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                  {profile?.email && (
                    <div className='flex items-center space-x-1'>
                      <Mail className='h-4 w-4' />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className='flex items-center space-x-1'>
                      <Phone className='h-4 w-4' />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.city && (
                    <div className='flex items-center space-x-1'>
                      <MapPin className='h-4 w-4' />
                      <span>
                        {profile.city}, {profile.country}
                      </span>
                    </div>
                  )}
                </div>

                {profile?.aboutMe && <p className='text-muted-foreground leading-relaxed'>{profile.aboutMe}</p>}

                <div className='flex space-x-3'>
                  {profile?.linkedin && (
                    <a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
                      <Button variant='outline' size='sm'>
                        <User className='h-4 w-4' />
                      </Button>
                    </a>
                  )}
                  {profile?.github && (
                    <a href={profile.github} target='_blank' rel='noopener noreferrer'>
                      <Button variant='outline' size='sm'>
                        <Globe className='h-4 w-4' />
                      </Button>
                    </a>
                  )}
                  {profile?.portfolioWebsite && (
                    <a href={profile.portfolioWebsite} target='_blank' rel='noopener noreferrer'>
                      <Button variant='outline' size='sm'>
                        <Globe className='h-4 w-4' />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Ad *</Label>
                    <Controller
                      name='firstName'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder='Adınız'
                        />
                      )}
                    />
                    {errors.firstName && <p className='text-sm text-red-500 mt-1'>{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label>Soyad *</Label>
                    <Controller
                      name='lastName'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder='Soyadınız'
                        />
                      )}
                    />
                    {errors.lastName && <p className='text-sm text-red-500 mt-1'>{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <Label>Telefon</Label>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder='Telefon numaranız'
                      />
                    )}
                  />
                  {errors.phone && <p className='text-sm text-red-500 mt-1'>{errors.phone.message}</p>}
                </div>

                {/* Avatar Color Preview in Edit Mode */}
                <div className='mb-4'>
                  <Label>Avatar Önizleme</Label>
                  <div className='flex items-center space-x-3 mt-2'>
                    <Avatar className='h-16 w-16 border-2 border-border'>
                      <AvatarFallback
                        className='text-lg font-semibold'
                        style={getAvatarStyle(watchAvatarColor || '#3B82F6')}
                      >
                        {watchFirstName?.charAt(0) || 'A'}
                        {watchLastName?.charAt(0) || 'B'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium'>Seçili Renk</p>
                      <p className='text-xs text-muted-foreground'>
                        {avatarColors.find((c) => c.color.toLowerCase() === watchAvatarColor?.toLowerCase())
                          ?.name || 'Varsayılan'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Şehir</Label>
                    <Select
                      value={selectedProvinceCode}
                      onValueChange={(value) => {
                        const selectedProvince = provinces.find((p) => p.code === value)
                        if (selectedProvince) {
                          handleProvinceChange(selectedProvince.code, selectedProvince.name)
                        } else {
                          setSelectedProvinceCode('')
                          setValue('city', '')
                          setValue('address', '')
                          setDistricts([])
                        }
                      }}
                      disabled={isLoadingProvinces}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Şehir seçin...' />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.code} value={province.code}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isLoadingProvinces && <p className='text-xs text-muted-foreground mt-1'>Şehirler yükleniyor...</p>}
                    {errors.city && <p className='text-sm text-red-500 mt-1'>{errors.city.message}</p>}
                  </div>
                  <div>
                    <Label>İlçe</Label>
                    <Controller
                      name='address'
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedProvinceCode || isLoadingDistricts || districts.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='İlçe seçin...' />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district.id} value={district.name}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {isLoadingDistricts && <p className='text-xs text-muted-foreground mt-1'>İlçeler yükleniyor...</p>}
                    {!selectedProvinceCode && <p className='text-xs text-muted-foreground mt-1'>Önce şehir seçin</p>}
                    {errors.address && <p className='text-sm text-red-500 mt-1'>{errors.address.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>LinkedIn</Label>
                    <Controller
                      name='linkedin'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder='LinkedIn profil URLsi'
                        />
                      )}
                    />
                    {errors.linkedin && <p className='text-sm text-red-500 mt-1'>{errors.linkedin.message}</p>}
                  </div>
                  <div>
                    <Label>GitHub</Label>
                    <Controller
                      name='github'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder='GitHub profil URLsi'
                        />
                      )}
                    />
                    {errors.github && <p className='text-sm text-red-500 mt-1'>{errors.github.message}</p>}
                  </div>
                </div>

                <div>
                  <Label>Portfolyo Website</Label>
                  <Controller
                    name='portfolioWebsite'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder='Portfolyo website URLsi'
                      />
                    )}
                  />
                  {errors.portfolioWebsite && <p className='text-sm text-red-500 mt-1'>{errors.portfolioWebsite.message}</p>}
                </div>

                <div>
                  <Label>Hakkımda</Label>
                  <Controller
                    name='aboutMe'
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder='Kendiniz hakkında detaylı bir açıklama...'
                        rows={4}
                      />
                    )}
                  />
                  {errors.aboutMe && <p className='text-sm text-red-500 mt-1'>{errors.aboutMe.message}</p>}
                </div>

                <div className='flex space-x-3'>
                  <Button type='submit' disabled={isLoading || isSubmitting}>
                    {(isLoading || isSubmitting) && (
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                    )}
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}