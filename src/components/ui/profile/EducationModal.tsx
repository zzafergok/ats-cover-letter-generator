'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, GraduationCap, BookOpen, Award, Search } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { schoolApi } from '@/lib/api/api'
import type { Education, EducationType, HighSchool, University } from '@/types/api.types'

interface EducationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Education, 'id'>) => Promise<void>
  education?: Education | null
  isLoading?: boolean
}

const educationTypes = [
  {
    type: 'LISE' as EducationType,
    label: 'Lise',
    icon: BookOpen,
    gradeSystem: 'PERCENTAGE' as const,
    degree: 'Lise Diploması',
  },
  {
    type: 'ONLISANS' as EducationType,
    label: 'Önlisans',
    icon: GraduationCap,
    gradeSystem: 'GPA_4' as const,
    degree: 'Ön Lisans',
  },
  {
    type: 'LISANS' as EducationType,
    label: 'Lisans',
    icon: GraduationCap,
    gradeSystem: 'GPA_4' as const,
    degree: 'Lisans',
  },
  {
    type: 'YUKSEKLISANS' as EducationType,
    label: 'Yüksek Lisans',
    icon: Award,
    gradeSystem: 'GPA_4' as const,
    degree: 'Yüksek Lisans',
  },
]

// Zod schema for form validation
const educationSchema = z.object({
  schoolName: z.string().min(1, 'Okul adı zorunludur'),
  degree: z.string().min(1, 'Derece zorunludur'),
  fieldOfStudy: z.string().min(1, 'Bölüm zorunludur'),
  grade: z.string().optional(),
  gradeSystem: z.enum(['PERCENTAGE', 'GPA_4']),
  educationType: z.enum(['LISE', 'ONLISANS', 'LISANS', 'YUKSEKLISANS']),
  startYear: z.number().min(1980).max(2030),
  endYear: z.number().min(1980).max(2030).optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
})

type EducationFormData = z.infer<typeof educationSchema>

