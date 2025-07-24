'use client'

import React from 'react'
import { GraduationCap, Briefcase, Star } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

import type { UserProfile } from '@/types/api.types'

interface OverviewTabProps {
  profile: UserProfile | null
}

export function OverviewTab({ profile }: OverviewTabProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {/* Education Summary */}
      <Card className='hover:shadow-lg transition-shadow'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Eğitim</CardTitle>
          <GraduationCap className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{profile?.educations?.length || 0}</div>
          <p className='text-xs text-muted-foreground'>Eğitim kaydı</p>
        </CardContent>
      </Card>

      {/* Experience Summary */}
      <Card className='hover:shadow-lg transition-shadow'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>İş Deneyimi</CardTitle>
          <Briefcase className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{profile?.experiences?.length || 0}</div>
          <p className='text-xs text-muted-foreground'>İş deneyimi</p>
        </CardContent>
      </Card>

      {/* Skills Summary */}
      <Card className='hover:shadow-lg transition-shadow'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Yetenekler</CardTitle>
          <Star className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{profile?.skills?.length || 0}</div>
          <p className='text-xs text-muted-foreground'>Yetenek</p>
        </CardContent>
      </Card>
    </div>
  )
}
