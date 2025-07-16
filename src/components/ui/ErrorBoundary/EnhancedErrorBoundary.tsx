'use client'

import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900'>
      <div className='max-w-md w-full p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg'>
        <div className='text-center'>
          <div className='text-red-500 text-4xl mb-4'>⚠️</div>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>Bir Hata Oluştu</h2>
          <p className='text-neutral-600 dark:text-neutral-400 mb-4'>Uygulama beklenmeyen bir hatayla karşılaştı.</p>

          {process.env.NODE_ENV === 'development' && (
            <details className='text-left mb-4 p-3 bg-neutral-100 dark:bg-neutral-700 rounded text-sm'>
              <summary className='cursor-pointer font-medium mb-2'>Hata Detayları</summary>
              <pre className='whitespace-pre-wrap text-xs text-red-600 dark:text-red-400'>
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}

          <div className='space-y-2'>
            <button
              onClick={resetErrorBoundary}
              className='w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors'
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className='w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors'
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface EnhancedErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function EnhancedErrorBoundary({ children, onError }: EnhancedErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Error logging
    console.error('Error Boundary caught an error:', error, errorInfo)

    // External error reporting
    if (onError) {
      onError(error, errorInfo)
    }

    // Production error reporting
    if (process.env.NODE_ENV === 'production') {
      // Burada error tracking servisine gönderilebilir (Sentry, LogRocket vb.)
    }
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Cleanup işlemleri
        window.location.reload()
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
