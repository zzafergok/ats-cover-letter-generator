'use client'

import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const skeletonVariants = cva('animate-pulse bg-neutral-200 dark:bg-neutral-800', {
  variants: {
    variant: {
      default: 'rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      text: 'rounded-sm h-4',
    },
    animation: {
      pulse: 'animate-pulse',
      shimmer:
        'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800',
      wave: 'animate-wave',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    animation: 'pulse',
  },
})

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {
  width?: number | string
  height?: number | string
  lines?: number
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, animation, width, height, lines, style, ...props }, ref) => {
    const baseStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    }

    // Text skeleton with multiple lines
    if (variant === 'text' && lines && lines > 1) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(skeletonVariants({ variant, animation }))}
              style={{
                ...baseStyle,
                width: index === lines - 1 && lines > 1 ? '75%' : baseStyle.width,
              }}
            />
          ))}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn(skeletonVariants({ variant, animation }), className)} style={baseStyle} {...props} />
    )
  },
)

Skeleton.displayName = 'Skeleton'

// Önceden tanımlanmış skeleton bileşenleri
export const SkeletonText = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'> & { lines?: number }>(
  ({ lines = 1, ...props }, ref) => <Skeleton ref={ref} variant='text' lines={lines} {...props} />,
)

SkeletonText.displayName = 'SkeletonText'

export const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'variant' | 'width' | 'height'> & { size?: number }
>(({ size = 40, className, ...props }, ref) => (
  <Skeleton ref={ref} variant='circular' width={size} height={size} className={className} {...props} />
))

SkeletonAvatar.displayName = 'SkeletonAvatar'

export const SkeletonButton = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant' | 'width' | 'height'>>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} variant='default' width={80} height={36} className={className} {...props} />
  ),
)

SkeletonButton.displayName = 'SkeletonButton'

export const SkeletonCard = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 space-y-4', className)} {...props}>
      <div className='space-y-2'>
        <Skeleton variant='text' width='60%' height={20} />
        <Skeleton variant='text' lines={2} height={16} />
      </div>
      <Skeleton variant='rectangular' width='100%' height={200} />
      <div className='flex items-center space-x-4'>
        <SkeletonAvatar size={32} />
        <div className='space-y-1 flex-1'>
          <Skeleton variant='text' width='40%' height={14} />
          <Skeleton variant='text' width='60%' height={12} />
        </div>
      </div>
      {children}
    </div>
  ),
)

SkeletonCard.displayName = 'SkeletonCard'
