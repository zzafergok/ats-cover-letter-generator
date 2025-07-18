/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'

import AuthApiService from '@/lib/services/authApiService'
import { SessionTokenManager } from '@/lib/services/sessionTokenManager'
import { useAuthStore } from '@/store/authStore'

interface User {
  id: string
  email: string
  name: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const accessToken = SessionTokenManager.getAccessToken()
  const authStore = useAuthStore()

  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // AuthStore ile senkronizasyon
  const syncWithStore = useCallback(
    (userData: User | null, authStatus: boolean) => {
      setUser(userData)
      setIsAuthenticated(authStatus)

      // AuthStore'u güncelle
      authStore.setUser(userData)
      if (userData && authStatus) {
        authStore.setLoading(false)
      }
    },
    [authStore],
  )

  // Kullanıcı bilgilerini API'den al - response format handling ile
  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      if (!accessToken) {
        console.log('❌ No access token available for user fetch')
        return null
      }

      console.log('🔄 Fetching current user data...')
      const response = (await AuthApiService.getCurrentUser(accessToken)) as any

      console.log('📦 API Response:', response)

      // Response format kontrolü - farklı formatları destekle
      let userData: User | null = null

      if (response.user) {
        // Format 1: { user: {...} }
        userData = response.user
      } else if (response.data && response.data.user) {
        // Format 2: { data: { user: {...} } }
        userData = response.data.user
      } else if (response.data && !response.data.user) {
        // Format 3: { data: {...} } - user verisi doğrudan data içinde
        userData = response.data
      } else if (response.id && response.email) {
        // Format 4: {...} - user verisi doğrudan response içinde
        userData = response
      }

      // User data validation
      if (userData && userData.id && userData.email) {
        console.log('✅ User data fetched successfully:', userData.email)
        return userData as User
      } else {
        console.error('❌ Invalid user data format:', response)
        console.error('❌ Expected user object with id and email properties')
        return null
      }
    } catch (error) {
      console.error('❌ Failed to fetch current user:', error)
      return null
    }
  }, [accessToken])

  // Token durumunu kontrol et ve kullanıcı bilgilerini güncelle
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Checking authentication status...')

      // SessionStorage'da token kontrolü
      if (!SessionTokenManager.hasValidTokens()) {
        console.log('❌ No valid tokens found')
        if (isAuthenticated) {
          await handleLogout(false)
        }
        return false
      }

      // Access token expire olmuş mu kontrol et
      if (SessionTokenManager.isAccessTokenExpired()) {
        console.log('🔄 Access token expired, attempting refresh...')

        try {
          await AuthApiService.refreshAccessToken()
          console.log('✅ Token refreshed successfully')
        } catch (error) {
          console.error('❌ Token refresh failed:', error)
          await handleLogout(false)
          return false
        }
      }

      // Kullanıcı bilgilerini al ve state'i güncelle
      const userData = await fetchCurrentUser()
      if (!userData) {
        console.log('❌ Failed to get user data, logging out')
        await handleLogout(false)
        return false
      }

      // AuthProvider ve AuthStore'u senkronize et
      syncWithStore(userData, true)
      console.log('✅ Authentication verified for user:', userData.email)

      return true
    } catch (error) {
      console.error('❌ Auth check failed:', error)
      await handleLogout(false)
      return false
    }
  }, [isAuthenticated, syncWithStore])

  // Login işlemi
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false): Promise<void> => {
      try {
        console.log('🔄 Login attempt for:', email)
        setLoading(true)

        const response = await AuthApiService.loginUser({ email, password })

        if (response.success && response.data) {
          // User bilgisini hemen set et
          const userData = response.data.user as User

          // AuthProvider ve AuthStore'u senkronize et
          syncWithStore(userData, true)

          // Remember me durumunu localStorage'a kaydet (3 gün süreli)
          if (rememberMe) {
            SessionTokenManager.setRememberMe(true, email)
          } else {
            SessionTokenManager.clearRememberMe()
          }

          console.log(
            '✅ Login successful for user:',
            userData.email,
            rememberMe ? '(Remember Me enabled for 3 days)' : '',
          )
        } else {
          throw new Error(response.message || 'Login failed')
        }
      } catch (error) {
        console.error('❌ Login failed:', error)
        await handleLogout(false)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [syncWithStore],
  )

  // Logout işlemi
  const handleLogout = useCallback(
    async (callApi: boolean = true): Promise<void> => {
      try {
        if (callApi) {
          await AuthApiService.logoutUser()
          console.log('✅ Logout API call successful')
        }
      } catch (error) {
        console.error('❌ Logout API call failed:', error)
      } finally {
        // Remember me durumunu kontrol et
        const shouldRememberEmail = SessionTokenManager.getRememberMeStatus()
        const rememberedEmail = SessionTokenManager.getRememberedEmail()

        // AuthProvider ve AuthStore'u senkronize et
        syncWithStore(null, false)
        SessionTokenManager.clearTokens()

        // Eğer remember me aktifse email'i tekrar kaydet (3 gün süreli)
        if (shouldRememberEmail && rememberedEmail) {
          SessionTokenManager.setRememberMe(true, rememberedEmail)
          console.log('✅ Local state cleared but email preserved for 3 days')
        } else {
          console.log('✅ Local state cleared completely')
        }
      }
    },
    [syncWithStore],
  )

  const logout = useCallback(() => handleLogout(true), [handleLogout])

  // Token yenileme
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      await AuthApiService.refreshAccessToken()
      console.log('✅ Token refreshed manually')
    } catch (error) {
      console.error('❌ Manual token refresh failed:', error)
      // Silent fail - kullanıcıyı logout etme, sadece auth state'i kontrol et
      const hasValidTokens = SessionTokenManager.hasValidTokens()
      if (!hasValidTokens) {
        await handleLogout(false)
      }
      throw error
    }
  }, [handleLogout])

  // Sayfa yüklendiğinde auth durumunu kontrol et
  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitialized) return

      console.log('🚀 Initializing authentication...')
      setLoading(true)

      try {
        // Token varsa auth kontrol et
        const hasTokens = SessionTokenManager.hasValidTokens()
        if (hasTokens) {
          console.log('🔄 Found tokens, validating authentication...')
          await checkAuth()
        } else {
          console.log('❌ No tokens found during initialization')
          syncWithStore(null, false)
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error)
        syncWithStore(null, false)
      } finally {
        setLoading(false)
        setIsInitialized(true)
        console.log('✅ Auth initialization completed')
      }
    }

    initializeAuth()
  }, [checkAuth, isInitialized, syncWithStore])

  // Token durumu değişikliklerini periyodik kontrol
  useEffect(() => {
    if (!isAuthenticated || !isInitialized) return

    const interval = setInterval(async () => {
      const hasValidTokens = SessionTokenManager.hasValidTokens()
      if (!hasValidTokens) {
        console.log('⚠️ Token validation failed during periodic check')
        await handleLogout(false)
      }
    }, 60000) // Her dakika kontrol et

    return () => clearInterval(interval)
  }, [isAuthenticated, isInitialized, handleLogout])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    isLoading: loading,
    login,
    logout,
    checkAuth,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
