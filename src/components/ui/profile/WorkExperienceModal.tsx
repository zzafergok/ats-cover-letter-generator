'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Search } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

// Zod schema for form validation
const workExperienceSchema = z.object({
  companyName: z.string().min(1, 'Şirket adı zorunludur'),
  position: z.string().min(1, 'Pozisyon zorunludur'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', 'TEMPORARY']),
  workMode: z.enum(['ONSITE', 'REMOTE', 'HYBRID']),
  location: z.string().optional(),
  startMonth: z.number().min(1).max(12),
  startYear: z.number().min(1980).max(2030),
  endMonth: z.number().min(1).max(12).optional(),
  endYear: z.number().min(1980).max(2030).optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
  achievements: z.string().optional(),
})

type WorkExperienceFormData = z.infer<typeof workExperienceSchema>

export function WorkExperienceModal({
  isOpen,
  onClose,
  onSave,
  experience,
  isLoading = false,
}: WorkExperienceModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
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
    },
  })

  const watchIsCurrent = watch('isCurrent')

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
      const formData = {
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
      }

      reset(formData)
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
      reset({
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
  }, [experience, isOpen, reset])

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
    setValue('location', province.name)
    setLocationSearch(province.name)
    setShowLocationDropdown(false)
    setProvinces([])
    setUserIsTyping(false)
  }

  const addAchievement = () => {
    if (newAchievement.trim() && !achievementsList.includes(newAchievement.trim())) {
      const newList = [...achievementsList, newAchievement.trim()]
      setAchievementsList(newList)
      setValue('achievements', newList.join(', '))
      setNewAchievement('')
    }
  }

  const removeAchievement = (achievement: string) => {
    const newList = achievementsList.filter((a) => a !== achievement)
    setAchievementsList(newList)
    setValue('achievements', newList.join(', '))
  }

  const onSubmit = async (data: WorkExperienceFormData) => {
    try {
      const submitData = {
        companyName: data.companyName,
        position: data.position,
        employmentType: data.employmentType,
        workMode: data.workMode,
        location: data.location || undefined,
        startMonth: data.startMonth,
        startYear: data.startYear,
        endMonth: data.isCurrent ? undefined : data.endMonth,
        endYear: data.isCurrent ? undefined : data.endYear,
        isCurrent: data.isCurrent,
        description: data.description || undefined,
        achievements: data.achievements || undefined,
      }
      await onSave(submitData)
      onClose()
    } catch (error) {
      console.error('İş deneyimi kaydedilirken hata:', error)
    }
  }

  if (!isOpen) return null

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
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='companyName'>Şirket Adı *</Label>
                <Controller
                  name='companyName'
                  control={control}
                  render={({ field }) => <Input {...field} id='companyName' placeholder='Şirket adı' />}
                />
                {errors.companyName && <p className='text-sm text-red-500 mt-1'>{errors.companyName.message}</p>}
              </div>
              <div>
                <Label htmlFor='position'>Pozisyon *</Label>
                <Controller
                  name='position'
                  control={control}
                  render={({ field }) => <Input {...field} id='position' placeholder='İş pozisyonunuz' />}
                />
                {errors.position && <p className='text-sm text-red-500 mt-1'>{errors.position.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='employmentType'>İstihdam Türü *</Label>
                <Controller
                  name='employmentType'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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
                  )}
                />
                {errors.employmentType && <p className='text-sm text-red-500 mt-1'>{errors.employmentType.message}</p>}
              </div>
              <div>
                <Label htmlFor='workMode'>Çalışma Şekli *</Label>
                <Controller
                  name='workMode'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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
                  )}
                />
                {errors.workMode && <p className='text-sm text-red-500 mt-1'>{errors.workMode.message}</p>}
              </div>
            </div>

            <div className='relative'>
              <Label htmlFor='location'>Konum</Label>
              <Controller
                name='location'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='location'
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value)
                      field.onChange(e.target.value)
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
                )}
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
              {errors.location && <p className='text-sm text-red-500 mt-1'>{errors.location.message}</p>}
            </div>

            <div className={`grid gap-4 ${watchIsCurrent ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div>
                <Label>Başlangıç Tarihi *</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <Controller
                    name='startMonth'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || ''}>
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
                    )}
                  />
                  <Controller
                    name='startYear'
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        min='1980'
                        max='2030'
                        placeholder='Yıl'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    )}
                  />
                </div>
                {(errors.startMonth || errors.startYear) && (
                  <p className='text-sm text-red-500 mt-1'>{errors.startMonth?.message || errors.startYear?.message}</p>
                )}
              </div>
              {!watchIsCurrent && (
                <div>
                  <Label>Bitiş Tarihi</Label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Controller
                      name='endMonth'
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString() || '1'}
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
                      )}
                    />
                    <Controller
                      name='endYear'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='number'
                          min='1980'
                          max='2030'
                          placeholder='Yıl'
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      )}
                    />
                  </div>
                  {(errors.endMonth || errors.endYear) && (
                    <p className='text-sm text-red-500 mt-1'>{errors.endMonth?.message || errors.endYear?.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                name='isCurrent'
                control={control}
                render={({ field }) => (
                  <input
                    type='checkbox'
                    id='isCurrent'
                    checked={field.value}
                    onChange={field.onChange}
                    className='rounded'
                  />
                )}
              />
              <Label htmlFor='isCurrent'>Halen çalışıyorum</Label>
            </div>

            <div>
              <Label htmlFor='description'>İş Tanımı</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Textarea {...field} id='description' placeholder='İş tanımınız ve sorumluluklarınız' rows={3} />
                )}
              />
              {errors.description && <p className='text-sm text-red-500 mt-1'>{errors.description.message}</p>}
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
              {errors.achievements && <p className='text-sm text-red-500 mt-1'>{errors.achievements.message}</p>}
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={onClose}>
                İptal
              </Button>
              <Button type='submit' disabled={isLoading || isSubmitting}>
                {(isLoading || isSubmitting) && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                )}
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
