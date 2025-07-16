import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin', {
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
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, text, ...props }, ref) => (
    <div ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
      <svg
        className={cn(spinnerVariants({ size, variant }))}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
      {text && <span className='text-sm text-neutral-600 dark:text-neutral-400'>{text}</span>}
    </div>
  ),
)
LoadingSpinner.displayName = 'LoadingSpinner'

// Dots Loading Animation
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
      default: 'bg-primary-500 dark:bg-primary-400',
      secondary: 'bg-neutral-500 dark:bg-neutral-400',
      white: 'bg-white',
      accent: 'bg-accent-500 dark:bg-accent-400',
    }

    const safeSize = size || 'md'
    const safeVariant = variant || 'default'

    return (
      <div ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
        <div className='flex space-x-1'>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn('rounded-full animate-pulse', dotSizeMap[safeSize], colorMap[safeVariant])}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1.2s',
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
      default: 'bg-primary-200 dark:bg-primary-800',
      secondary: 'bg-neutral-200 dark:bg-neutral-800',
      white: 'bg-white/50',
      accent: 'bg-accent-200 dark:bg-accent-800',
    }

    const safeSize = size || 'md'
    const safeVariant = variant || 'default'

    return (
      <div ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
        <div className='relative'>
          <div
            className={cn(
              'animate-ping absolute inline-flex rounded-full opacity-75',
              pulseSizeMap[safeSize],
              pulseColorMap[safeVariant],
            )}
          />
          <div
            className={cn('relative inline-flex rounded-full', pulseSizeMap[safeSize], pulseColorMap[safeVariant])}
          />
        </div>
        {text && <span className='text-sm text-neutral-600 dark:text-neutral-400'>{text}</span>}
      </div>
    )
  },
)

LoadingPulse.displayName = 'LoadingPulse'

export { LoadingSpinner, LoadingDots, LoadingPulse }
