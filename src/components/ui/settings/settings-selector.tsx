'use client'

import { useState, useEffect, ReactNode } from 'react'

import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { cn } from '@/lib/utils'

export interface SelectorOption {
  value: string
  label: string
  description: string
  icon: LucideIcon
  preview?: ReactNode | string
  native?: string
}

interface SettingsSelectorProps {
  title: string
  description: string
  titleIcon: LucideIcon
  options: SelectorOption[]
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  isTransitioning?: boolean
  activeLabel: string
  noteText: string
  preferenceTitle: string
  preferenceDescription: string
  className?: string
}

export function SettingsSelector({
  title,
  description,
  titleIcon: TitleIcon,
  options,
  value,
  onChange,
  isLoading = false,
  isTransitioning = false,
  activeLabel,
  noteText,
  preferenceTitle,
  preferenceDescription,
  className,
}: SettingsSelectorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <TitleIcon className='h-5 w-5' />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4 animate-pulse'>
            <div className='h-4 bg-muted rounded w-32'></div>
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: options.length }).map((_, i) => (
                <div key={i} className='h-20 bg-muted rounded-lg'></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentOption = options.find((opt) => opt.value === value)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <TitleIcon className='h-5 w-5' />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='text-sm font-medium'>{preferenceTitle}</h4>
            <p className='text-sm text-muted-foreground'>{preferenceDescription}</p>
          </div>
          <div className='text-xs text-muted-foreground bg-muted px-2 py-1 rounded'>
            {activeLabel}: {currentOption?.native || currentOption?.label}
          </div>
        </div>

        <div
          className={cn(
            'grid gap-4',
            options.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = value === option.value

            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                disabled={isTransitioning}
                className={cn(
                  'relative group p-4 rounded-lg border-2 transition-all duration-200',
                  'hover:scale-[1.02] focus:outline-none focus:ring-1 focus:ring-ring/50 focus:ring-inset',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5',
                  isTransitioning && 'pointer-events-none opacity-50',
                )}
                aria-label={`${option.label} seç`}
                aria-pressed={isSelected}
              >
                {/* Preview Section */}
                <div className='mb-3 flex justify-center'>
                  {typeof option.preview === 'string' ? (
                    <div className='w-16 h-12 rounded border-2 border-border bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center text-2xl'>
                      {option.preview}
                    </div>
                  ) : option.preview ? (
                    <div className='w-16 h-12 rounded border-2 relative overflow-hidden'>{option.preview}</div>
                  ) : (
                    <div className='w-16 h-12 rounded border-2 border-border bg-muted flex items-center justify-center'>
                      <Icon className='h-6 w-6 text-muted-foreground' />
                    </div>
                  )}
                </div>

                {/* Icon & Text */}
                <div className='text-center space-y-1'>
                  <Icon
                    className={cn(
                      'h-5 w-5 mx-auto transition-colors duration-200',
                      isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        'text-sm font-medium transition-colors duration-200',
                        isSelected ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {option.native || option.label}
                    </p>
                    <p className='text-xs text-muted-foreground'>{option.description}</p>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className='absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg'>
                    <div className='w-2 h-2 bg-primary-foreground rounded-full' />
                  </div>
                )}

                {/* Loading State */}
                {isTransitioning && isSelected && (
                  <div className='absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center'>
                    <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin' />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className='text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded-lg'>{noteText}</div>
      </CardContent>
    </Card>
  )
}
