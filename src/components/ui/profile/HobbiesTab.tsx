'use client'

import React from 'react'
import { Plus, Heart, Edit3, Trash2 } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'

import type { Hobby, UserProfile } from '@/types/api.types'

interface HobbiesTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal?: (id: string, data: Hobby) => void
  onDeleteHobby?: (id: string, name: string) => void
}

export function HobbiesTab({ profile, onOpenModal, onOpenEditModal, onDeleteHobby }: HobbiesTabProps) {
  const hobbies = profile?.hobbies || []

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Heart className='h-5 w-5 text-primary' />
          <h2 className='text-xl font-semibold'>Hobiler</h2>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Hobi Ekle</span>
        </Button>
      </div>

      {/* Hobbies List */}
      {hobbies.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Heart className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium text-muted-foreground mb-2'>Henüz hobi eklenmemiş</h3>
            <p className='text-sm text-muted-foreground text-center mb-4'>
              İlgi alanlarınızı ve hobilerinizi ekleyerek profilinizi daha kişisel hale getirin.
            </p>
            <Button onClick={onOpenModal} variant='outline'>
              <Plus className='h-4 w-4 mr-2' />
              İlk hobinizi ekleyin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {hobbies.map((hobby) => (
            <Card key={hobby.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='text-lg'>{hobby.name}</CardTitle>
                  </div>
                  <div className='flex items-center space-x-1 ml-2'>
                    {onOpenEditModal && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onOpenEditModal(hobby.id, hobby)}
                        className='h-8 w-8 p-0'
                      >
                        <Edit3 className='h-3 w-3' />
                      </Button>
                    )}
                    {onDeleteHobby && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDeleteHobby(hobby.id, hobby.name)}
                        className='h-8 w-8 p-0 text-red-500 hover:text-red-700'
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {hobby.description && (
                  <p className='text-sm text-muted-foreground leading-relaxed'>{hobby.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {hobbies.length > 0 && (
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between text-sm text-muted-foreground'>
              <span>Toplam {hobbies.length} hobi</span>
              <Badge variant='secondary'>{hobbies.length} hobi</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