export function EducationModal({ isOpen, onClose, onSave, education, isLoading = false }: EducationModalProps) {
  const [step, setStep] = useState<'type' | 'form'>('type')
  const [selectedType, setSelectedType] = useState<EducationType | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      schoolName: '',
      degree: '',
      fieldOfStudy: '',
      grade: '',
      gradeSystem: 'GPA_4',
      educationType: 'LISANS',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      isCurrent: false,
      description: '',
    },
  })

  const watchIsCurrent = watch('isCurrent')

  // School search state
  const [schoolSearch, setSchoolSearch] = useState('')
  const [schools, setSchools] = useState<(HighSchool | University)[]>([])
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [isLoadingSchools, setIsLoadingSchools] = useState(false)

  useEffect(() => {
    if (education) {
      // Fallback for missing educationType
      const educationType = education.educationType || (education.gradeSystem === 'PERCENTAGE' ? 'LISE' : 'LISANS')
      const selectedEducationType = educationTypes.find((t) => t.type === educationType)

      setStep('form')
      setSelectedType(educationType)

      const formData = {
        schoolName: education.schoolName || '',
        degree: selectedEducationType?.degree || education.degree || '',
        fieldOfStudy: education.fieldOfStudy || '',
        grade: education.grade?.toString() || '',
        gradeSystem: education.gradeSystem || 'GPA_4',
        educationType: educationType,
        startYear: Number(education.startYear) || new Date().getFullYear(),
        endYear: Number(education.endYear) || new Date().getFullYear(),
        isCurrent: education.isCurrent || false,
        description: education.description || '',
      }

      reset(formData)
      setSchoolSearch(education.schoolName || '')
    } else {
      setStep('type')
      setSelectedType(null)
      reset({
        schoolName: '',
        degree: '',
        fieldOfStudy: '',
        grade: '',
        gradeSystem: 'GPA_4',
        educationType: 'LISANS',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear(),
        isCurrent: false,
        description: '',
      })
      setSchoolSearch('')
    }
  }, [education, isOpen, reset])

  // School search functionality
  useEffect(() => {
    const searchSchools = async () => {
      if (!schoolSearch.trim() || schoolSearch.length < 2) {
        setSchools([])
        setShowSchoolDropdown(false)
        return
      }

      setIsLoadingSchools(true)
      try {
        if (selectedType === 'LISE') {
          const response = await schoolApi.searchHighSchools(schoolSearch)
          setSchools(response.data.slice(0, 10))
        } else {
          const response = await schoolApi.searchUniversities(schoolSearch)
          setSchools(response.data.slice(0, 10))
        }
        setShowSchoolDropdown(true)
      } catch (error) {
        console.error('Okul arama hatası:', error)
        setSchools([])
      } finally {
        setIsLoadingSchools(false)
      }
    }

    const debounceTimer = setTimeout(searchSchools, 300)
    return () => clearTimeout(debounceTimer)
  }, [schoolSearch, selectedType])

  const handleSchoolSelect = (school: HighSchool | University) => {
    setValue('schoolName', school.name)
    setSchoolSearch(school.name)
    setShowSchoolDropdown(false)
    setSchools([])
  }

  const handleTypeSelect = (type: EducationType) => {
    const selectedEducationType = educationTypes.find((t) => t.type === type)
    setSelectedType(type)
    setValue('educationType', type)
    setValue('gradeSystem', selectedEducationType?.gradeSystem || 'GPA_4')
    setValue('degree', selectedEducationType?.degree || '')
    setStep('form')
  }

  const onSubmit = async (data: EducationFormData) => {
    try {
      const submitData = {
        schoolName: data.schoolName,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        grade: data.grade ? parseFloat(data.grade) : undefined,
        gradeSystem: data.gradeSystem,
        educationType: data.educationType || 'LISANS',
        startYear: data.startYear,
        endYear: data.isCurrent ? undefined : data.endYear,
        isCurrent: data.isCurrent,
        description: data.description || undefined,
      }
      await onSave(submitData)
      onClose()
    } catch (error) {
      console.error('Eğitim kaydedilirken hata:', error)
    }
  }

  if (!isOpen) return null

  const getTitle = () => {
    if (education) return 'Eğitimi Düzenle'
    if (step === 'type') return 'Eğitim Türü Seçin'
    const selectedEducationType = educationTypes.find((t) => t.type === selectedType)
    return `${selectedEducationType?.label} Ekle`
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>{getTitle()}</CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          {step === 'type' ? (
            <div className='space-y-4'>
              <p className='text-muted-foreground text-center mb-6'>Hangi türde eğitim eklemek istiyorsunuz?</p>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {educationTypes.map((eduType) => {
                  const Icon = eduType.icon
                  return (
                    <Card
                      key={eduType.type}
                      className='cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary'
                      onClick={() => handleTypeSelect(eduType.type)}
                    >
                      <CardContent className='p-6 text-center h-full flex flex-col items-center justify-center'>
                        <Icon className='h-12 w-12 mx-auto mb-4 text-primary' />
                        <h3 className='font-semibold mb-2'>{eduType.label}</h3>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='relative'>
                  <Label htmlFor='schoolName'>Okul Adı *</Label>
                  <div className='relative'>
                    <Controller
                      name='schoolName'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id='schoolName'
                          value={schoolSearch}
                          onChange={(e) => {
                            setSchoolSearch(e.target.value)
                            field.onChange(e.target.value)
                          }}
                          placeholder={selectedType === 'LISE' ? 'Lise adı ara...' : 'Üniversite adı ara...'}
                        />
                      )}
                    />
                    <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  </div>
                  {/* School dropdown */}
                  {showSchoolDropdown && schools.length > 0 && (
                    <div className='absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto'>
                      {schools.map((school) => (
                        <div
                          key={school.id}
                          className='px-3 py-2 hover:bg-muted cursor-pointer text-sm'
                          onClick={() => handleSchoolSelect(school)}
                        >
                          <div className='font-medium'>{school.name}</div>
                          {school.city && (
                            <div className='text-xs text-muted-foreground'>
                              {'district' in school && school.district
                                ? `${school.district}, ${school.city}`
                                : school.city}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isLoadingSchools && (
                    <div className='absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3 text-center text-sm text-muted-foreground'>
                      Aranıyor...
                    </div>
                  )}
                  {errors.schoolName && <p className='text-sm text-red-500 mt-1'>{errors.schoolName.message}</p>}
                </div>
                <div>
                  <Label htmlFor='degree'>Derece *</Label>
                  <Controller
                    name='degree'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='degree' placeholder='Ön Lisans, Lisans, Yüksek Lisans, vb.' disabled />
                    )}
                  />
                  {errors.degree && <p className='text-sm text-red-500 mt-1'>{errors.degree.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor='fieldOfStudy'>Bölüm *</Label>
                <Controller
                  name='fieldOfStudy'
                  control={control}
                  render={({ field }) => <Input {...field} id='fieldOfStudy' placeholder='Bilgisayar Programcılığı' />}
                />
                {errors.fieldOfStudy && <p className='text-sm text-red-500 mt-1'>{errors.fieldOfStudy.message}</p>}
              </div>

              <div className={`grid gap-4 ${watchIsCurrent ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <Label htmlFor='startYear'>Başlangıç Yılı *</Label>
                  <Controller
                    name='startYear'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='startYear'
                        type='number'
                        min='1980'
                        max='2030'
                        placeholder='2019'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    )}
                  />
                  {errors.startYear && <p className='text-sm text-red-500 mt-1'>{errors.startYear.message}</p>}
                </div>
                {!watchIsCurrent && (
                  <div>
                    <Label htmlFor='endYear'>Bitiş Yılı</Label>
                    <Controller
                      name='endYear'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='endYear'
                          type='number'
                          min='1980'
                          max='2030'
                          placeholder='2021'
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      )}
                    />
                    {errors.endYear && <p className='text-sm text-red-500 mt-1'>{errors.endYear.message}</p>}
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
                <Label htmlFor='isCurrent'>Halen devam ediyorum</Label>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='grade'>Not</Label>
                  <Controller
                    name='grade'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='grade'
                        type='number'
                        step='0.01'
                        placeholder={selectedType === 'LISE' ? '85' : '2.75'}
                      />
                    )}
                  />
                  {errors.grade && <p className='text-sm text-red-500 mt-1'>{errors.grade.message}</p>}
                </div>
                <div>
                  <Label htmlFor='gradeSystem'>Not Sistemi</Label>
                  <Controller
                    name='gradeSystem'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder='Not sistemi seçin' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='GPA_4'>4.0 Sistemi</SelectItem>
                          <SelectItem value='PERCENTAGE'>Yüzdelik Sistem</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gradeSystem && <p className='text-sm text-red-500 mt-1'>{errors.gradeSystem.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor='description'>Açıklama</Label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} id='description' placeholder='Başarılar, önemli projeler, vb.' rows={3} />
                  )}
                />
                {errors.description && <p className='text-sm text-red-500 mt-1'>{errors.description.message}</p>}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
