'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, GraduationCap, BookOpen, Award, Search } from 'lucide-react'
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

export function EducationModal({ isOpen, onClose, onSave, education, isLoading = false }: EducationModalProps) {
  const [step, setStep] = useState<'type' | 'form'>('type')
  const [selectedType, setSelectedType] = useState<EducationType | null>(null)

  const [formData, setFormData] = useState({
    schoolName: '',
    degree: '',
    fieldOfStudy: '',
    grade: '',
    gradeSystem: 'GPA_4' as 'PERCENTAGE' | 'GPA_4',
    educationType: 'UNIVERSITE' as EducationType,
    startYear: '',
    endYear: '',
    isCurrent: false,
    description: '',
  })

  // School search state
  const [schoolSearch, setSchoolSearch] = useState('')
  const [schools, setSchools] = useState<(HighSchool | University)[]>([])
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [isLoadingSchools, setIsLoadingSchools] = useState(false)

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

  useEffect(() => {
    if (education) {
      // Fallback for missing educationType
      const educationType = education.educationType || (education.gradeSystem === 'PERCENTAGE' ? 'LISE' : 'LISANS')
      const selectedEducationType = educationTypes.find((t) => t.type === educationType)

      setStep('form')
      setSelectedType(educationType)
      setFormData({
        schoolName: education.schoolName || '',
        degree: selectedEducationType?.degree || education.degree || '',
        fieldOfStudy: education.fieldOfStudy || '',
        grade: education.grade?.toString() || '',
        gradeSystem: education.gradeSystem || 'GPA_4',
        educationType: educationType,
        startYear: education.startYear?.toString() || '',
        endYear: education.endYear?.toString() || '',
        isCurrent: education.isCurrent || false,
        description: education.description || '',
      })
    } else {
      setStep('type')
      setSelectedType(null)
      setFormData({
        schoolName: '',
        degree: '',
        fieldOfStudy: '',
        grade: '',
        gradeSystem: 'GPA_4',
        educationType: 'LISANS',
        startYear: '',
        endYear: '',
        isCurrent: false,
        description: '',
      })
    }
  }, [education, isOpen])

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
          // İlk 10 sonucu al
          setSchools(response.data.slice(0, 10))
        } else {
          const response = await schoolApi.searchUniversities(schoolSearch)
          // İlk 10 sonucu al
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
    setFormData((prev) => ({ ...prev, schoolName: school.name }))
    setSchoolSearch(school.name)
    setShowSchoolDropdown(false)
    setSchools([])
  }

  const handleTypeSelect = (type: EducationType) => {
    const selectedEducationType = educationTypes.find((t) => t.type === type)
    setSelectedType(type)
    setFormData((prev) => ({
      ...prev,
      educationType: type,
      gradeSystem: selectedEducationType?.gradeSystem || 'GPA_4',
      degree: selectedEducationType?.degree || '',
    }))
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = {
        schoolName: formData.schoolName,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        grade: formData.grade ? parseFloat(formData.grade) : undefined,
        gradeSystem: formData.gradeSystem,
        educationType: formData.educationType || 'LISANS',
        startYear: parseInt(formData.startYear),
        endYear: formData.endYear ? parseInt(formData.endYear) : undefined,
        isCurrent: formData.isCurrent,
        description: formData.description || undefined,
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
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='relative'>
                  <Label htmlFor='schoolName'>Okul Adı *</Label>
                  <div className='relative'>
                    <Input
                      id='schoolName'
                      value={schoolSearch || formData.schoolName}
                      onChange={(e) => {
                        setSchoolSearch(e.target.value)
                        setFormData((prev) => ({ ...prev, schoolName: e.target.value }))
                      }}
                      placeholder={selectedType === 'LISE' ? 'Lise adı ara...' : 'Üniversite adı ara...'}
                      required
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
                </div>
                <div>
                  <Label htmlFor='degree'>Derece *</Label>
                  <Input
                    id='degree'
                    value={formData.degree}
                    onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
                    placeholder='Ön Lisans, Lisans, Yüksek Lisans, vb.'
                    disabled
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='fieldOfStudy'>Bölüm *</Label>
                <Input
                  id='fieldOfStudy'
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))}
                  placeholder='Bilgisayar Programcılığı'
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='startYear'>Başlangıç Yılı *</Label>
                  <Input
                    id='startYear'
                    type='number'
                    min='1980'
                    max='2030'
                    value={formData.startYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startYear: e.target.value }))}
                    placeholder='2019'
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='endYear'>Bitiş Yılı</Label>
                  <Input
                    id='endYear'
                    type='number'
                    min='1980'
                    max='2030'
                    value={formData.endYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endYear: e.target.value }))}
                    placeholder='2021'
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='isCurrent'
                  checked={formData.isCurrent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isCurrent: e.target.checked,
                      endYear: e.target.checked ? '' : prev.endYear,
                    }))
                  }
                  className='rounded'
                />
                <Label htmlFor='isCurrent'>Halen devam ediyorum</Label>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='grade'>Not</Label>
                  <Input
                    id='grade'
                    type='number'
                    step='0.01'
                    value={formData.grade}
                    onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
                    placeholder='3.09'
                  />
                </div>
                <div>
                  <Label htmlFor='gradeSystem'>Not Sistemi</Label>
                  <Select
                    value={formData.gradeSystem}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gradeSystem: value as 'PERCENTAGE' | 'GPA_4' }))
                    }
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Not sistemi seçin' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='GPA_4'>4.0 Sistemi</SelectItem>
                      <SelectItem value='PERCENTAGE'>Yüzdelik Sistem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor='description'>Açıklama</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder='Başarılar, önemli projeler, vb.'
                  rows={3}
                />
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
