'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import {
  User,
  setUser,
  setError,
  logoutUser,
  setLoading,
  selectUser,
  selectError,
  selectIsLoading,
  selectIsAuthenticated,
} from '@/store/slices/userSlice'
import { showToast } from '@/store/slices/toastSlice'
import { useAppDispatch, useAppSelector } from '@/store'

import { useTokenManagerContext } from '@/providers/TokenManagerProvider'

import { LoginFormValues } from '@/lib/validations/auth'

// Mock kullanıcı veritabanı
const MOCK_USERS_DB = [
  {
    id: '1',
    name: 'Admin Kullanıcı',
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
    avatar: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: '2',
    name: 'Standart Kullanıcı',
    username: 'user',
    email: 'user@example.com',
    password: 'User123!',
    role: 'user',
    avatar: null,
    createdAt: '2024-01-02T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: '3',
    name: 'Demo Kullanıcı',
    username: 'demo',
    email: 'demo@example.com',
    password: 'Demo123!',
    role: 'demo',
    avatar: null,
    createdAt: '2024-01-03T00:00:00.000Z',
    lastLoginAt: null,
  },
] as const

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginFormValues) => Promise<User>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
  refreshUser: () => Promise<void>
}

export function useAuth(): AuthState & AuthActions {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const tokenManager = useTokenManagerContext()

  // Initialization state'lerini güvenli yönetim
  const initializationRef = useRef<{
    hasInitialized: boolean
    isInitializing: boolean
  }>({
    hasInitialized: false,
    isInitializing: false,
  })

  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)

  // Cookie'lerde token'ları ayarlama
  const setTokensInCookies = useCallback((accessToken: string, refreshToken: string, expiresIn?: number) => {
    if (typeof window !== 'undefined') {
      const maxAge = expiresIn ? expiresIn : 7 * 24 * 60 * 60 // 7 gün varsayılan
      const expires = new Date(Date.now() + maxAge * 1000).toUTCString()

      document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}; samesite=lax; expires=${expires}`
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${maxAge}; samesite=lax; expires=${expires}`

      // Token expiry time'ını da cookie'ye kaydet
      const expiryTime = Date.now() + maxAge * 1000
      document.cookie = `tokenExpiry=${expiryTime}; path=/; max-age=${maxAge}; samesite=lax; expires=${expires}`
    }
  }, [])

  // Cookie'lerden token'ları temizleme
  const clearTokensFromCookies = useCallback(() => {
    if (typeof window !== 'undefined') {
      const expiredDate = 'Thu, 01 Jan 1970 00:00:01 GMT'
      document.cookie = `accessToken=; path=/; expires=${expiredDate}`
      document.cookie = `refreshToken=; path=/; expires=${expiredDate}`
      document.cookie = `tokenExpiry=; path=/; expires=${expiredDate}`
    }
  }, [])

  // Token'dan kullanıcı ID'sini çıkarma
  const extractUserIdFromToken = useCallback((token: string): string | null => {
    try {
      // Mock token format: "mock-access-token-{userId}-{timestamp}"
      const tokenParts = token.split('-')
      if (tokenParts.length >= 4 && tokenParts[0] === 'mock' && tokenParts[1] === 'access') {
        return tokenParts[3] // userId kısmı
      }
      return null
    } catch (error) {
      console.error('Token parsing error:', error)
      return null
    }
  }, [])

  // Kullanıcı bilgilerini yenileme - İyileştirilmiş hata yönetimi
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const token = tokenManager.getAccessToken()
      if (!token) {
        throw new Error('No access token available')
      }

      // Mock user fetch simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Token'dan user ID'yi parse et
      const userId = extractUserIdFromToken(token)
      if (!userId) {
        throw new Error('Invalid token format')
      }

      const mockUser = MOCK_USERS_DB.find((u) => u.id === userId)

      if (!mockUser) {
        // Kullanıcı bulunamadığında token'ları temizle ve logout yap
        console.warn(`[useAuth] User with ID ${userId} not found in database`)
        throw new Error('User not found in database')
      }

      const { password: _password, ...userWithoutPassword } = mockUser
      dispatch(
        setUser({
          ...userWithoutPassword,
          avatar: userWithoutPassword.avatar || undefined,
          // lastLoginAt: new Date().toISOString(), // Son giriş zamanını güncelle
        }),
      )
    } catch (error) {
      console.error('[useAuth] User refresh failed:', error)
      // Kullanıcı yenilenemediğinde session'ı temizle
      await logout()
      throw error
    }
  }, [dispatch, tokenManager, extractUserIdFromToken])

  // Auth durumu kontrolü - Geliştirilmiş hata yönetimi
  const checkAuth = useCallback(async (): Promise<void> => {
    // Zaten initialize edilmişse veya initialization devam ediyorsa çık
    if (initializationRef.current.hasInitialized || initializationRef.current.isInitializing) {
      return
    }

    initializationRef.current.isInitializing = true
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const token = tokenManager.getAccessToken()
      const refreshToken = tokenManager.getRefreshToken()

      if (!token || !refreshToken) {
        await logout()
        return
      }

      // Token geçerliliği kontrolü
      if (tokenManager.isTokenExpired()) {
        try {
          // Mock token refresh
          await new Promise((resolve) => setTimeout(resolve, 500))

          const userId = extractUserIdFromToken(token)
          if (!userId) {
            throw new Error('Cannot extract user ID from expired token')
          }

          const newAccessToken = `mock-access-token-${userId}-${Date.now()}`
          const newRefreshToken = `mock-refresh-token-${userId}-${Date.now()}`
          const expiresIn = 3600 // 1 saat

          tokenManager.setTokens(newAccessToken, newRefreshToken, expiresIn)
          setTokensInCookies(newAccessToken, newRefreshToken, expiresIn)

          await refreshUser()
        } catch (refreshError) {
          console.error('[useAuth] Token refresh failed:', refreshError)
          await logout()
          return
        }
      }
    } catch (error) {
      console.error('[useAuth] Auth check failed:', error)
      dispatch(setError(t('auth.sessionExpired')))
      await logout()
    } finally {
      dispatch(setLoading(false))
      initializationRef.current.hasInitialized = true
      initializationRef.current.isInitializing = false
    }
  }, [dispatch, tokenManager, setTokensInCookies, refreshUser, extractUserIdFromToken, t])

  // Giriş işlemi - Token format'ını düzelt
  const login = useCallback(
    async (credentials: LoginFormValues): Promise<User> => {
      dispatch(setLoading(true))
      dispatch(setError(null))

      try {
        // Mock authentication
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const foundUser = MOCK_USERS_DB.find(
          (user) => user.email === credentials.email && user.password === credentials.password,
        )

        if (!foundUser) {
          throw new Error(t('auth.invalidCredentials'))
        }

        // Mock token generation - userId'yi token'a gömüyoruz
        const expiresIn = credentials.rememberMe ? 7 * 24 * 3600 : 3600 // 7 gün veya 1 saat
        const mockTokens = {
          accessToken: `mock-access-token-${foundUser.id}-${Date.now()}`,
          refreshToken: `mock-refresh-token-${foundUser.id}-${Date.now()}`,
          expiresIn,
        }

        // Token'ları kaydet
        tokenManager.setTokens(mockTokens.accessToken, mockTokens.refreshToken, mockTokens.expiresIn)
        setTokensInCookies(mockTokens.accessToken, mockTokens.refreshToken, mockTokens.expiresIn)

        // Kullanıcı bilgilerini kaydet
        const { password: _password, ...userWithoutPassword } = foundUser
        const loginUser: User = {
          ...userWithoutPassword,
          avatar: userWithoutPassword.avatar || undefined,
          // lastLoginAt: new Date().toISOString(),
        }

        dispatch(setUser(loginUser))

        // Başarı mesajı
        dispatch(
          showToast({
            type: 'success',
            title: t('common.success'),
            message: t('auth.welcomeBack') + ` ${loginUser.username}!`,
            duration: 3000,
          }),
        )

        // Initialization state'ini reset et
        initializationRef.current.hasInitialized = true
        initializationRef.current.isInitializing = false

        return loginUser
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : t('auth.loginFailed')
        console.error('[useAuth] Login failed:', errorMessage)

        dispatch(setError(errorMessage))
        dispatch(
          showToast({
            type: 'error',
            title: t('auth.loginFailed'),
            message: errorMessage,
            duration: 5000,
          }),
        )

        throw error
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch, tokenManager, setTokensInCookies, t],
  )

  // Çıkış işlemi - Değişiklik yok
  const logout = useCallback(async (): Promise<void> => {
    dispatch(setLoading(true))

    try {
      // Token'ları temizle
      tokenManager.removeTokens()
      clearTokensFromCookies()

      // Store'u temizle
      dispatch(logoutUser())
      dispatch(setError(null))

      // Başarı mesajı (sadece manuel logout'ta)
      if (user) {
        dispatch(
          showToast({
            type: 'success',
            title: t('auth.logoutSuccess'),
            message: t('auth.safelyLoggedOut'),
            duration: 3000,
          }),
        )
      }
    } catch (error) {
      console.warn('[useAuth] Logout error:', error)
      // Hata olsa bile local cleanup yapıyoruz
      tokenManager.removeTokens()
      clearTokensFromCookies()
      dispatch(logoutUser())
    } finally {
      dispatch(setLoading(false))
      // Initialization state'ini reset et
      initializationRef.current.hasInitialized = false
      initializationRef.current.isInitializing = false
    }
  }, [dispatch, tokenManager, clearTokensFromCookies, user, t])

  // Hata temizleme
  const clearError = useCallback(() => {
    dispatch(setError(null))
  }, [dispatch])

  // Component mount olduğunda auth durumunu kontrol et
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !initializationRef.current.hasInitialized &&
      !initializationRef.current.isInitializing
    ) {
      checkAuth()
    }
  }, []) // BOŞ dependency array - sadece mount'ta çalışır

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
    refreshUser,
  }
}
