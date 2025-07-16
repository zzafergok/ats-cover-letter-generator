'use client'

import React, { useEffect, useState } from 'react'

import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100',
  warning:
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100',
}

const iconStyles = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
}

export function Toast({ id, type, title, message, duration = 5000, onRemove, position = 'top-right' }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const Icon = toastIcons[type]

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 100)

    // Auto remove after duration
    const removeTimer = setTimeout(() => {
      handleRemove()
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(removeTimer)
    }
  }, [duration])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(id)
    }, 300)
  }

  // Animation sınıfları position'a göre belirlenir
  const getAnimationClasses = () => {
    const isTopPosition = position.includes('top')
    const isLeftPosition = position.includes('left')
    const isCenterPosition = position.includes('center')

    if (isCenterPosition) {
      // Center pozisyonları için yukarı/aşağı animasyon
      return isTopPosition
        ? isVisible && !isRemoving
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
        : isVisible && !isRemoving
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
    }

    // Sol/sağ pozisyonları için yan animasyon
    return isLeftPosition
      ? isVisible && !isRemoving
        ? 'translate-x-0 opacity-100'
        : '-translate-x-full opacity-0'
      : isVisible && !isRemoving
        ? 'translate-x-0 opacity-100'
        : 'translate-x-full opacity-0'
  }

  return (
    <div
      className={cn(
        'relative flex items-start space-x-3 w-full max-w-sm p-4 border rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 transform',
        'z-[9999]', // Z-index eklendi
        toastStyles[type],
        getAnimationClasses(),
      )}
      style={{ zIndex: 9999 }} // Inline style ile garantiye aldık
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconStyles[type])} />

      <div className='flex-1 min-w-0'>
        {title && <h4 className='text-sm font-semibold mb-1'>{title}</h4>}
        <p className='text-sm'>{message}</p>
      </div>

      <button
        onClick={handleRemove}
        className='flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current'
        aria-label="Toast'u kapat"
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  )
}
