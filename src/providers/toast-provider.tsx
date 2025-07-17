'use client'

import { useEffect } from 'react'

import { ToastContainer } from '@/components/ui/ToastContainer/ToastContainer'

import { useToast } from '@/store/toastStore'

import { setGlobalToast as setEnhancedApiToast } from '@/services/enhanced-api-service'

import { setGlobalToast as setAxiosToast } from '@/lib/api/axios'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast()

  useEffect(() => {
    // Her iki servise de toast instance'ını register et
    setEnhancedApiToast(toast)
    setAxiosToast(toast)
  }, [toast])

  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
