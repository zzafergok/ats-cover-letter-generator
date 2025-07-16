'use client'

import { AxiosInstance } from 'axios'

export interface TokenInfo {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  isExpired: boolean
  lastActivity: number | null
  isValid: boolean
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRY_KEY = 'token_expiry'
const LAST_ACTIVITY_KEY = 'last_activity'

// Browser storage utility fonksiyonları
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error)
    return null
  }
}

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error)
  }
}

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing from localStorage key "${key}":`, error)
  }
}

// Access token işlemleri
export const getAccessToken = (): string | null => {
  return getStorageItem(ACCESS_TOKEN_KEY)
}

export const getRefreshToken = (): string | null => {
  return getStorageItem(REFRESH_TOKEN_KEY)
}

// Token'ları ayarlama - İyileştirilmiş validasyon
export const setTokens = (accessToken: string, refreshToken: string, expiresIn?: number): void => {
  if (!accessToken || !refreshToken) {
    console.error('setTokens: accessToken and refreshToken are required')
    return
  }

  // Token formatını doğrula
  if (!accessToken.startsWith('mock-access-token-') || !refreshToken.startsWith('mock-refresh-token-')) {
    console.warn('setTokens: Invalid token format detected')
  }

  setStorageItem(ACCESS_TOKEN_KEY, accessToken)
  setStorageItem(REFRESH_TOKEN_KEY, refreshToken)

  // Expiry time hesaplama
  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000
    setStorageItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
  }

  // Son aktivite zamanını kaydet
  updateLastActivity()
}

// Token'ları temizleme
export const removeTokens = (): void => {
  removeStorageItem(ACCESS_TOKEN_KEY)
  removeStorageItem(REFRESH_TOKEN_KEY)
  removeStorageItem(TOKEN_EXPIRY_KEY)
  removeStorageItem(LAST_ACTIVITY_KEY)
}

// Token süresinin dolup dolmadığını kontrol etme - İyileştirilmiş
export const isTokenExpired = (): boolean => {
  try {
    const accessToken = getAccessToken()
    if (!accessToken) {
      return true
    }

    const expiryTimeStr = getStorageItem(TOKEN_EXPIRY_KEY)
    if (!expiryTimeStr) {
      // Expiry time yoksa, token'ın kendisinden süreyi çıkarmaya çalış
      const tokenParts = accessToken.split('-')
      if (tokenParts.length >= 5) {
        const tokenTimestamp = parseInt(tokenParts[4])
        if (!isNaN(tokenTimestamp)) {
          // Token 1 saat geçerli varsayılıyor
          const oneHourInMs = 60 * 60 * 1000
          return Date.now() > tokenTimestamp + oneHourInMs
        }
      }
      // Fallback: expiry time yoksa expired kabul et
      return true
    }

    const expiryTime = parseInt(expiryTimeStr)
    if (isNaN(expiryTime)) {
      return true
    }

    // 5 dakika buffer time ile kontrol
    const bufferTime = 5 * 60 * 1000 // 5 dakika
    return Date.now() > expiryTime - bufferTime
  } catch (error) {
    console.error('isTokenExpired: Error checking token expiry:', error)
    return true
  }
}

// Son aktivite zamanını güncelleme
export const updateLastActivity = (): void => {
  setStorageItem(LAST_ACTIVITY_KEY, Date.now().toString())
}

// Session'ın süresi dolup dolmadığını kontrol etme
export const isSessionExpired = (timeoutMinutes: number = 30): boolean => {
  try {
    const lastActivityStr = getStorageItem(LAST_ACTIVITY_KEY)
    if (!lastActivityStr) {
      return true
    }

    const lastActivity = parseInt(lastActivityStr)
    if (isNaN(lastActivity)) {
      return true
    }

    const timeoutMs = timeoutMinutes * 60 * 1000
    return Date.now() - lastActivity > timeoutMs
  } catch (error) {
    console.error('isSessionExpired: Error checking session expiry:', error)
    return true
  }
}

// Token'ı yenileme - Mock implementation
export const refreshAccessToken = async (_axiosInstance: AxiosInstance): Promise<any> => {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    // Mock refresh request
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Refresh token'dan user ID'sini çıkar
    const tokenParts = refreshToken.split('-')
    if (tokenParts.length < 4) {
      throw new Error('Invalid refresh token format')
    }

    const userId = tokenParts[3]
    const timestamp = Date.now()

    const newTokens = {
      accessToken: `mock-access-token-${userId}-${timestamp}`,
      refreshToken: `mock-refresh-token-${userId}-${timestamp}`,
      expiresIn: 3600, // 1 saat
    }

    // Yeni token'ları kaydet
    setTokens(newTokens.accessToken, newTokens.refreshToken, newTokens.expiresIn)

    return {
      data: {
        access_token: newTokens.accessToken,
        refresh_token: newTokens.refreshToken,
        expires_in: newTokens.expiresIn,
      },
    }
  } catch (error) {
    console.error('refreshAccessToken: Token refresh failed:', error)
    // Refresh başarısız olursa token'ları temizle
    removeTokens()
    throw error
  }
}

// Token bilgilerini alma - Kapsamlı bilgi
export const getTokenInfo = (): TokenInfo => {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  const expiryTimeStr = getStorageItem(TOKEN_EXPIRY_KEY)
  const lastActivityStr = getStorageItem(LAST_ACTIVITY_KEY)

  const expiresAt = expiryTimeStr ? parseInt(expiryTimeStr) : null
  const lastActivity = lastActivityStr ? parseInt(lastActivityStr) : null
  const isExpired = isTokenExpired()

  return {
    accessToken,
    refreshToken,
    expiresAt,
    isExpired,
    lastActivity,
    isValid: !!(accessToken && refreshToken && !isExpired),
  }
}
