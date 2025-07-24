'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { DetailedCoverLetterCreator } from '@/components/ui/cover-letter/DetailedCoverLetterCreator'
import { useUserProfileStore } from '@/store/userProfileStore'

export default function DetailedCoverLetterPage() {
  const { profile, getProfile } = useUserProfileStore()
  const [isProfileReady, setIsProfileReady] = useState(false)

  useEffect(() => {
    getProfile()
  }, [getProfile])

  // Check if profile has required data (at least 1 education and 1 experience)
  useEffect(() => {
    const hasEducation = profile?.educations && profile.educations.length > 0
    const hasExperience = profile?.experiences && profile.experiences.length > 0
    setIsProfileReady(!!(hasEducation && hasExperience))
  }, [profile])

  return (
    <div className='container mx-auto p-4 md:p-6 space-y-4 md:space-y-6'>
      {/* Header with back navigation */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
        <Link href='/cover-letter'>
          <Button variant='ghost' size='sm' className='gap-2 self-start'>
            <ArrowLeft className='w-4 h-4' />
            Geri Dön
          </Button>
        </Link>
        <div className='flex-1'>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Detaylı Ön Yazı Oluştur</h1>
          <p className='text-sm md:text-base text-muted-foreground'>
            Profil bilgilerinizden yararlanarak kapsamlı ve kişiselleştirilmiş ön yazı oluşturun
          </p>
        </div>
      </div>

      {/* Profile Status Check */}
      {!isProfileReady ? (
        <Card className='bg-yellow-50 border-yellow-200'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-yellow-800'>
              <AlertCircle className='h-5 w-5' />
              Profil Bilgileri Eksik
            </CardTitle>
            <CardDescription className='text-yellow-700'>
              Detaylı ön yazı oluşturabilmek için profilinizde en az 1 eğitim ve 1 iş deneyimi bilgisi bulunmalıdır.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='text-sm text-yellow-700'>
                <strong>Eksik bilgiler:</strong>
                <ul className='mt-2 space-y-1 ml-4'>
                  {(!profile?.educations || profile.educations.length === 0) && (
                    <li>• En az 1 eğitim bilgisi gereklidir</li>
                  )}
                  {(!profile?.experiences || profile.experiences.length === 0) && (
                    <li>• En az 1 iş deneyimi bilgisi gereklidir</li>
                  )}
                </ul>
              </div>
              <Link href='/profile'>
                <Button className='gap-2'>
                  <User className='w-4 h-4' />
                  Profilimi Tamamla
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-6'>
          {/* Profile Ready - Show Cover Letter Creator */}
          <Card className='bg-green-50 border-green-200'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <User className='h-5 w-5 text-green-600' />
                <div>
                  <p className='font-medium text-green-800'>Profil Hazır</p>
                  <p className='text-sm text-green-600'>
                    {profile?.educations?.length || 0} Eğitim, {profile?.experiences?.length || 0} Deneyim bilgisi
                    mevcut
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DetailedCoverLetterCreator
            onCreated={(coverLetter) => {
              console.log('Detailed cover letter created:', coverLetter)
            }}
          />
        </div>
      )}
    </div>
  )
}
