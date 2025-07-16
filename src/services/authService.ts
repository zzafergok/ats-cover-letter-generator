import { AxiosInstance } from 'axios'

import { API_ENDPOINTS, RefreshTokenResponse } from './utils'

import apiConfig from '@/config/api'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
    skipErrorHandling?: boolean
  }
}

export interface TokenInfo {
  hasAccessToken: boolean
  hasRefreshToken: boolean
  isExpired: boolean
  isSessionExpired: boolean
  lastActivity: string | null
  tokenExpiry: string | null
}

export interface TokenManagerService {
  getAccessToken(): string | null
  getRefreshToken(): string | null
  setTokens(accessToken: string, refreshToken: string, expiresIn?: number): void
  removeTokens(): void
  isTokenExpired(): boolean
  updateLastActivity(): void
  isSessionExpired(timeoutMinutes?: number): boolean
  refreshAccessToken(axiosInstance: AxiosInstance): Promise<RefreshTokenResponse | null>
  getTokenInfo(): TokenInfo
}

// Browser environment kontrolü
const isBrowser = (): boolean => typeof window !== 'undefined'

// Storage utilities
const storage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn(`Storage retrieval error for key ${key}:`, error)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error)
    }
  },

  removeItem: (key: string): void => {
    if (!isBrowser()) return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Storage removal error for key ${key}:`, error)
    }
  },
}

// Token refresh promise cache
let refreshPromiseCache: Promise<RefreshTokenResponse> | null = null

// Core token management functions
export const getAccessToken = (): string | null => {
  return storage.getItem('accessToken')
}

export const getRefreshToken = (): string | null => {
  return storage.getItem('refreshToken')
}

export const setTokens = (accessToken: string, refreshToken: string, expiresIn?: number): void => {
  storage.setItem('accessToken', accessToken)
  storage.setItem('refreshToken', refreshToken)

  const expiryTime = Date.now() + (expiresIn ? expiresIn * 1000 : apiConfig.tokenRefreshBuffer)
  storage.setItem('tokenExpiry', expiryTime.toString())
  storage.setItem('lastActivity', Date.now().toString())
}

export const removeTokens = (): void => {
  const keysToRemove = ['accessToken', 'refreshToken', 'tokenExpiry', 'lastActivity']
  keysToRemove.forEach((key) => storage.removeItem(key))
}

export const isTokenExpired = (): boolean => {
  if (!isBrowser()) return true

  const expiry = storage.getItem('tokenExpiry')
  if (!expiry) return true

  const bufferTime = 60000 // 1 dakika buffer
  return Date.now() > parseInt(expiry) - bufferTime
}

export const updateLastActivity = (): void => {
  if (!isBrowser()) return
  storage.setItem('lastActivity', Date.now().toString())
}

export const isSessionExpired = (timeoutMinutes: number = 30): boolean => {
  if (!isBrowser()) return true

  const lastActivity = storage.getItem('lastActivity')
  if (!lastActivity) return true

  const sessionTimeout = timeoutMinutes * 60 * 1000
  return Date.now() - parseInt(lastActivity) > sessionTimeout
}

const performTokenRefresh = async (
  axiosInstance: AxiosInstance,
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
      {
        skipAuth: true,
        skipErrorHandling: true,
        timeout: 10000,
      },
    )

    if (response.data?.success && response.data?.data) {
      const tokenData = response.data.data
      setTokens(tokenData.token, tokenData.refreshToken, tokenData.expiresIn)
      return tokenData
    }

    throw new Error('Token yenileme yanıtı geçersiz')
  } catch (error) {
    console.error('Token yenileme hatası:', error)
    throw new Error('Token yenileme başarısız')
  }
}

export const refreshAccessToken = async (axiosInstance: AxiosInstance): Promise<RefreshTokenResponse | null> => {
  if (refreshPromiseCache) {
    return refreshPromiseCache
  }

  const currentRefreshToken = getRefreshToken()
  if (!currentRefreshToken) {
    removeTokens()
    return null
  }

  refreshPromiseCache = performTokenRefresh(axiosInstance, currentRefreshToken)

  try {
    const result = await refreshPromiseCache
    return result
  } catch (error) {
    removeTokens()
    throw error
  } finally {
    refreshPromiseCache = null
  }
}

export const getTokenInfo = (): TokenInfo => {
  return {
    hasAccessToken: !!getAccessToken(),
    hasRefreshToken: !!getRefreshToken(),
    isExpired: isTokenExpired(),
    isSessionExpired: isSessionExpired(),
    lastActivity: storage.getItem('lastActivity'),
    tokenExpiry: storage.getItem('tokenExpiry'),
  }
}

// Service object for unified access
export const tokenManagerService: TokenManagerService = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  isTokenExpired,
  updateLastActivity,
  isSessionExpired,
  refreshAccessToken,
  getTokenInfo,
}
