'use client'

import React, { useEffect } from 'react'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

import { useAppSelector, useAppDispatch } from '@/store'
import { removeToast, selectToasts } from '@/store/slices/toastSlice'

import { cn } from '@/lib/utils'

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function ToastContainer({ position = 'top-right' }: ToastContainerProps) {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector(selectToasts)

  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-green-500 dark:text-green-400' />
      case 'error':
        return <AlertCircle className='h-5 w-5 text-red-500 dark:text-red-400' />
      case 'warning':
        return <AlertTriangle className='h-5 w-5 text-yellow-500 dark:text-yellow-400' />
      case 'info':
        return <Info className='h-5 w-5 text-blue-500 dark:text-blue-400' />
      default:
        return null
    }
  }

  const getToastStyles = (type: string) => {
    const baseStyles = 'bg-white dark:bg-card border shadow-lg dark:shadow-xl'

    switch (type) {
      case 'success':
        return `${baseStyles} border-green-200 dark:border-green-800/50`
      case 'error':
        return `${baseStyles} border-red-200 dark:border-red-800/50`
      case 'warning':
        return `${baseStyles} border-yellow-200 dark:border-yellow-800/50`
      case 'info':
        return `${baseStyles} border-blue-200 dark:border-blue-800/50`
      default:
        return `${baseStyles} border-neutral-200 dark:border-border`
    }
  }

  const toastContent = (
    <div className={cn('fixed z-[9999] pointer-events-none', positionClasses[position])}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='pointer-events-auto mb-4'
          >
            <div className={cn('min-w-[300px] max-w-md rounded-lg p-4 backdrop-blur-sm', getToastStyles(toast.type))}>
              <div className='flex items-start gap-3'>
                {getIcon(toast.type)}
                <div className='flex-1'>
                  {toast.title && (
                    <h4 className='text-sm font-semibold text-neutral-900 dark:text-foreground mb-1'>{toast.title}</h4>
                  )}
                  <p className='text-sm text-neutral-600 dark:text-muted-foreground'>{toast.message}</p>
                  {toast.action && (
                    <button
                      onClick={toast.action.onClick}
                      className='mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => dispatch(removeToast(toast.id))}
                  className='text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
              {!toast.persistent && toast.duration && (
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-b-lg overflow-hidden'>
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                    className={cn(
                      'h-full',
                      toast.type === 'success' && 'bg-green-500 dark:bg-green-400',
                      toast.type === 'error' && 'bg-red-500 dark:bg-red-400',
                      toast.type === 'warning' && 'bg-yellow-500 dark:bg-yellow-400',
                      toast.type === 'info' && 'bg-blue-500 dark:bg-blue-400',
                    )}
                    onAnimationComplete={() => dispatch(removeToast(toast.id))}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )

  return createPortal(toastContent, document.body)
}
