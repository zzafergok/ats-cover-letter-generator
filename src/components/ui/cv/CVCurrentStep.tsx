'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { StepItem } from '@/constants/cvTemplate.constants'

interface CVCurrentStepProps {
  currentStepData: StepItem
  children: React.ReactNode
}

export function CVCurrentStep({ currentStepData, children }: CVCurrentStepProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <currentStepData.icon className='h-6 w-6 text-primary' />
          <div>
            <CardTitle className='text-xl'>{currentStepData.title}</CardTitle>
            <p className='text-muted-foreground text-sm'>{currentStepData.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
