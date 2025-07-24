'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export function Logo({ size = 'md', className, showText = true }: LogoProps) {
  const sizeMap = {
    sm: { class: 'w-6 h-6', dimensions: 24 },
    md: { class: 'w-8 h-8', dimensions: 32 },
    lg: { class: 'w-12 h-12', dimensions: 48 },
  }

  const currentSize = sizeMap[size]

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('rounded-lg flex items-center justify-center overflow-hidden', currentSize.class)}>
        <Image
          src='/assets/logo/logo-cat.png'
          alt='Talent Architect'
          width={currentSize.dimensions}
          height={currentSize.dimensions}
          className='w-full h-full object-contain'
          priority
          quality={95}
        />
      </div>
      {showText && <span className='text-xl font-bold text-foreground'>Talent Architect</span>}
    </div>
  )
}
