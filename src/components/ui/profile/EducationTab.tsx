'use client'

import React from 'react'
import { Plus, GraduationCap, Edit3, Trash2 } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'
import { Badge } from '@/components/core/badge'

import type { Education, UserProfile } from '@/types/api.types'

interface EducationTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal: (id: string, data: Education) => void
  onDeleteEducation: (id: string, name: string) => void
}

export function EducationTab({ 
  profile, 
  onOpenModal, 
  onOpenEditModal, 
  onDeleteEducation 
}: EducationTabProps) {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Eğitim Geçmişi</h2>
          <p className='text-muted-foreground'>Eğitim bilgilerinizi yönetin</p>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Eğitim Ekle</span>
        </Button>
      </div>

      <div className='grid gap-4'>
        {profile?.educations?.filter(Boolean).map((edu: Education) => {
          // Null check for edu object
          if (!edu) return null

          // Fallback for missing educationType - try to guess from gradeSystem or set default
          const educationType = edu.educationType || (edu.gradeSystem === 'PERCENTAGE' ? 'LISE' : 'LISANS')

          return (
            <Card key={edu.id} className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex justify-between items-start'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                      <h3 className='font-semibold text-lg'>{edu.degree}</h3>
                      <Badge variant='outline' className='text-xs'>
                        {educationType === 'LISE'
                          ? 'Lise'
                          : educationType === 'ONLISANS'
                            ? 'Önlisans'
                            : educationType === 'LISANS'
                              ? 'Lisans'
                              : 'Yüksek Lisans'}
                      </Badge>
                    </div>
                    <p className='text-muted-foreground'>{edu.schoolName}</p>
                    <p className='text-sm text-muted-foreground'>
                      {edu.fieldOfStudy} • {edu.startYear} - {edu.endYear || 'Devam ediyor'}
                    </p>
                    {edu.description && <p className='text-sm text-muted-foreground mt-2'>{edu.description}</p>}
                    {edu.grade && (
                      <Badge variant='secondary'>
                        {edu.gradeSystem === 'GPA_4' ? 'GPA' : 'Not'}: {edu.grade}
                      </Badge>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='sm' onClick={() => onOpenEditModal(edu.id, edu)}>
                      <Edit3 className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onDeleteEducation(edu.id, edu.schoolName)}
                      className='text-destructive hover:text-destructive'
                      title='Eğitimi Sil'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {(!profile?.educations || profile.educations.length === 0) && (
          <Card className='border-dashed'>
            <CardContent className='p-12 text-center'>
              <GraduationCap className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground mb-4'>Henüz eğitim kaydınız bulunmuyor</p>
              <Button onClick={onOpenModal} variant='outline'>
                İlk eğitiminizi ekleyin
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}