'use client'

import React from 'react'
import { Plus, Edit, Trash2, Languages } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'

import type { UserProfile } from '@/types/api.types'

interface Language {
  language: string
  level: string
}

interface LanguagesTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal: (id: string, data: Language) => void
  onDeleteLanguage: (id: string, name: string) => void
}

const languageLevelColors = {
  NATIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  FLUENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ADVANCED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  BASIC: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const languageLevelLabels = {
  NATIVE: 'Ana dil',
  FLUENT: 'Akıcı',
  ADVANCED: 'İleri',
  INTERMEDIATE: 'Orta',
  BASIC: 'Başlangıç',
}

export function LanguagesTab({ profile, onOpenModal, onOpenEditModal, onDeleteLanguage }: LanguagesTabProps) {
  const languages = profile?.languages || []

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>Dil Becerileri</h2>
          <p className='text-muted-foreground'>Dil becerilerinizi ve seviyelerinizi yönetin.</p>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Dil Ekle</span>
        </Button>
      </div>

      {languages.length === 0 ? (
        <Card className='border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
            <Languages className='h-12 w-12 text-muted-foreground mb-4' />
            <CardTitle className='mb-2'>Henüz dil eklememişsiniz</CardTitle>
            <CardDescription className='max-w-sm mb-4'>
              Dil becerilerinizi ekleyerek CV'nizin uluslararası iş fırsatlarına uygunluğunu artırın.
            </CardDescription>
            <Button onClick={onOpenModal} variant='outline'>
              <Plus className='h-4 w-4 mr-2' />
              İlk dilinizi ekleyin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {languages.map((language, index) => (
            <Card key={`${language.language}-${index}`} className='hover:shadow-md transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='text-lg'>{language.language}</CardTitle>
                    <Badge
                      className={`mt-2 ${languageLevelColors[language.level as keyof typeof languageLevelColors] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {languageLevelLabels[language.level as keyof typeof languageLevelLabels] || language.level}
                    </Badge>
                  </div>
                  <div className='flex space-x-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onOpenEditModal(`${language.language}-${index}`, language)}
                    >
                      <Edit className='h-3 w-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onDeleteLanguage(`${language.language}-${index}`, language.language)}
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
