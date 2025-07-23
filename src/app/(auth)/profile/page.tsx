/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit3,
  Plus,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Star,
  Palette,
  Save,
  X,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

import { useUserProfileStore } from '@/store/userProfileStore'
import { locationApi } from '@/lib/api/api'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Avatar, AvatarFallback } from '@/components/core/avatar'
import { Badge } from '@/components/core/badge'
import { Input } from '@/components/core/input'
import { Textarea } from '@/components/core/textarea'
import { Label } from '@/components/core/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { EducationModal } from '@/components/ui/profile/EducationModal'
import { WorkExperienceModal } from '@/components/ui/profile/WorkExperienceModal'
import { SkillModal } from '@/components/ui/profile/SkillModal'

import type { Education, WorkExperience, Skill, Course, Certificate, Province, District } from '@/types/api.types'

const skillLevels = [
  { value: 'BEGINNER', label: 'Başlangıç', color: 'bg-slate-100 text-slate-800' },
  { value: 'INTERMEDIATE', label: 'Orta', color: 'bg-blue-100 text-blue-800' },
  { value: 'ADVANCED', label: 'İleri', color: 'bg-orange-100 text-orange-800' },
  { value: 'EXPERT', label: 'Uzman', color: 'bg-green-100 text-green-800' },
]

