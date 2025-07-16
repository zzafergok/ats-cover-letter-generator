'use client'

import { useCallback, useRef, useEffect } from 'react'

import { AxiosInstance } from 'axios'

import {
  TokenInfo,
  setTokens,
  removeTokens,
  getTokenInfo,
  getAccessToken,
  isTokenExpired,
  getRefreshToken,
  isSessionExpired,
  updateLastActivity,
  refreshAccessToken,
} from '@/services/tokenManager'

export interface UseTokenManagerReturn {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (accessToken: string, refreshToken: string, expiresIn?: number) => void
  removeTokens: () => void
  isTokenExpired: () => boolean
  updateLastActivity: () => void
  isSessionExpired: (timeoutMinutes?: number) => boolean
  refreshAccessToken: (axiosInstance: AxiosInstance) => Promise<any>
  getTokenInfo: () => TokenInfo
  isInitialized: boolean
}

export function useTokenManager(): UseTokenManagerReturn {
  const isInitializedRef = useRef(false)

  // Component mount olduğunda token durumunu kontrol et
  useEffect(() => {
    if (typeof window !== 'undefined') {
      isInitializedRef.current = true
    }
  }, [])

  // Memoized callback functions
  const handleGetAccessToken = useCallback(() => {
    return getAccessToken()
  }, [])

  const handleGetRefreshToken = useCallback(() => {
    return getRefreshToken()
  }, [])

  const handleSetTokens = useCallback((accessToken: string, refreshToken: string, expiresIn?: number) => {
    setTokens(accessToken, refreshToken, expiresIn)
  }, [])

  const handleRemoveTokens = useCallback(() => {
    removeTokens()
  }, [])

  const handleIsTokenExpired = useCallback(() => {
    return isTokenExpired()
  }, [])

  const handleUpdateLastActivity = useCallback(() => {
    updateLastActivity()
  }, [])

  const handleIsSessionExpired = useCallback((timeoutMinutes?: number) => {
    return isSessionExpired(timeoutMinutes)
  }, [])

  const handleRefreshAccessToken = useCallback(async (axiosInstance: AxiosInstance) => {
    return refreshAccessToken(axiosInstance)
  }, [])

  const handleGetTokenInfo = useCallback(() => {
    return getTokenInfo()
  }, [])

  return {
    getAccessToken: handleGetAccessToken,
    getRefreshToken: handleGetRefreshToken,
    setTokens: handleSetTokens,
    removeTokens: handleRemoveTokens,
    isTokenExpired: handleIsTokenExpired,
    updateLastActivity: handleUpdateLastActivity,
    isSessionExpired: handleIsSessionExpired,
    refreshAccessToken: handleRefreshAccessToken,
    getTokenInfo: handleGetTokenInfo,
    isInitialized: isInitializedRef.current,
  }
}
