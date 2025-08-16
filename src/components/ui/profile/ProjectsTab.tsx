'use client'

import React from 'react'
import { Plus, FolderOpen, Edit3, Trash2, ExternalLink, Calendar } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'

import type { Project, UserProfile } from '@/types/api.types'

interface ProjectsTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal?: (id: string, data: Project) => void
  onDeleteProject?: (id: string, name: string) => void
}

export function ProjectsTab({ profile, onOpenModal, onOpenEditModal, onDeleteProject }: ProjectsTabProps) {
  const projects = profile?.projects || []

  const formatDate = (month?: number, year?: number) => {
    if (!month || !year) return ''
    const monthNames = [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ]
    return `${monthNames[month - 1]} ${year}`
  }

  const getDateRange = (project: Project) => {
    const startDate = formatDate(project.startMonth, project.startYear)
    const endDate = project.isCurrent ? 'Devam ediyor' : formatDate(project.endMonth, project.endYear)

    if (!startDate) return ''
    return endDate ? `${startDate} - ${endDate}` : startDate
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <FolderOpen className='h-5 w-5 text-primary' />
          <h2 className='text-xl font-semibold'>Projeler</h2>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Proje Ekle</span>
        </Button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <FolderOpen className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium text-muted-foreground mb-2'>Henüz proje eklenmemiş</h3>
            <p className='text-sm text-muted-foreground text-center mb-4'>
              Gerçekleştirdiğiniz projeleri ekleyerek deneyimlerinizi sergileyin.
            </p>
            <Button onClick={onOpenModal} variant='outline'>
              <Plus className='h-4 w-4 mr-2' />
              İlk projenizi ekleyin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 md:grid-cols-2'>
          {projects.map((project) => (
            <Card key={project.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      <CardTitle className='text-lg'>{project.name}</CardTitle>
                      {project.isCurrent && (
                        <Badge variant='secondary' className='text-xs'>
                          Devam ediyor
                        </Badge>
                      )}
                    </div>
                    {getDateRange(project) && (
                      <div className='flex items-center space-x-1 mt-1 text-sm text-muted-foreground'>
                        <Calendar className='h-3 w-3' />
                        <span>{getDateRange(project)}</span>
                      </div>
                    )}
                  </div>
                  <div className='flex items-center space-x-1 ml-2'>
                    {project.link && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => window.open(project.link, '_blank')}
                        className='h-8 w-8 p-0'
                      >
                        <ExternalLink className='h-3 w-3' />
                      </Button>
                    )}
                    {onOpenEditModal && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onOpenEditModal(project.id, project)}
                        className='h-8 w-8 p-0'
                      >
                        <Edit3 className='h-3 w-3' />
                      </Button>
                    )}
                    {onDeleteProject && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDeleteProject(project.id, project.name)}
                        className='h-8 w-8 p-0 text-red-500 hover:text-red-700'
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-sm text-muted-foreground leading-relaxed'>{project.description}</p>

                {project.technologies && (
                  <div className='flex flex-wrap gap-1'>
                    {project.technologies.split(',').map((tech, index) => (
                      <Badge key={index} variant='outline' className='text-xs'>
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {projects.length > 0 && (
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between text-sm text-muted-foreground'>
              <span>Toplam {projects.length} proje</span>
              <div className='flex items-center space-x-4'>
                <Badge variant='secondary'>{projects.filter((p) => p.isCurrent).length} aktif proje</Badge>
                <Badge variant='outline'>{projects.filter((p) => !p.isCurrent).length} tamamlanmış proje</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
