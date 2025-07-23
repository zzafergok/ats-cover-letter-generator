'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Search } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { locationApi } from '@/lib/api/api'
import type { WorkExperience, Province } from '@/types/api.types'

interface WorkExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<WorkExperience, 'id'>) => Promise<void>
  experience?: WorkExperience | null
  isLoading?: boolean
}

const employmentTypes = [
  { value: 'FULL_TIME', label: 'Tam Zamanlı' },
  { value: 'PART_TIME', label: 'Yarı Zamanlı' },
  { value: 'CONTRACT', label: 'Sözleşmeli' },
  { value: 'FREELANCE', label: 'Serbest Çalışan' },
  { value: 'INTERNSHIP', label: 'Staj' },
  { value: 'TEMPORARY', label: 'Geçici' },
] as const

const workModes = [
  { value: 'ONSITE', label: 'Ofiste' },
  { value: 'REMOTE', label: 'Uzaktan' },
  { value: 'HYBRID', label: 'Hibrit' },
]

const months = [
  { value: 1, label: 'Ocak' },
  { value: 2, label: 'Şubat' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'Nisan' },
  { value: 5, label: 'Mayıs' },
  { value: 6, label: 'Haziran' },
  { value: 7, label: 'Temmuz' },
  { value: 8, label: 'Ağustos' },
  { value: 9, label: 'Eylül' },
  { value: 10, label: 'Ekim' },
  { value: 11, label: 'Kasım' },
  { value: 12, label: 'Aralık' },
]

