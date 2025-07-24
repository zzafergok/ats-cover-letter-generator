'use client'

import React from 'react'
import { Plus, Star, Edit3, Trash2 } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { skillLevels } from '@/constants/profile'

import type { Skill, UserProfile } from '@/types/api.types'

interface SkillsTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal?: (id: string, data: Skill) => void
  onDeleteSkill?: (id: string, name: string) => void
}

export function SkillsTab({ profile, onOpenModal, onOpenEditModal, onDeleteSkill }: SkillsTabProps) {
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
                      <div key={skill.id} className='flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors'>
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
            <Button onClick={onOpenModal} variant='outline'>İlk yeteneğinizi ekleyin</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}