/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// React Query konfigürasyonu - mevcut axios altyapınızla uyumlu
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - verinin eski kabul edilme süresi (5 dakika)
      staleTime: 5 * 60 * 1000,
      // Cache time - verinin cache'de kalma süresi (10 dakika)
      gcTime: 10 * 60 * 1000,
      // Retry stratejisi - mevcut axios retry logic'inizle uyumlu
      retry: (failureCount, error: any) => {
        // 4xx hataları için retry yapma
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Maximum 3 retry
        return failureCount < 3
      },
      // Network hatalarında otomatik retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Background refetch ayarları
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Mutation retry ayarları
      retry: 1,
      retryDelay: 1000,
    },
  },
})

interface ReactQueryProviderProps {
  children: React.ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Sadece development ortamında DevTools göster */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position='bottom' buttonPosition='bottom-right' />
      )}
    </QueryClientProvider>
  )
}

// Global query client'ı export et (gerektiğinde erişim için)
export { queryClient }
