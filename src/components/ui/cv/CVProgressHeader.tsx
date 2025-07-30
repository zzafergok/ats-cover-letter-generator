'use client'

import React from 'react'
import { FileText, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { Progress } from '@/components/core/progress'
import { StepItem } from '@/constants/cvTemplate.constants'

interface CVProgressHeaderProps {
  currentStep: number
  steps: StepItem[]
  progress: number
  completedSteps: Set<number>
  onGoToStep: (stepIndex: number) => void
}

export function CVProgressHeader({ currentStep, steps, progress, completedSteps, onGoToStep }: CVProgressHeaderProps) {
  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold flex items-center gap-2'>
              <FileText className='h-6 w-6' />
              CV Generator
              <Badge variant='secondary'>
                <Sparkles className='h-3 w-3 mr-1' />
                Beta
              </Badge>
            </h1>
            <span className='text-sm text-muted-foreground'>
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <Progress value={progress} className='h-2' />

          {/* Step Navigation */}
          <div className='flex flex-wrap gap-2'>
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <button
                  key={step.id}
                  onClick={() => onGoToStep(index)}
                  disabled={index > currentStep && !completedSteps.has(index - 1)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-full border transition-colors ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground border-primary'
                      : completedSteps.has(index)
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                        : index <= currentStep
                          ? 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80'
                          : 'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50'
                  }`}
                >
                  <StepIcon className='w-3 h-3' />
                  {step.title}
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
