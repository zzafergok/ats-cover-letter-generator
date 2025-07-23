'use client'

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import type { WorkExperience } from '@/types/api.types'

interface WorkExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<WorkExperience, 'id'>) => Promise<void>
  experience?: WorkExperience | null
  isLoading?: boolean
}

export function WorkExperienceModal({
  isOpen,
  onClose,
  onSave,
  experience,
  isLoading = false,
}: WorkExperienceModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    description: '',
    achievements: [] as string[],
    technologies: [] as string[],
    location: '',
  })

  const [newTech, setNewTech] = useState('')
  const [newAchievement, setNewAchievement] = useState('')

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company || '',
        position: experience.position || '',
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        isCurrentJob: experience.isCurrentJob || false,
        description: experience.description || '',
        achievements: experience.achievements || [],
        technologies: experience.technologies || [],
        location: experience.location || '',
      })
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: '',
        achievements: [],
        technologies: [],
        location: '',
      })
    }
  }, [experience])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('İş deneyimi kaydedilirken hata:', error)
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData((prev) => ({ ...prev, technologies: [...prev.technologies, newTech.trim()] }))
      setNewTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }))
  }

  const addAchievement = () => {
    if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
      setFormData((prev) => ({ ...prev, achievements: [...prev.achievements, newAchievement.trim()] }))
      setNewAchievement('')
    }
  }

  const removeAchievement = (achievement: string) => {
    setFormData((prev) => ({ ...prev, achievements: prev.achievements.filter((a) => a !== achievement) }))
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
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='company'>Şirket *</Label>
                <Input
                  id='company'
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
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

            <div>
              <Label htmlFor='location'>Konum</Label>
              <Input
                id='location'
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder='İstanbul, Türkiye / Remote'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='startDate'>Başlangıç Tarihi *</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor='endDate'>Bitiş Tarihi</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  disabled={formData.isCurrentJob}
                />
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isCurrentJob'
                checked={formData.isCurrentJob}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isCurrentJob: e.target.checked,
                    endDate: e.target.checked ? '' : prev.endDate,
                  }))
                }
                className='rounded'
              />
              <Label htmlFor='isCurrentJob'>Halen çalışıyorum</Label>
            </div>

            <div>
              <Label htmlFor='description'>Açıklama *</Label>
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
              <Label>Teknolojiler</Label>
              <div className='flex space-x-2 mb-2'>
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder='React, Node.js, Python, vb.'
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type='button' onClick={addTechnology} variant='outline'>
                  Ekle
                </Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className='bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md flex items-center'
                  >
                    {tech}
                    <button
                      type='button'
                      onClick={() => removeTechnology(tech)}
                      className='ml-1 text-blue-600 hover:text-blue-800'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label>Başarılar</Label>
              <div className='flex space-x-2 mb-2'>
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder='Önemli başarılarınızı ekleyin'
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                />
                <Button type='button' onClick={addAchievement} variant='outline'>
                  Ekle
                </Button>
              </div>
              <div className='space-y-1'>
                {formData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className='bg-green-50 border border-green-200 p-2 rounded-md flex items-center justify-between'
                  >
                    <span className='text-sm'>{achievement}</span>
                    <button
                      type='button'
                      onClick={() => removeAchievement(achievement)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <X className='h-3 w-3' />
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