export default function ProfilePage() {
  const router = useRouter()

  const {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    clearError,
    addEducation,
    addWorkExperience,
    addSkill,
    updateEducation,
    updateWorkExperience,
    updateSkill,
    deleteEducation,
  } = useUserProfileStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editingItem, setEditingItem] = useState<{ type: string; id: string; data: unknown } | null>(null)
  const [modalStates, setModalStates] = useState({
    education: false,
    experience: false,
    skill: false,
  })

  // Location state
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('')
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

  // Basic profile edit state - Schema'daki tüm User alanları
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

  // Avatar color options with hex color codes
  const avatarColors = [
    { name: 'Mavi', color: '#3b82f6', textColor: '#ffffff' },
    { name: 'Yeşil', color: '#10b981', textColor: '#ffffff' },
    { name: 'Mor', color: '#8b5cf6', textColor: '#ffffff' },
    { name: 'Kırmızı', color: '#ef4444', textColor: '#ffffff' },
    { name: 'Turuncu', color: '#f97316', textColor: '#ffffff' },
    { name: 'Pembe', color: '#ec4899', textColor: '#ffffff' },
    { name: 'İndigo', color: '#6366f1', textColor: '#ffffff' },
    { name: 'Gri', color: '#6b7280', textColor: '#ffffff' },
    { name: 'Cyan', color: '#06b6d4', textColor: '#ffffff' },
    { name: 'Sarı', color: '#eab308', textColor: '#000000' },
  ]

  // Get avatar style based on hex color
  const getAvatarStyle = (hexColor: string) => {
    const selectedColor = avatarColors.find((color) => color.color === hexColor)
    return {
      backgroundColor: hexColor || '#3b82f6',
      color: selectedColor?.textColor || '#ffffff',
    }
  }

  // Avatar color picker state
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    getProfile()
    loadProvinces()
  }, [getProfile])

  // Load provinces on component mount
  const loadProvinces = async () => {
    try {
      setIsLoadingProvinces(true)
      const response = await locationApi.getProvinces()
      setProvinces(response.data)
    } catch (error) {
      console.error('İller yüklenirken hata:', error)
    } finally {
      setIsLoadingProvinces(false)
    }
  }

  // Load districts when province is selected (for manual selection)
  const handleProvinceChange = async (provinceCode: string, provinceName: string) => {
    setSelectedProvinceCode(provinceCode)
    setProfileForm((prev) => ({ ...prev, city: provinceName, address: '' }))

    // Load districts for new province selection (don't preserve address for manual changes)
    await loadDistrictsForProvince(provinceCode)
  }

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
        avatarColor: profile.avatarColor || '#3b82f6',
      })

      // Set selected province if city exists and load districts
      if (profile.city && provinces.length > 0) {
        const matchingProvince = provinces.find((p) => p.name === profile.city)
        if (matchingProvince) {
          setSelectedProvinceCode(matchingProvince.code)
          // Load districts for the selected province and preserve address value
          loadDistrictsForProvince(matchingProvince.code, profile.address)
        }
      }
    }
  }, [profile, provinces])

  // Load districts and preserve address value
  const loadDistrictsForProvince = async (provinceCode: string, preserveAddress?: string) => {
    if (!provinceCode) return

    try {
      setIsLoadingDistricts(true)
      const response = await locationApi.getDistrictsByProvinceCode(provinceCode)
      setDistricts(response.data)

      // If we have an address to preserve (from existing profile), keep it
      if (preserveAddress) {
        setProfileForm((prev) => ({ ...prev, address: preserveAddress }))
      }
    } catch (error) {
      console.error('İlçeler yüklenirken hata:', error)
      setDistricts([])
    } finally {
      setIsLoadingDistricts(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      console.log('Sending profile update with avatarColor:', profileForm.avatarColor)
      await updateProfile(profileForm)
      console.log('Profile updated successfully')
      setIsEditingProfile(false)

      // Refresh profile data to ensure latest data is loaded
      await getProfile()
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  // Modal açma/kapama handler'ları
  const openModal = (type: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [type]: true }))
    setEditingItem(null)
  }

  const closeModal = (type: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [type]: false }))
    setEditingItem(null)
  }

  const openEditModal = (type: keyof typeof modalStates, id: string, data: unknown) => {
    setEditingItem({ type, id, data })
    setModalStates((prev) => ({ ...prev, [type]: true }))
  }

  // Eğitim işlemleri
  const handleSaveEducation = async (data: Omit<Education, 'id'>) => {
    try {
      if (editingItem && editingItem.type === 'education') {
        await updateEducation(editingItem.id, data)
      } else {
        await addEducation(data)
      }
      closeModal('education')
    } catch (error) {
      console.error('Eğitim kaydedilirken hata:', error)
      throw error
    }
  }

  const handleDeleteEducation = async (id: string) => {
    try {
      await deleteEducation(id)
    } catch (error) {
      console.error('Eğitim silinirken hata:', error)
    }
  }

  // İş deneyimi işlemleri
  const handleSaveWorkExperience = async (data: Omit<WorkExperience, 'id'>) => {
    try {
      if (editingItem && editingItem.type === 'experience') {
        await updateWorkExperience(editingItem.id, data)
      } else {
        await addWorkExperience(data)
      }
      closeModal('experience')
    } catch (error) {
      console.error('Deneyim kaydedilirken hata:', error)
      throw error
    }
  }

  // Yetenek işlemleri
  const handleSaveSkill = async (data: Omit<Skill, 'id'>) => {
    try {
      if (editingItem && editingItem.type === 'skill') {
        await updateSkill(editingItem.id, data)
      } else {
        await addSkill(data)
      }
      closeModal('skill')
    } catch (error) {
      console.error('Yetenek kaydedilirken hata:', error)
      throw error
    }
  }

  if (isLoading && !profile) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <LoadingSpinner size='lg' className='mx-auto mb-4' />
          <p className='text-muted-foreground'>Profil yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push('/dashboard')}
              className='flex items-center space-x-2'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>Dashboard'a Dön</span>
            </Button>
          </div>

          {error && (
            <div className='bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2'>
              <p className='text-sm text-destructive'>{error}</p>
              <Button variant='ghost' size='sm' onClick={clearError}>
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header Card */}
        <Card className='mb-8 border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10'>
          <CardContent className='p-8'>
            <div className='flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8'>
              {/* Avatar */}
              <div className='relative'>
                <Avatar className='h-24 w-24 border-4 border-background shadow-lg'>
                  <AvatarFallback
                    className='text-2xl font-semibold'
                    style={getAvatarStyle(profile?.avatarColor || '#3b82f6')}
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
                                profileForm.avatarColor === color.color ? 'border-foreground' : 'border-border'
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
                              style={getAvatarStyle(profileForm.avatarColor || '#3b82f6')}
                            >
                              {profileForm.firstName?.charAt(0) || 'A'}
                              {profileForm.lastName?.charAt(0) || 'B'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='text-sm font-medium'>Seçili Renk</p>
                            <p className='text-xs text-muted-foreground'>
                              {avatarColors.find((c) => c.color === profileForm.avatarColor)?.name || 'Varsayılan'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label>Şehir *</Label>
                        <select
                          value={selectedProvinceCode}
                          onChange={(e) => {
                            const selectedProvince = provinces.find((p) => p.code === e.target.value)
                            if (selectedProvince) {
                              handleProvinceChange(selectedProvince.code, selectedProvince.name)
                            } else {
                              setSelectedProvinceCode('')
                              setProfileForm((prev) => ({ ...prev, city: '', address: '' }))
                              setDistricts([])
                            }
                          }}
                          disabled={isLoadingProvinces}
                          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          <option value=''>Şehir seçin...</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                        {isLoadingProvinces && (
                          <p className='text-xs text-muted-foreground mt-1'>Şehirler yükleniyor...</p>
                        )}
                      </div>
                      <div>
                        <Label>İlçe</Label>
                        <select
                          value={profileForm.address}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                          disabled={!selectedProvinceCode || isLoadingDistricts || districts.length === 0}
                          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          <option value=''>İlçe seçin...</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        {isLoadingDistricts && (
                          <p className='text-xs text-muted-foreground mt-1'>İlçeler yükleniyor...</p>
                        )}
                        {!selectedProvinceCode && (
                          <p className='text-xs text-muted-foreground mt-1'>Önce şehir seçin</p>
                        )}
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

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <TabsList className='grid w-full grid-cols-6 lg:w-fit'>
            <TabsTrigger value='overview' className='flex items-center space-x-2'>
              <User className='h-4 w-4' />
              <span className='hidden sm:inline'>Genel</span>
            </TabsTrigger>
            <TabsTrigger value='education' className='flex items-center space-x-2'>
              <GraduationCap className='h-4 w-4' />
              <span className='hidden sm:inline'>Eğitim</span>
            </TabsTrigger>
            <TabsTrigger value='experience' className='flex items-center space-x-2'>
              <Briefcase className='h-4 w-4' />
              <span className='hidden sm:inline'>Deneyim</span>
            </TabsTrigger>
            <TabsTrigger value='skills' className='flex items-center space-x-2'>
              <Star className='h-4 w-4' />
              <span className='hidden sm:inline'>Yetenekler</span>
            </TabsTrigger>
            <TabsTrigger value='courses' className='flex items-center space-x-2'>
              <BookOpen className='h-4 w-4' />
              <span className='hidden sm:inline'>Kurslar</span>
            </TabsTrigger>
            <TabsTrigger value='certificates' className='flex items-center space-x-2'>
              <Award className='h-4 w-4' />
              <span className='hidden sm:inline'>Sertifikalar</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
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
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value='education' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Eğitim Geçmişi</h2>
                <p className='text-muted-foreground'>Eğitim bilgilerinizi yönetin</p>
              </div>
              <Button onClick={() => openModal('education')} className='flex items-center space-x-2'>
                <Plus className='h-4 w-4' />
                <span>Eğitim Ekle</span>
              </Button>
            </div>

            <div className='grid gap-4'>
              {profile?.educations?.map((edu: Education) => {
                // Fallback for missing educationType - try to guess from gradeSystem or set default
                const educationType = edu.educationType || (edu.gradeSystem === 'PERCENTAGE' ? 'LISE' : 'LISANS')

                return (
                  <Card key={edu.id} className='hover:shadow-lg transition-shadow'>
                    <CardContent className='p-6'>
                      <div className='flex justify-between items-start'>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between'>
                            <h3 className='font-semibold text-lg'>{edu.degree}</h3>
                            <Badge variant='outline' className='text-xs'>
                              {educationType === 'LISE'
                                ? 'Lise'
                                : educationType === 'ONLISANS'
                                  ? 'Önlisans'
                                  : educationType === 'LISANS'
                                    ? 'Lisans'
                                    : 'Yüksek Lisans'}
                            </Badge>
                          </div>
                          <p className='text-muted-foreground'>{edu.schoolName}</p>
                          <p className='text-sm text-muted-foreground'>
                            {edu.fieldOfStudy} • {edu.startYear} - {edu.endYear || 'Devam ediyor'}
                          </p>
                          {edu.description && <p className='text-sm text-muted-foreground mt-2'>{edu.description}</p>}
                          {edu.grade && (
                            <Badge variant='secondary'>
                              {edu.gradeSystem === 'GPA_4' ? 'GPA' : 'Not'}: {edu.grade}
                            </Badge>
                          )}
                        </div>
                        <div className='flex gap-2'>
                          <Button variant='ghost' size='sm' onClick={() => openEditModal('education', edu.id, edu)}>
                            <Edit3 className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteEducation(edu.id)}
                            className='text-destructive hover:text-destructive'
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {(!profile?.educations || profile.educations.length === 0) && (
                <Card className='border-dashed'>
                  <CardContent className='p-12 text-center'>
                    <GraduationCap className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                    <p className='text-muted-foreground mb-4'>Henüz eğitim kaydınız bulunmuyor</p>
                    <Button onClick={() => openModal('education')} variant='outline'>
                      İlk eğitiminizi ekleyin
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value='experience' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>İş Deneyimi</h2>
                <p className='text-muted-foreground'>İş deneyimlerinizi yönetin</p>
              </div>
              <Button className='flex items-center space-x-2'>
                <Plus className='h-4 w-4' />
                <span>Deneyim Ekle</span>
              </Button>
            </div>

            <div className='grid gap-4'>
              {profile?.experiences?.map((exp: WorkExperience) => (
                <Card key={exp.id} className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex justify-between items-start'>
                      <div className='space-y-2'>
                        <h3 className='font-semibold text-lg'>{exp.position}</h3>
                        <p className='text-muted-foreground'>{exp.companyName}</p>
                        <p className='text-sm text-muted-foreground'>
                          {exp.startMonth}/{exp.startYear} -{' '}
                          {exp.endMonth && exp.endYear ? `${exp.endMonth}/${exp.endYear}` : 'Devam ediyor'}
                        </p>
                        {exp.location && (
                          <p className='text-sm text-muted-foreground flex items-center'>
                            <MapPin className='h-3 w-3 mr-1' />
                            {exp.location}
                          </p>
                        )}
                        <p className='text-sm text-muted-foreground mt-2'>{exp.description}</p>
                        {exp.achievements && (
                          <p className='text-sm text-muted-foreground mt-2'>
                            <strong>Başarılar:</strong> {exp.achievements}
                          </p>
                        )}
                      </div>
                      <Button variant='ghost' size='sm'>
                        <Edit3 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!profile?.experiences || profile.experiences.length === 0) && (
                <Card className='border-dashed'>
                  <CardContent className='p-12 text-center'>
                    <Briefcase className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                    <p className='text-muted-foreground mb-4'>Henüz iş deneyiminiz bulunmuyor</p>
                    <Button variant='outline'>İlk deneyiminizi ekleyin</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value='skills' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Yetenekler</h2>
                <p className='text-muted-foreground'>Yeteneklerinizi kategorilere göre yönetin</p>
              </div>
              <Button className='flex items-center space-x-2'>
                <Plus className='h-4 w-4' />
                <span>Yetenek Ekle</span>
              </Button>
            </div>

            {profile?.skills && profile.skills.length > 0 ? (
              <div className='grid gap-6'>
                {Object.entries(
                  profile.skills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
                    const category = skill.category || 'Diğer'
                    if (!acc[category]) acc[category] = []
                    acc[category].push(skill)
                    return acc
                  }, {}),
                ).map(([category, categorySkills]) => (
                  <Card key={category} className='hover:shadow-lg transition-shadow'>
                    <CardHeader>
                      <CardTitle className='text-lg'>{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {categorySkills.map((skill: Skill) => {
                          const levelInfo = skillLevels.find((l) => l.value === skill.level)
                          return (
                            <div key={skill.id} className='flex items-center justify-between p-3 border rounded-lg'>
                              <div>
                                <p className='font-medium'>{skill.name}</p>
                                {skill.yearsOfExperience && (
                                  <p className='text-xs text-muted-foreground'>{skill.yearsOfExperience} yıl deneyim</p>
                                )}
                              </div>
                              <Badge className={levelInfo?.color}>{levelInfo?.label}</Badge>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className='border-dashed'>
                <CardContent className='p-12 text-center'>
                  <Star className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <p className='text-muted-foreground mb-4'>Henüz yeteneğiniz bulunmuyor</p>
                  <Button variant='outline'>İlk yeteneğinizi ekleyin</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value='courses' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Kurslar</h2>
                <p className='text-muted-foreground'>Tamamladığınız kursları yönetin</p>
              </div>
              <Button className='flex items-center space-x-2'>
                <Plus className='h-4 w-4' />
                <span>Kurs Ekle</span>
              </Button>
            </div>

            <div className='grid gap-4'>
              {profile?.courses?.map((course: Course) => (
                <Card key={course.id} className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex justify-between items-start'>
                      <div className='space-y-2'>
                        <h3 className='font-semibold text-lg'>{course.courseName}</h3>
                        <p className='text-muted-foreground'>{course.provider}</p>
                        {course.endMonth && course.endYear && (
                          <p className='text-sm text-muted-foreground flex items-center'>
                            <CheckCircle2 className='h-3 w-3 mr-1 text-green-600' />
                            Tamamlandı: {course.endMonth}/{course.endYear}
                          </p>
                        )}
                        {course.duration && <Badge variant='secondary'>{course.duration}</Badge>}
                        {course.description && (
                          <p className='text-sm text-muted-foreground mt-2'>{course.description}</p>
                        )}
                      </div>
                      <div className='flex space-x-2'>
                        <Button variant='ghost' size='sm'>
                          <Edit3 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!profile?.courses || profile.courses.length === 0) && (
                <Card className='border-dashed'>
                  <CardContent className='p-12 text-center'>
                    <BookOpen className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                    <p className='text-muted-foreground mb-4'>Henüz kursunuz bulunmuyor</p>
                    <Button variant='outline'>İlk kursunuzu ekleyin</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value='certificates' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Sertifikalar</h2>
                <p className='text-muted-foreground'>Sertifikalarınızı yönetin</p>
              </div>
              <Button className='flex items-center space-x-2'>
                <Plus className='h-4 w-4' />
                <span>Sertifika Ekle</span>
              </Button>
            </div>

            <div className='grid gap-4'>
              {profile?.certificates?.map((cert: Certificate) => (
                <Card key={cert.id} className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex justify-between items-start'>
                      <div className='space-y-2'>
                        <h3 className='font-semibold text-lg'>{cert.certificateName}</h3>
                        <p className='text-muted-foreground'>{cert.issuer}</p>
                        <p className='text-sm text-muted-foreground'>
                          {cert.issueMonth && cert.issueYear && `Verilme: ${cert.issueMonth}/${cert.issueYear}`}
                          {cert.expiryMonth && cert.expiryYear && (
                            <span>
                              {' '}
                              • Geçerli: {cert.expiryMonth}/{cert.expiryYear}
                            </span>
                          )}
                        </p>
                        {cert.credentialId && (
                          <p className='text-xs text-muted-foreground'>Kimlik: {cert.credentialId}</p>
                        )}
                        {cert.description && <p className='text-sm text-muted-foreground mt-2'>{cert.description}</p>}
                      </div>
                      <div className='flex space-x-2'>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target='_blank' rel='noopener noreferrer'>
                            <Button variant='outline' size='sm'>
                              <Globe className='h-3 w-3 mr-1' />
                              Görüntüle
                            </Button>
                          </a>
                        )}
                        <Button variant='ghost' size='sm'>
                          <Edit3 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!profile?.certificates || profile.certificates.length === 0) && (
                <Card className='border-dashed'>
                  <CardContent className='p-12 text-center'>
                    <Award className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                    <p className='text-muted-foreground mb-4'>Henüz sertifikanız bulunmuyor</p>
                    <Button variant='outline'>İlk sertifikanızı ekleyin</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EducationModal
        isOpen={modalStates.education}
        onClose={() => closeModal('education')}
        onSave={handleSaveEducation}
        education={editingItem?.type === 'education' ? (editingItem.data as Education) : null}
        isLoading={isLoading}
      />

      <WorkExperienceModal
        isOpen={modalStates.experience}
        onClose={() => closeModal('experience')}
        onSave={handleSaveWorkExperience}
        experience={editingItem?.type === 'experience' ? (editingItem.data as WorkExperience) : null}
        isLoading={isLoading}
      />

      <SkillModal
        isOpen={modalStates.skill}
        onClose={() => closeModal('skill')}
        onSave={handleSaveSkill}
        skill={editingItem?.type === 'skill' ? (editingItem.data as Skill) : null}
        isLoading={isLoading}
      />
    </div>
  )
}
