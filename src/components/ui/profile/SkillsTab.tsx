'use client'

import React, { useState } from 'react'
import { Plus, Star, Edit3, Trash2, Code, Save, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { Label } from '@/components/core/label'
import { Input } from '@/components/core/input'
import { skillLevels } from '@/constants/profile'

import type { Skill, UserProfile } from '@/types/api.types'

interface SkillsTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal?: (id: string, data: Skill) => void
  onDeleteSkill?: (id: string, name: string) => void
  onUpdateProfile?: (data: Partial<UserProfile>) => Promise<void>
}

const technicalSkillsSchema = z.object({
  technicalSkills: z
    .object({
      frontend: z.array(z.string()).optional(),
      backend: z.array(z.string()).optional(),
      database: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
    })
    .optional(),
})

type TechnicalSkillsFormData = z.infer<typeof technicalSkillsSchema>

export function SkillsTab({ profile, onOpenModal, onOpenEditModal, onDeleteSkill, onUpdateProfile }: SkillsTabProps) {
  const [isEditingTechnical, setIsEditingTechnical] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TechnicalSkillsFormData>({
    resolver: zodResolver(technicalSkillsSchema),
    defaultValues: {
      technicalSkills: {
        frontend: profile?.technicalSkills?.frontend || [],
        backend: profile?.technicalSkills?.backend || [],
        database: profile?.technicalSkills?.database || [],
        tools: profile?.technicalSkills?.tools || [],
      },
    },
  })

  React.useEffect(() => {
    reset({
      technicalSkills: {
        frontend: profile?.technicalSkills?.frontend || [],
        backend: profile?.technicalSkills?.backend || [],
        database: profile?.technicalSkills?.database || [],
        tools: profile?.technicalSkills?.tools || [],
      },
    })
  }, [profile, reset])

  const onSubmitTechnical = async (data: TechnicalSkillsFormData) => {
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(data)
      }
      setIsEditingTechnical(false)
    } catch (error) {
      console.error('Teknik beceriler güncellenirken hata:', error)
    }
  }

  const handleCancelTechnical = () => {
    reset({
      technicalSkills: {
        frontend: profile?.technicalSkills?.frontend || [],
        backend: profile?.technicalSkills?.backend || [],
        database: profile?.technicalSkills?.database || [],
        tools: profile?.technicalSkills?.tools || [],
      },
    })
    setIsEditingTechnical(false)
  }

  const stringToArray = (value: string): string[] => {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  const arrayToString = (array: string[] = []): string => {
    return array.join(', ')
  }
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Yetenekler</h2>
          <p className='text-muted-foreground'>Yeteneklerinizi kategorilere göre yönetin</p>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Yetenek Ekle</span>
        </Button>
      </div>

      {/* Technical Skills Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Code className='h-5 w-5 text-primary' />
              <CardTitle>Teknik Beceriler</CardTitle>
            </div>
            {!isEditingTechnical && onUpdateProfile && (
              <Button variant='outline' size='sm' onClick={() => setIsEditingTechnical(true)}>
                <Edit3 className='h-4 w-4 mr-2' />
                Düzenle
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingTechnical ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-sm font-medium text-muted-foreground mb-2'>Frontend</h4>
                <div className='flex flex-wrap gap-1'>
                  {profile?.technicalSkills?.frontend?.length ? (
                    profile.technicalSkills.frontend.map((skill, index) => (
                      <Badge key={index} variant='secondary'>
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-sm text-muted-foreground'>Henüz eklenmedi</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className='text-sm font-medium text-muted-foreground mb-2'>Backend</h4>
                <div className='flex flex-wrap gap-1'>
                  {profile?.technicalSkills?.backend?.length ? (
                    profile.technicalSkills.backend.map((skill, index) => (
                      <Badge key={index} variant='secondary'>
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-sm text-muted-foreground'>Henüz eklenmedi</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className='text-sm font-medium text-muted-foreground mb-2'>Veritabanı</h4>
                <div className='flex flex-wrap gap-1'>
                  {profile?.technicalSkills?.database?.length ? (
                    profile.technicalSkills.database.map((skill, index) => (
                      <Badge key={index} variant='secondary'>
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-sm text-muted-foreground'>Henüz eklenmedi</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className='text-sm font-medium text-muted-foreground mb-2'>Araçlar</h4>
                <div className='flex flex-wrap gap-1'>
                  {profile?.technicalSkills?.tools?.length ? (
                    profile.technicalSkills.tools.map((skill, index) => (
                      <Badge key={index} variant='secondary'>
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-sm text-muted-foreground'>Henüz eklenmedi</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitTechnical)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='frontend'>Frontend Teknolojileri</Label>
                  <Controller
                    name='technicalSkills.frontend'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        id='frontend'
                        placeholder='React, Vue.js, Angular (virgülle ayırın)'
                        value={arrayToString(value)}
                        onChange={(e) => onChange(stringToArray(e.target.value))}
                      />
                    )}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>Teknolojileri virgülle ayırarak girin</p>
                </div>

                <div>
                  <Label htmlFor='backend'>Backend Teknolojileri</Label>
                  <Controller
                    name='technicalSkills.backend'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        id='backend'
                        placeholder='Node.js, Python, Java (virgülle ayırın)'
                        value={arrayToString(value)}
                        onChange={(e) => onChange(stringToArray(e.target.value))}
                      />
                    )}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>Teknolojileri virgülle ayırarak girin</p>
                </div>

                <div>
                  <Label htmlFor='database'>Veritabanı Teknolojileri</Label>
                  <Controller
                    name='technicalSkills.database'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        id='database'
                        placeholder='MongoDB, PostgreSQL, MySQL (virgülle ayırın)'
                        value={arrayToString(value)}
                        onChange={(e) => onChange(stringToArray(e.target.value))}
                      />
                    )}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>Teknolojileri virgülle ayırarak girin</p>
                </div>

                <div>
                  <Label htmlFor='tools'>Araçlar ve Platformlar</Label>
                  <Controller
                    name='technicalSkills.tools'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        id='tools'
                        placeholder='Git, Docker, AWS (virgülle ayırın)'
                        value={arrayToString(value)}
                        onChange={(e) => onChange(stringToArray(e.target.value))}
                      />
                    )}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>Araçları virgülle ayırarak girin</p>
                </div>
              </div>

              <div className='flex space-x-2'>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />}
                  <Save className='h-4 w-4 mr-2' />
                  Kaydet
                </Button>
                <Button type='button' variant='outline' onClick={handleCancelTechnical}>
                  <X className='h-4 w-4 mr-2' />
                  İptal
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {profile?.skills && profile.skills.length > 0 ? (
        <div className='grid gap-6'>
          {Object.entries(
            profile.skills.filter(Boolean).reduce((acc: Record<string, Skill[]>, skill: Skill) => {
              if (!skill) return acc
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
                  {categorySkills?.filter(Boolean).map((skill: Skill) => {
                    if (!skill) return null
                    const levelInfo = skillLevels.find((l) => l.value === skill.level)
                    return (
                      <div
                        key={skill.id}
                        className='flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors'
                      >
                        <div className='flex-1'>
                          <p className='font-medium'>{skill.name}</p>
                          {skill.yearsOfExperience && (
                            <p className='text-xs text-muted-foreground'>{skill.yearsOfExperience} yıl deneyim</p>
                          )}
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Badge className={levelInfo?.color}>{levelInfo?.label}</Badge>
                          {(onOpenEditModal || onDeleteSkill) && (
                            <div className='flex space-x-1'>
                              {onOpenEditModal && (
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => onOpenEditModal(skill.id, skill)}
                                  className='h-8 w-8 p-0'
                                >
                                  <Edit3 className='h-3 w-3' />
                                </Button>
                              )}
                              {onDeleteSkill && (
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => onDeleteSkill(skill.id, skill.name)}
                                  className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                                  title='Yeteneği Sil'
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
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
            <Button onClick={onOpenModal} variant='outline'>
              İlk yeteneğinizi ekleyin
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
