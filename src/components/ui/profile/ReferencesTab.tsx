'use client'

import React from 'react'
import { Plus, Edit, Trash2, Users, Building, Phone } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import type { UserProfile } from '@/types/api.types'

interface Reference {
  name: string
  company: string
  contact: string
}

interface ReferencesTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal: (id: string, data: Reference) => void
  onDeleteReference: (id: string, name: string) => void
}

export function ReferencesTab({ profile, onOpenModal, onOpenEditModal, onDeleteReference }: ReferencesTabProps) {
  const references = profile?.references || []

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>Referanslar</h2>
          <p className='text-muted-foreground'>İş başvurularınızda kullanabileceğiniz referanslarınızı yönetin.</p>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Referans Ekle</span>
        </Button>
      </div>

      {references.length === 0 ? (
        <Card className='border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
            <Users className='h-12 w-12 text-muted-foreground mb-4' />
            <CardTitle className='mb-2'>Henüz referans eklememişsiniz</CardTitle>
            <CardDescription className='max-w-sm mb-4'>
              Önceki çalışma arkadaşlarınızdan veya yöneticilerinizden referans ekleyerek başvurularınızı güçlendirin.
            </CardDescription>
            <Button onClick={onOpenModal} variant='outline'>
              <Plus className='h-4 w-4 mr-2' />
              İlk referansınızı ekleyin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {references.map((reference, index) => (
            <Card key={`${reference.name}-${index}`} className='hover:shadow-md transition-shadow'>
              <CardHeader className='pb-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 min-w-0'>
                    <CardTitle className='text-lg truncate'>{reference.name}</CardTitle>
                    <div className='space-y-2 mt-2'>
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <Building className='h-4 w-4 mr-2 flex-shrink-0' />
                        <span className='truncate'>{reference.company}</span>
                      </div>
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <Phone className='h-4 w-4 mr-2 flex-shrink-0' />
                        <span className='truncate'>{reference.contact}</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex space-x-1 ml-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onOpenEditModal(`${reference.name}-${index}`, reference)}
                    >
                      <Edit className='h-3 w-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onDeleteReference(`${reference.name}-${index}`, reference.name)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
