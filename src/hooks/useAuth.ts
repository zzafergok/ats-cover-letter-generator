'use client'

import { useEffect, useRef } from 'react'

import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      store.initialize()
    }
  }, [store])

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    checkAuth: store.checkAuth,
    refreshAuth: store.refreshAuth,
  }
}
