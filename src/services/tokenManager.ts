/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

export interface TokenInfo {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  isExpired: boolean
  lastActivity: number | null
  isValid: boolean
  rememberMe: boolean
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRY_KEY = 'token_expiry'
const LAST_ACTIVITY_KEY = 'last_activity'
const REMEMBER_ME_KEY = 'remember_me'
const REMEMBER_ME_EXPIRY_KEY = 'remember_me_expiry'

// Remember me süresi (30 gün)
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 gün milisaniye

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

// Remember me durumunu kontrol et
export const isRememberMeValid = (): boolean => {
  const rememberMe = getStorageItem(REMEMBER_ME_KEY)
  const expiryTime = getStorageItem(REMEMBER_ME_EXPIRY_KEY)

  if (!rememberMe || !expiryTime) return false

  const now = Date.now()
  const expiry = parseInt(expiryTime)

  return now < expiry
}

// Remember me durumunu kaydet
export const setRememberMe = (remember: boolean): void => {
  if (remember) {
    const expiryTime = Date.now() + REMEMBER_ME_DURATION
    setStorageItem(REMEMBER_ME_KEY, 'true')
    setStorageItem(REMEMBER_ME_EXPIRY_KEY, expiryTime.toString())
  } else {
    removeStorageItem(REMEMBER_ME_KEY)
    removeStorageItem(REMEMBER_ME_EXPIRY_KEY)
  }
}

// Remember me durumunu getir
export const getRememberMeStatus = (): boolean => {
  return isRememberMeValid() && getStorageItem(REMEMBER_ME_KEY) === 'true'
}

// Tokenları kaydet (remember me durumunu dikkate alarak)
export const setTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number = 3600,
  rememberMe: boolean = false,
): void => {
  const now = Date.now()
  const expiryTime = now + expiresIn * 1000

  setStorageItem(ACCESS_TOKEN_KEY, accessToken)
  setStorageItem(REFRESH_TOKEN_KEY, refreshToken)
  setStorageItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
  setStorageItem(LAST_ACTIVITY_KEY, now.toString())

  setRememberMe(rememberMe)
}

// Tokenları temizle
export const clearTokens = (): void => {
  removeStorageItem(ACCESS_TOKEN_KEY)
  removeStorageItem(REFRESH_TOKEN_KEY)
  removeStorageItem(TOKEN_EXPIRY_KEY)
  removeStorageItem(LAST_ACTIVITY_KEY)
  removeStorageItem(REMEMBER_ME_KEY)
  removeStorageItem(REMEMBER_ME_EXPIRY_KEY)
}

// Token bilgilerini getir
export const getTokenInfo = (): TokenInfo => {
  const accessToken = getStorageItem(ACCESS_TOKEN_KEY)
  const refreshToken = getStorageItem(REFRESH_TOKEN_KEY)
  const expiresAt = getStorageItem(TOKEN_EXPIRY_KEY)
  const lastActivity = getStorageItem(LAST_ACTIVITY_KEY)
  const rememberMe = getRememberMeStatus()

  const expiryTime = expiresAt ? parseInt(expiresAt) : null
  const isExpired = expiryTime ? Date.now() > expiryTime : true
  const isValid = Boolean(accessToken && refreshToken && !isExpired)

  return {
    accessToken,
    refreshToken,
    expiresAt: expiryTime,
    isExpired,
    lastActivity: lastActivity ? parseInt(lastActivity) : null,
    isValid,
    rememberMe,
  }
}

export const getAccessToken = (): string | null => getStorageItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = (): string | null => getStorageItem(REFRESH_TOKEN_KEY)
