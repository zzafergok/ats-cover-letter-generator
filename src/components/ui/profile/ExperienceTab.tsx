'use client'

import React from 'react'
import { Plus, Briefcase, Edit3, MapPin, Trash2 } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { employmentTypeLabels, workModeLabels } from '@/constants/profile'

import type { WorkExperience, UserProfile } from '@/types/api.types'

interface ExperienceTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal: (id: string, data: WorkExperience) => void
  onDeleteExperience?: (id: string, name: string) => void
}

export function ExperienceTab({ profile, onOpenModal, onOpenEditModal, onDeleteExperience }: ExperienceTabProps) {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>İş Deneyimi</h2>
          <p className='text-muted-foreground'>İş deneyimlerinizi yönetin</p>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Deneyim Ekle</span>
        </Button>
      </div>

      <div className='grid gap-4'>
        {profile?.experiences?.filter(Boolean).map((exp: WorkExperience) => {
          if (!exp) return null

          return (
            <Card key={exp.id} className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex justify-between items-start'>
                  <div className='space-y-3 flex-1'>
                    <div>
                      <h3 className='font-semibold text-lg'>{exp.position}</h3>
                      <p className='text-muted-foreground font-medium'>{exp.companyName}</p>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      {exp.employmentType && (
                        <Badge variant='outline' className='text-xs bg-blue-50 text-blue-700 border-blue-200'>
                          {employmentTypeLabels[exp.employmentType] || exp.employmentType}
                        </Badge>
                      )}
                      {exp.workMode && (
                        <Badge variant='outline' className='text-xs bg-green-50 text-green-700 border-green-200'>
                          {workModeLabels[exp.workMode] || exp.workMode}
                        </Badge>
                      )}
                      {exp.isCurrent && (
                        <Badge variant='outline' className='text-xs bg-orange-50 text-orange-700 border-orange-200'>
                          Aktif
                        </Badge>
                      )}
                    </div>

                    <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <span className='w-1 h-1 bg-muted-foreground rounded-full'></span>
                        {exp.startMonth}/{exp.startYear} -{' '}
                        {exp.endMonth && exp.endYear ? `${exp.endMonth}/${exp.endYear}` : 'Devam ediyor'}
                      </span>
                      {exp.location && (
                        <span className='flex items-center gap-1'>
                          <MapPin className='h-3 w-3' />
                          {exp.location}
                        </span>
                      )}
                    </div>

                    <p className='text-sm text-muted-foreground leading-relaxed'>{exp.description}</p>

                    {exp.achievements && (
                      <div>
                        <p className='text-xs text-muted-foreground mb-2 font-medium'>Başarılar:</p>
                        <ul className='text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2'>
                          {exp.achievements.split(',').map((achievement, index) => (
                            <li key={index} className='text-xs leading-relaxed'>
                              {achievement.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='sm' onClick={() => onOpenEditModal(exp.id, exp)}>
                      <Edit3 className='h-4 w-4' />
                    </Button>
                    {onDeleteExperience && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDeleteExperience(exp.id, exp.position)}
                        className='text-destructive hover:text-destructive'
                        title='Deneyimi Sil'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {(!profile?.experiences || profile.experiences.length === 0) && (
          <Card className='border-dashed'>
            <CardContent className='p-12 text-center'>
              <Briefcase className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground mb-4'>Henüz iş deneyiminiz bulunmuyor</p>
              <Button onClick={onOpenModal} variant='outline'>
                İlk deneyiminizi ekleyin
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
