'use client'

import React from 'react'
import { Plus, Award, Edit3, Globe, Trash2 } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'

import type { Certificate, UserProfile } from '@/types/api.types'

interface CertificatesTabProps {
  profile: UserProfile | null
  onOpenModal: () => void
  onOpenEditModal?: (id: string, data: Certificate) => void
  onDeleteCertificate?: (id: string, name: string) => void
}

export function CertificatesTab({ profile, onOpenModal, onOpenEditModal, onDeleteCertificate }: CertificatesTabProps) {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Sertifikalar</h2>
          <p className='text-muted-foreground'>Sertifikalarınızı yönetin</p>
        </div>
        <Button onClick={onOpenModal} className='flex items-center space-x-2'>
          <Plus className='h-4 w-4' />
          <span>Sertifika Ekle</span>
        </Button>
      </div>

      <div className='grid gap-4'>
        {profile?.certificates?.filter(Boolean).map((cert: Certificate) => {
          if (!cert) return null

          return (
            <Card key={cert.id} className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex justify-between items-start'>
                  <div className='space-y-2'>
                    <h3 className='font-semibold text-lg'>{cert.certificateName}</h3>
                    <p className='text-muted-foreground'>{cert.issuer}</p>
                    <p className='text-sm text-muted-foreground'>
                      {cert.issueMonth && cert.issueYear && `Verilme: ${cert.issueMonth}/${cert.issueYear}`}
                      {cert.expiryMonth && cert.expiryYear && (
                        <span>
                          {' '}
                          • Geçerli: {cert.expiryMonth}/{cert.expiryYear}
                        </span>
                      )}
                    </p>
                    {cert.credentialId && (
                      <p className='text-xs text-muted-foreground'>Kimlik: {cert.credentialId}</p>
                    )}
                    {cert.description && <p className='text-sm text-muted-foreground mt-2'>{cert.description}</p>}
                  </div>
                  <div className='flex space-x-2'>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target='_blank' rel='noopener noreferrer'>
                        <Button variant='outline' size='sm'>
                          <Globe className='h-3 w-3 mr-1' />
                          Görüntüle
                        </Button>
                      </a>
                    )}
                    {(onOpenEditModal || onDeleteCertificate) && (
                      <div className='flex space-x-1'>
                        {onOpenEditModal && (
                          <Button 
                            variant='ghost' 
                            size='sm' 
                            onClick={() => onOpenEditModal(cert.id, cert)}
                            title='Sertifikayı Düzenle'
                          >
                            <Edit3 className='h-4 w-4' />
                          </Button>
                        )}
                        {onDeleteCertificate && (
                          <Button 
                            variant='ghost' 
                            size='sm' 
                            onClick={() => onDeleteCertificate(cert.id, cert.certificateName)}
                            className='text-destructive hover:text-destructive'
                            title='Sertifikayı Sil'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {(!profile?.certificates || profile.certificates.length === 0) && (
          <Card className='border-dashed'>
            <CardContent className='p-12 text-center'>
              <Award className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground mb-4'>Henüz sertifikanız bulunmuyor</p>
              <Button onClick={onOpenModal} variant='outline'>İlk sertifikanızı ekleyin</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}