export function WorkExperienceModal({
  isOpen,
  onClose,
  onSave,
  experience,
  isLoading = false,
}: WorkExperienceModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    employmentType: 'FULL_TIME' as (typeof employmentTypes)[number]['value'],
    workMode: 'ONSITE' as 'ONSITE' | 'REMOTE' | 'HYBRID',
    location: '',
    startMonth: 1,
    startYear: new Date().getFullYear(),
    endMonth: 1,
    endYear: new Date().getFullYear(),
    isCurrent: false,
    description: '',
    achievements: '',
  })

  // Province search for location
  const [locationSearch, setLocationSearch] = useState('')
  const [provinces, setProvinces] = useState<Province[]>([])
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [userIsTyping, setUserIsTyping] = useState(false)

  const [newAchievement, setNewAchievement] = useState('')
  const [achievementsList, setAchievementsList] = useState<string[]>([])

  useEffect(() => {
    if (experience) {
      console.log('WorkExperience modal - received experience:', experience)
      console.log('Start month:', experience.startMonth, typeof experience.startMonth)
      console.log('End month:', experience.endMonth, typeof experience.endMonth)
      console.log('Start year:', experience.startYear, typeof experience.startYear)
      console.log('End year:', experience.endYear, typeof experience.endYear)
      console.log('Number conversion test:')
      console.log('Number(startMonth):', Number(experience.startMonth))
      console.log('Number(startYear):', Number(experience.startYear))

      setFormData({
        companyName: experience.companyName || '',
        position: experience.position || '',
        employmentType: experience.employmentType || 'FULL_TIME',
        workMode: experience.workMode || 'ONSITE',
        location: experience.location || '',
        startMonth: experience.startMonth ? Number(experience.startMonth) || 1 : 1,
        startYear: experience.startYear
          ? Number(experience.startYear) || new Date().getFullYear()
          : new Date().getFullYear(),
        endMonth: experience.endMonth ? Number(experience.endMonth) || 1 : 1,
        endYear: experience.endYear ? Number(experience.endYear) || new Date().getFullYear() : new Date().getFullYear(),
        isCurrent: experience.isCurrent || false,
        description: experience.description || '',
        achievements: experience.achievements || '',
      })

      console.log('FormData set with:', {
        startMonth: experience.startMonth ? Number(experience.startMonth) || 1 : 1,
        startYear: experience.startYear
          ? Number(experience.startYear) || new Date().getFullYear()
          : new Date().getFullYear(),
        endMonth: experience.endMonth ? Number(experience.endMonth) || 1 : 1,
        endYear: experience.endYear ? Number(experience.endYear) || new Date().getFullYear() : new Date().getFullYear(),
      })
      setLocationSearch(experience.location || '')

      // Parse achievements string to array for display
      if (experience.achievements) {
        setAchievementsList(
          experience.achievements
            .split(',')
            .map((a) => a.trim())
            .filter((a) => a.length > 0),
        )
      }
    } else {
      setFormData({
        companyName: '',
        position: '',
        employmentType: 'FULL_TIME',
        workMode: 'ONSITE',
        location: '',
        startMonth: 1,
        startYear: new Date().getFullYear(),
        endMonth: 1,
        endYear: new Date().getFullYear(),
        isCurrent: false,
        description: '',
        achievements: '',
      })
      setLocationSearch('')
      setAchievementsList([])
      setUserIsTyping(false)
      setShowLocationDropdown(false)
      setProvinces([])
    }
  }, [experience, isOpen])

  // Province search functionality
  useEffect(() => {
    const searchProvinces = async () => {
      if (!locationSearch.trim() || locationSearch.length < 2 || !userIsTyping) {
        setProvinces([])
        setShowLocationDropdown(false)
        return
      }

      setIsLoadingProvinces(true)
      try {
        const response = await locationApi.searchProvinces(locationSearch)
        setProvinces(response.data.slice(0, 10))
        setShowLocationDropdown(true)
      } catch (error) {
        console.error('Şehir arama hatası:', error)
        setProvinces([])
      } finally {
        setIsLoadingProvinces(false)
      }
    }

    const debounceTimer = setTimeout(searchProvinces, 300)
    return () => clearTimeout(debounceTimer)
  }, [locationSearch, userIsTyping])

  const handleLocationSelect = (province: Province) => {
    setFormData((prev) => ({ ...prev, location: province.name }))
    setLocationSearch(province.name)
    setShowLocationDropdown(false)
    setProvinces([])
    setUserIsTyping(false)
  }

  const addAchievement = () => {
    if (newAchievement.trim() && !achievementsList.includes(newAchievement.trim())) {
      const newList = [...achievementsList, newAchievement.trim()]
      setAchievementsList(newList)
      setFormData((prev) => ({ ...prev, achievements: newList.join(', ') }))
      setNewAchievement('')
    }
  }

  const removeAchievement = (achievement: string) => {
    const newList = achievementsList.filter((a) => a !== achievement)
    setAchievementsList(newList)
    setFormData((prev) => ({ ...prev, achievements: newList.join(', ') }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = {
        companyName: formData.companyName,
        position: formData.position,
        employmentType: formData.employmentType,
        workMode: formData.workMode,
        location: formData.location || undefined,
        startMonth: formData.startMonth,
        startYear: formData.startYear,
        endMonth: formData.isCurrent ? undefined : formData.endMonth,
        endYear: formData.isCurrent ? undefined : formData.endYear,
        isCurrent: formData.isCurrent,
        description: formData.description,
        achievements: formData.achievements || undefined,
      }
      await onSave(submitData)
      onClose()
    } catch (error) {
      console.error('İş deneyimi kaydedilirken hata:', error)
    }
  }

  if (!isOpen) return null

  console.log('Modal rendering with formData:', {
    startMonth: formData.startMonth,
    startYear: formData.startYear,
    endMonth: formData.endMonth,
    endYear: formData.endYear,
  })

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>{experience ? 'İş Deneyimini Düzenle' : 'Yeni İş Deneyimi Ekle'}</CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='companyName'>Şirket Adı *</Label>
                <Input
                  id='companyName'
                  value={formData.companyName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  placeholder='Şirket adı'
                  required
                />
              </div>
              <div>
                <Label htmlFor='position'>Pozisyon *</Label>
                <Input
                  id='position'
                  value={formData.position}
                  onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                  placeholder='İş pozisyonunuz'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='employmentType'>İstihdam Türü *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, employmentType: value as typeof formData.employmentType }))
                  }
                >
                  <SelectTrigger id='employmentType'>
                    <SelectValue placeholder='İstihdam türü seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='workMode'>Çalışma Şekli *</Label>
                <Select
                  value={formData.workMode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, workMode: value as typeof formData.workMode }))
                  }
                >
                  <SelectTrigger id='workMode'>
                    <SelectValue placeholder='Çalışma şekli seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    {workModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='relative'>
              <Label htmlFor='location'>Konum</Label>
              <Input
                id='location'
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value)
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                  setUserIsTyping(true)
                }}
                onFocus={() => {
                  if (locationSearch.length >= 2) {
                    setUserIsTyping(true)
                  }
                }}
                placeholder='Şehir ara...'
                endIcon={<Search className='h-4 w-4' />}
              />

              {/* Location dropdown */}
              {showLocationDropdown && provinces.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto'>
                  {provinces.map((province) => (
                    <div
                      key={province.code}
                      className='px-3 py-2 hover:bg-muted cursor-pointer text-sm'
                      onClick={() => handleLocationSelect(province)}
                    >
                      <div className='font-medium'>{province.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {isLoadingProvinces && (
                <div className='absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3 text-center text-sm text-muted-foreground'>
                  Şehirler aranıyor...
                </div>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Başlangıç Tarihi *</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <Select
                    value={!isNaN(formData.startMonth) ? formData.startMonth.toString() : '1'}
                    onValueChange={(value) => {
                      console.log('Start month changed to:', value, typeof value)
                      const numValue = parseInt(value)
                      console.log('Parsed value:', numValue)
                      if (!isNaN(numValue)) {
                        setFormData((prev) => ({ ...prev, startMonth: numValue }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Ay' />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type='number'
                    min='1980'
                    max='2030'
                    value={formData.startYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startYear: parseInt(e.target.value) }))}
                    placeholder='Yıl'
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Bitiş Tarihi</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <Select
                    value={!isNaN(formData.endMonth) ? formData.endMonth.toString() : '1'}
                    onValueChange={(value) => {
                      const numValue = parseInt(value)
                      if (!isNaN(numValue)) {
                        setFormData((prev) => ({ ...prev, endMonth: numValue }))
                      }
                    }}
                    disabled={formData.isCurrent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Ay' />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type='number'
                    min='1980'
                    max='2030'
                    value={formData.endYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endYear: parseInt(e.target.value) }))}
                    placeholder='Yıl'
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isCurrent'
                checked={formData.isCurrent}
                onChange={(e) => setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))}
                className='rounded'
              />
              <Label htmlFor='isCurrent'>Halen çalışıyorum</Label>
            </div>

            <div>
              <Label htmlFor='description'>İş Tanımı *</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='İş tanımınız ve sorumluluklarınız'
                rows={3}
                required
              />
            </div>

            <div>
              <Label>Başarılar</Label>
              <div className='flex space-x-2 mb-2'>
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder='Önemli başarılarınızı ekleyin'
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                />
                <Button type='button' onClick={addAchievement} variant='outline'>
                  Ekle
                </Button>
              </div>
              <div className='space-y-2'>
                {achievementsList.map((achievement, index) => (
                  <div key={index} className='flex items-center justify-between p-2 bg-muted/50 rounded-md border'>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm font-medium'>•</span>
                      <span className='text-sm'>{achievement}</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeAchievement(achievement)}
                      className='text-muted-foreground hover:text-destructive transition-colors'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={onClose}>
                İptal
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />}
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
