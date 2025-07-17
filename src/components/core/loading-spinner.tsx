'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const spinnerVariants = cva('', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
      '2xl': 'h-16 w-16',
    },
    variant: {
      default: 'text-primary-500 dark:text-primary-400',
      secondary: 'text-neutral-500 dark:text-neutral-400',
      white: 'text-white',
      accent: 'text-accent-500 dark:text-accent-400',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
})

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string
  centered?: boolean
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, text, centered = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-3',
        {
          'w-full justify-center': centered,
        },
        className,
      )}
      {...props}
    >
      <div className={cn('relative', spinnerVariants({ size, variant }))}>
        {/* Modern gradient ring spinner */}
        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-current via-transparent to-current opacity-20 animate-spin' />
        <div className='absolute inset-0 rounded-full'>
          <div
            className='h-full w-full rounded-full border-2 border-transparent bg-gradient-to-r from-current to-transparent animate-spin'
            style={{
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
            }}
          />
        </div>
        <svg
          className='relative animate-spin'
          style={{ animationDuration: '1.5s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)' }}
          viewBox='0 0 24 24'
          fill='none'
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeDasharray='31.416'
            strokeDashoffset='31.416'
            className='opacity-25'
          />
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeDasharray='31.416'
            strokeDashoffset='23.562'
            className='opacity-75'
            style={{
              filter: 'drop-shadow(0 0 6px currentColor)',
            }}
          />
        </svg>
      </div>
      {text && <span className='text-sm text-neutral-600 dark:text-neutral-400 animate-pulse'>{text}</span>}
    </div>
  ),
)
LoadingSpinner.displayName = 'LoadingSpinner'

// Modern bouncing dots animation
const LoadingDots = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', variant = 'default', text, ...props }, ref) => {
    const dotSizeMap = {
      xs: 'h-1 w-1',
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
      xl: 'h-3 w-3',
      '2xl': 'h-4 w-4',
    }

    const colorMap = {
      default: 'bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-300 dark:to-primary-500',
      secondary: 'bg-gradient-to-r from-neutral-400 to-neutral-600 dark:from-neutral-300 dark:to-neutral-500',
      white: 'bg-white shadow-lg',
      accent: 'bg-gradient-to-r from-accent-400 to-accent-600 dark:from-accent-300 dark:to-accent-500',
    }

    const safeSize = size || 'md'
    const safeVariant = variant || 'default'

    return (
      <div ref={ref} className={cn('inline-flex items-center gap-3', className)} {...props}>
        <div className='flex space-x-1.5'>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn('rounded-full transform-gpu', dotSizeMap[safeSize], colorMap[safeVariant])}
              style={{
                animation: `modernBounce 1.4s ease-in-out ${index * 0.2}s infinite`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          ))}
        </div>
        {text && <span className='text-sm text-neutral-600 dark:text-neutral-400'>{text}</span>}
      </div>
    )
  },
)
LoadingDots.displayName = 'LoadingDots'

// Modern pulse with neumorphism effect
const LoadingPulse = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', variant = 'default', text, ...props }, ref) => {
    const pulseSizeMap = {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
      xl: 'h-20 w-20',
      '2xl': 'h-24 w-24',
    }

    const pulseColorMap = {
      default:
        'bg-gradient-to-br from-primary-200 via-primary-300 to-primary-400 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900',
      secondary:
        'bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-900',
      white: 'bg-gradient-to-br from-white via-gray-50 to-gray-100',
      accent:
        'bg-gradient-to-br from-accent-200 via-accent-300 to-accent-400 dark:from-accent-700 dark:via-accent-800 dark:to-accent-900',
    }

    const safeSize = size || 'md'
    const safeVariant = variant || 'default'

    return (
      <div ref={ref} className={cn('inline-flex items-center gap-3', className)} {...props}>
        <div className='relative'>
          {/* Outer glow ring */}
          <div
            className={cn(
              'absolute inset-0 rounded-full opacity-30 blur-sm',
              pulseSizeMap[safeSize],
              pulseColorMap[safeVariant],
            )}
            style={{
              animation: 'modernPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          {/* Main pulse */}
          <div
            className={cn('relative rounded-full shadow-lg', pulseSizeMap[safeSize], pulseColorMap[safeVariant])}
            style={{
              animation: 'modernPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0.3s',
              boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.1)',
            }}
          />
          {/* Inner highlight */}
          <div
            className={cn('absolute top-1/4 left-1/4 rounded-full bg-white opacity-40', {
              'h-1.5 w-1.5': safeSize === 'xs',
              'h-2 w-2': safeSize === 'sm',
              'h-3 w-3': safeSize === 'md',
              'h-4 w-4': safeSize === 'lg',
              'h-5 w-5': safeSize === 'xl',
              'h-6 w-6': safeSize === '2xl',
            })}
            style={{
              animation: 'modernPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0.1s',
            }}
          />
        </div>
        {text && <span className='text-sm text-neutral-600 dark:text-neutral-400'>{text}</span>}
      </div>
    )
  },
)

LoadingPulse.displayName = 'LoadingPulse'

export { LoadingSpinner, LoadingDots, LoadingPulse }
