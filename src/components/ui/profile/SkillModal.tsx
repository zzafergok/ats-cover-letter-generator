'use client'

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import type { Skill } from '@/types/api.types'

interface SkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Skill, 'id'>) => Promise<void>
  skill?: Skill | null
  isLoading?: boolean
}

const skillLevels = [
  { value: 'BEGINNER', label: 'Başlangıç' },
  { value: 'INTERMEDIATE', label: 'Orta' },
  { value: 'ADVANCED', label: 'İleri' },
  { value: 'EXPERT', label: 'Uzman' },
] as const

const skillCategories = ['TECHNICAL', 'SOFT_SKILL', 'LANGUAGE', 'TOOL', 'FRAMEWORK', 'OTHER'] as const

export function SkillModal({ isOpen, onClose, onSave, skill, isLoading = false }: SkillModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'TECHNICAL' as 'TECHNICAL' | 'SOFT_SKILL' | 'LANGUAGE' | 'TOOL' | 'FRAMEWORK' | 'OTHER',
    level: 'INTERMEDIATE' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
    yearsOfExperience: 0,
  })

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || 'TECHNICAL',
        level: skill.level || 'INTERMEDIATE',
        yearsOfExperience: skill.yearsOfExperience || 0,
      })
    } else {
      setFormData({
        name: '',
        category: 'TECHNICAL',
        level: 'INTERMEDIATE',
        yearsOfExperience: 0,
      })
    }
  }, [skill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Yetenek kaydedilirken hata:', error)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      TECHNICAL: 'Teknik',
      SOFT_SKILL: 'Soft Skill',
      LANGUAGE: 'Dil',
      TOOL: 'Araç',
      FRAMEWORK: 'Framework',
      OTHER: 'Diğer',
    }
    return labels[category] || category
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>{skill ? 'Yeteneği Düzenle' : 'Yeni Yetenek Ekle'}</CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Yetenek Adı *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder='JavaScript, React, Liderlik, vb.'
                required
              />
            </div>

            <div>
              <Label htmlFor='category'>Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value as typeof formData.category }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Kategori seçin' />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='level'>Seviye</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value as typeof formData.level }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seviye seçin' />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='yearsOfExperience'>Deneyim Yılı</Label>
              <Input
                id='yearsOfExperience'
                type='number'
                min='0'
                max='50'
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData((prev) => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                placeholder='Kaç yıllık deneyiminiz var?'
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
        </CardContent>
      </Card>
    </div>
  )
}
