'use client'

import React from 'react'
import { Plus, Star } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { skillLevels } from '@/constants/profile'

import type { Skill, UserProfile } from '@/types/api.types'

interface SkillsTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
}

export function SkillsTab({ profile, onOpenModal }: SkillsTabProps) {
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
            <Button onClick={onOpenModal} variant='outline'>İlk yeteneğinizi ekleyin</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}