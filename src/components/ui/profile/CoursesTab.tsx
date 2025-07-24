'use client'

import React from 'react'
import { Plus, BookOpen, Edit3, CheckCircle2, Trash2 } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'
import { Badge } from '@/components/core/badge'

import type { Course, UserProfile } from '@/types/api.types'

interface CoursesTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal?: (id: string, data: Course) => void
  onDeleteCourse?: (id: string, name: string) => void
}

export function CoursesTab({ profile, onOpenModal, onOpenEditModal, onDeleteCourse }: CoursesTabProps) {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Kurslar</h2>
          <p className='text-muted-foreground'>Tamamladığınız kursları yönetin</p>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Kurs Ekle</span>
        </Button>
      </div>

      <div className='grid gap-4'>
        {profile?.courses?.filter(Boolean).map((course: Course) => {
          if (!course) return null

          return (
            <Card key={course.id} className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex justify-between items-start'>
                  <div className='space-y-2'>
                    <h3 className='font-semibold text-lg'>{course.courseName}</h3>
                    <p className='text-muted-foreground'>{course.provider}</p>
                    {course.endMonth && course.endYear && (
                      <p className='text-sm text-muted-foreground flex items-center'>
                        <CheckCircle2 className='h-3 w-3 mr-1 text-green-600' />
                        Tamamlandı: {course.endMonth}/{course.endYear}
                      </p>
                    )}
                    {course.duration && <Badge variant='secondary'>{course.duration}</Badge>}
                    {course.description && (
                      <p className='text-sm text-muted-foreground mt-2'>{course.description}</p>
                    )}
                  </div>
                  {(onOpenEditModal || onDeleteCourse) && (
                    <div className='flex space-x-2'>
                      {onOpenEditModal && (
                        <Button 
                          variant='ghost' 
                          size='sm' 
                          onClick={() => onOpenEditModal(course.id, course)}
                          title='Kursu Düzenle'
                        >
                          <Edit3 className='h-4 w-4' />
                        </Button>
                      )}
                      {onDeleteCourse && (
                        <Button 
                          variant='ghost' 
                          size='sm' 
                          onClick={() => onDeleteCourse(course.id, course.courseName)}
                          className='text-destructive hover:text-destructive'
                          title='Kursu Sil'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {(!profile?.courses || profile.courses.length === 0) && (
          <Card className='border-dashed'>
            <CardContent className='p-12 text-center'>
              <BookOpen className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground mb-4'>Henüz kursunuz bulunmuyor</p>
              <Button onClick={onOpenModal} variant='outline'>İlk kursunuzu ekleyin</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}