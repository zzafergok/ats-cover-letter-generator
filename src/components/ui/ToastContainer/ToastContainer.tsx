/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

import { useToastStore } from '@/store/toastStore'

import { cn } from '@/lib/utils'

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

interface ProgressBarProps {
  delay: number
  isRunning: boolean
  closeToast: () => void
  type: string
  hide: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({ delay, isRunning, closeToast, type, hide }) => {
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const pausedTimeRef = useRef<number>(0)
  const totalPausedTimeRef = useRef<number>(0)

  const getProgressBarColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'info':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  useEffect(() => {
    if (hide || delay <= 0) return

    if (isRunning) {
      // Resume or start the progress
      if (pausedTimeRef.current > 0) {
        totalPausedTimeRef.current += Date.now() - pausedTimeRef.current
        pausedTimeRef.current = 0
      } else {
        startTimeRef.current = Date.now()
        totalPausedTimeRef.current = 0
        setProgress(100)
      }

      const updateProgress = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTimeRef.current - totalPausedTimeRef.current
        const remaining = Math.max(0, 100 - (elapsed / delay) * 100)

        setProgress(remaining)

        if (remaining <= 0) {
          closeToast()
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }

      intervalRef.current = setInterval(updateProgress, 16) // 60fps for smooth animation
    } else {
      // Pause the progress
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (pausedTimeRef.current === 0) {
        pausedTimeRef.current = Date.now()
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [delay, isRunning, hide, closeToast])

  // Reset progress when delay changes
  useEffect(() => {
    if (!hide && delay > 0) {
      startTimeRef.current = Date.now()
      totalPausedTimeRef.current = 0
      pausedTimeRef.current = 0
      setProgress(100)
    }
  }, [delay, hide])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  if (hide) return null

  return (
    <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200/60 dark:bg-gray-700/60 overflow-hidden'>
      <div
        className={cn('h-full transition-all duration-100 ease-linear', getProgressBarColor(type))}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function ToastContainer({ position = 'top-right' }: ToastContainerProps) {
  const { toasts, removeToast } = useToastStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || toasts.length === 0) return null

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  const getIcon = (type: string) => {
    const iconProps = { className: 'h-5 w-5 shrink-0' }
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className={cn(iconProps.className, 'text-green-500')} />
      case 'error':
        return <AlertCircle {...iconProps} className={cn(iconProps.className, 'text-red-500')} />
      case 'warning':
        return <AlertTriangle {...iconProps} className={cn(iconProps.className, 'text-yellow-500')} />
      case 'info':
        return <Info {...iconProps} className={cn(iconProps.className, 'text-blue-500')} />
      default:
        return null
    }
  }

  const getToastStyles = (type: string) => {
    const baseStyles =
      'bg-white dark:bg-gray-800 border shadow-lg backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.01]'
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-200 dark:border-green-800`
      case 'error':
        return `${baseStyles} border-red-200 dark:border-red-800`
      case 'warning':
        return `${baseStyles} border-yellow-200 dark:border-yellow-800`
      case 'info':
        return `${baseStyles} border-blue-200 dark:border-blue-800`
      default:
        return `${baseStyles} border-gray-200 dark:border-gray-700`
    }
  }

  const ToastItem = ({ toast }: { toast: any }) => {
    const [isRunning, setIsRunning] = useState(!toast.persistent && toast.duration > 0)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
      setIsRunning(!toast.persistent && toast.duration > 0)
    }, [toast.persistent, toast.duration])

    const handleToastClick = useCallback(
      (e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('button[aria-label*="kapat"]') || target.closest('button[data-toast-action]')) {
          return
        }
        removeToast(toast.id)
      },
      [toast.id],
    )

    const handleMouseEnter = useCallback(() => {
      setIsPaused(true)
      setIsRunning(false)
    }, [])

    const handleMouseLeave = useCallback(() => {
      setIsPaused(false)
      if (!toast.persistent && toast.duration > 0) {
        setIsRunning(true)
      }
    }, [toast.persistent, toast.duration])

    const closeToast = useCallback(() => {
      removeToast(toast.id)
    }, [toast.id])

    useEffect(() => {
      const handleWindowBlur = () => {
        setIsPaused(true)
        setIsRunning(false)
      }

      const handleWindowFocus = () => {
        setIsPaused(false)
        if (!toast.persistent && toast.duration > 0) {
          setIsRunning(true)
        }
      }

      window.addEventListener('blur', handleWindowBlur)
      window.addEventListener('focus', handleWindowFocus)

      return () => {
        window.removeEventListener('blur', handleWindowBlur)
        window.removeEventListener('focus', handleWindowFocus)
      }
    }, [toast.persistent, toast.duration])

    console.log('Toast debug:', {
      id: toast.id,
      persistent: toast.persistent,
      duration: toast.duration,
      hideProgressBar: toast.hideProgressBar,
      shouldShowProgress: !toast.persistent && toast.duration && !toast.hideProgressBar,
    })

    const shouldShowProgressBar = !toast.hideProgressBar && !toast.persistent && (toast.duration || 5000) > 0

    return (
      <div
        className={cn('relative rounded-xl overflow-hidden min-w-[320px] max-w-md', getToastStyles(toast.type))}
        onClick={handleToastClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='p-4'>
          <div className='flex items-start gap-3'>
            {getIcon(toast.type)}
            <div className='flex-1 min-w-0'>
              {toast.title && (
                <h4 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate'>{toast.title}</h4>
              )}
              <p className='text-sm text-gray-700 dark:text-gray-300 break-words'>{toast.message}</p>
              {toast.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toast.action.onClick()
                  }}
                  data-toast-action='true'
                  className='mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline'
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeToast(toast.id)
              }}
              className='shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              aria-label='Bildirimi kapat'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        </div>

        <ProgressBar
          delay={toast.duration || 5000}
          isRunning={isRunning && !isPaused}
          closeToast={closeToast}
          type={toast.type}
          hide={!shouldShowProgressBar}
        />
      </div>
    )
  }

  const toastContent = (
    <div className={cn('fixed z-[9999] pointer-events-none max-w-md w-full', positionClasses[position])}>
      <div className='space-y-3'>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className='pointer-events-auto'
            >
              <ToastItem toast={toast} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )

  return createPortal(toastContent, document.body)
}
