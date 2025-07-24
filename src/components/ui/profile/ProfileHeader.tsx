'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Globe, Edit3, User, Palette, Save, X } from 'lucide-react'

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

export function ProfileHeader({ profile, isLoading, onUpdateProfile }: ProfileHeaderProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Location state
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('')
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

  // Basic profile edit state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    github: '',
    linkedin: '',
    portfolioWebsite: '',
    portfolioTitle: '',
    aboutMe: '',
    avatarColor: '',
  })

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
    setProfileForm((prev) => ({ ...prev, city: provinceName, address: '' }))
    loadDistricts(provinceCode)
  }

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        portfolioWebsite: profile.portfolioWebsite || '',
        portfolioTitle: profile.portfolioTitle || '',
        aboutMe: profile.aboutMe || '',
        avatarColor: profile.avatarColor || '#3B82F6',
      })

      // Find and set the province code if city exists
      if (profile.city && provinces.length > 0) {
        const province = provinces.find((p) => p.name === profile.city)
        if (province) {
          setSelectedProvinceCode(province.code)
          loadDistricts(province.code)
        }
      }
    }
  }, [profile, provinces])

  useEffect(() => {
    loadProvinces()
  }, [])

  const handleProfileUpdate = async () => {
    try {
      await onUpdateProfile(profileForm)
      setIsEditingProfile(false)
      setShowColorPicker(false)
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
    }
  }

  return (
    <Card className='mb-8 border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10'>
      <CardContent className='p-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8'>
          {/* Avatar */}
          <div className='relative'>
            <Avatar className='h-24 w-24 border-4 border-background shadow-lg'>
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
                            profileForm.avatarColor?.toLowerCase() === color.color.toLowerCase()
                              ? 'border-foreground'
                              : 'border-border'
                          } hover:scale-110 transition-transform`}
                          style={{ backgroundColor: color.color }}
                          onClick={() => {
                            setProfileForm((prev) => ({ ...prev, avatarColor: color.color }))
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
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Ad</Label>
                    <Input
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                      placeholder='Adınız'
                    />
                  </div>
                  <div>
                    <Label>Soyad</Label>
                    <Input
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                      placeholder='Soyadınız'
                    />
                  </div>
                </div>

                <div>
                  <Label>Telefon</Label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder='Telefon numaranız'
                  />
                </div>

                {/* Avatar Color Preview in Edit Mode */}
                {isEditingProfile && (
                  <div className='mb-4'>
                    <Label>Avatar Önizleme</Label>
                    <div className='flex items-center space-x-3 mt-2'>
                      <Avatar className='h-16 w-16 border-2 border-border'>
                        <AvatarFallback
                          className='text-lg font-semibold'
                          style={getAvatarStyle(profileForm.avatarColor || '#3B82F6')}
                        >
                          {profileForm.firstName?.charAt(0) || 'A'}
                          {profileForm.lastName?.charAt(0) || 'B'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium'>Seçili Renk</p>
                        <p className='text-xs text-muted-foreground'>
                          {avatarColors.find((c) => c.color.toLowerCase() === profileForm.avatarColor?.toLowerCase())
                            ?.name || 'Varsayılan'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Şehir *</Label>
                    <Select
                      value={selectedProvinceCode}
                      onValueChange={(value) => {
                        const selectedProvince = provinces.find((p) => p.code === value)
                        if (selectedProvince) {
                          handleProvinceChange(selectedProvince.code, selectedProvince.name)
                        } else {
                          setSelectedProvinceCode('')
                          setProfileForm((prev) => ({ ...prev, city: '', address: '' }))
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
                  </div>
                  <div>
                    <Label>İlçe</Label>
                    <Select
                      value={profileForm.address}
                      onValueChange={(value) => setProfileForm((prev) => ({ ...prev, address: value }))}
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
                    {isLoadingDistricts && <p className='text-xs text-muted-foreground mt-1'>İlçeler yükleniyor...</p>}
                    {!selectedProvinceCode && <p className='text-xs text-muted-foreground mt-1'>Önce şehir seçin</p>}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>LinkedIn</Label>
                    <Input
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                      placeholder='LinkedIn profil URLsi'
                    />
                  </div>
                  <div>
                    <Label>GitHub</Label>
                    <Input
                      value={profileForm.github}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, github: e.target.value }))}
                      placeholder='GitHub profil URLsi'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Portfolyo Website</Label>
                    <Input
                      value={profileForm.portfolioWebsite}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, portfolioWebsite: e.target.value }))}
                      placeholder='Portfolyo website URLsi'
                    />
                  </div>
                  <div>
                    <Label>Portfolyo Başlığı</Label>
                    <Input
                      value={profileForm.portfolioTitle}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, portfolioTitle: e.target.value }))}
                      placeholder='Portfolyo başlığınız'
                    />
                  </div>
                </div>

                <div>
                  <Label>Hakkımda</Label>
                  <Textarea
                    value={profileForm.aboutMe}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, aboutMe: e.target.value }))}
                    placeholder='Kendiniz hakkında detaylı bir açıklama...'
                    rows={4}
                  />
                </div>

                <div className='flex space-x-3'>
                  <Button onClick={handleProfileUpdate} disabled={isLoading}>
                    <Save className='h-4 w-4 mr-2' />
                    Kaydet
                  </Button>
                  <Button variant='outline' onClick={() => setIsEditingProfile(false)}>
                    <X className='h-4 w-4 mr-2' />
                    İptal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
