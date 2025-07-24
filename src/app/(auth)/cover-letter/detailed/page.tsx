'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/core/button'
import { DetailedCoverLetterCreator } from '@/components/ui/cover-letter/DetailedCoverLetterCreator'
import { useUserProfileStore } from '@/store/userProfileStore'

export default function DetailedCoverLetterPage() {
  const { profile, getProfile } = useUserProfileStore()
  const [isProfileReady, setIsProfileReady] = useState(false)

  useEffect(() => {
    getProfile()
  }, [getProfile])

  // Check if profile has required data
  useEffect(() => {
    if (!profile) {
      setIsProfileReady(false)
      return
    }

    const hasRequiredFields = !!(
      profile.city &&
      profile.email &&
      profile.firstName &&
      profile.lastName &&
      profile.phone &&
      profile.educations &&
      profile.educations.length > 0
    )

    setIsProfileReady(hasRequiredFields)
  }, [profile])

  // Get list of missing required fields
  const getMissingFields = () => {
    if (!profile) return []

    const missingFields = []

    if (!profile.firstName) missingFields.push('Ad')
    if (!profile.lastName) missingFields.push('Soyad')
    if (!profile.email) missingFields.push('E-posta')
    if (!profile.phone) missingFields.push('Telefon')
    if (!profile.city) missingFields.push('Şehir')
    if (!profile.educations || profile.educations.length === 0) {
      missingFields.push('En az 1 eğitim bilgisi')
    }

    return missingFields
  }

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
        <div className='bg-orange-50 border border-orange-200 rounded-lg p-6'>
          <div className='flex items-start gap-4'>
            <div className='p-2 bg-orange-100 rounded-full'>
              <AlertCircle className='h-5 w-5 text-orange-600' />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-orange-800 mb-2'>Profil Tamamlanması Gerekiyor</h3>
              <p className='text-orange-700 mb-4'>
                Detaylı ön yazı oluşturabilmek için aşağıdaki bilgilerin tamamlanması gerekmektedir.
              </p>
              <div className='bg-white rounded-lg p-4 mb-4'>
                <h4 className='font-medium text-orange-800 mb-3'>Eksik Bilgiler:</h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {getMissingFields().map((field, index) => (
                    <div key={index} className='flex items-center gap-2 text-sm text-orange-700'>
                      <div className='w-1.5 h-1.5 bg-orange-400 rounded-full'></div>
                      {field}
                    </div>
                  ))}
                </div>
              </div>

              <Link href='/profile'>
                <Button className='bg-orange-600 hover:bg-orange-700 text-white gap-2'>
                  <User className='w-4 h-4' />
                  Profilimi Tamamla
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Profile Ready Status */}
          <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-green-100 rounded-full'>
                <User className='h-5 w-5 text-green-600' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-green-800 mb-2'>✓ Profil Tamamlandı</h3>
                <p className='text-green-700 mb-3'>
                  Tüm gerekli bilgiler mevcut. Artık detaylı ön yazı oluşturabilirsiniz.
                </p>
                <div className='flex flex-wrap gap-4 text-sm text-green-600'>
                  <span>✓ Kişisel Bilgiler</span>
                  <span>✓ İletişim Bilgileri</span>
                  <span>✓ {profile?.educations?.length || 0} Eğitim</span>
                  {profile?.experiences && profile.experiences.length > 0 && (
                    <span>✓ {profile.experiences.length} İş Deneyimi</span>
                  )}
                </div>
              </div>
            </div>
          </div>

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
