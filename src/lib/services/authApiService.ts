/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  setTokens,
  clearTokens,
  debugTokenInfo,
  getRefreshToken,
  SessionTokenManager,
  isRefreshTokenExpired,
} from './sessionTokenManager'

import { API_ENDPOINTS, RequestConfig } from '@/services/utils'

import { apiClient } from '../api/axios'

// ========== TYPE DEFINITIONS ==========

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  role?: string
}

export interface AuthData {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface RegisterResponse {
  success: boolean
  data: RegisterData
  message?: string
}

export interface RegisterData {
  message: string
  email: string
  emailSent: boolean
}

export interface LoginResponse {
  success: boolean
  data: AuthData
  message?: string
}

export interface RefreshTokenResponse {
  success: boolean
  data: {
    accessToken: string
    expiresIn: number
  }
  message?: string
}

export interface AuthError extends Error {
  success: false
  message: string
  code?: string
  status?: number
}

export interface BasicResponse {
  success: boolean
  message: string
}

export interface CurrentUserResponse {
  user: User
}

/**
 * Kullanıcı giriş işlemi
 * @param credentials - Kullanıcı giriş bilgileri
 * @returns Promise<LoginResponse>
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('🔄 Login attempt for:', credentials.email)

    const config: RequestConfig = { skipAuth: true }
    const response: any = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, config)

    if (response.success && response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken, response.data.expiresIn)

      console.log('✅ Login successful, tokens saved to sessionStorage')

      if (process.env.NODE_ENV === 'development') {
        debugTokenInfo()
      }
    }

    return response
  } catch (error) {
    console.error('❌ Login failed:', error)
    clearTokens()
    throw error
  }
}

/**
 * Kullanıcı kayıt işlemi
 * @param userData - Kullanıcı kayıt bilgileri
 * @returns Promise<RegisterResponse>
 */
export const registerUser = async (userData: RegisterCredentials): Promise<RegisterResponse> => {
  try {
    console.log('🔄 Register attempt for:', userData.email)

    const config: RequestConfig = { skipAuth: true }
    const response: any = await apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData, config)

    if (response.success && response.data) {
      // Register işleminde token'lar döndürülmüyorsa bu kısmı yorum satırına al
      if (response.data.accessToken && response.data.refreshToken) {
        setTokens(response.data.accessToken, response.data.refreshToken, response.data.expiresIn)
        console.log('✅ Registration successful, tokens saved to sessionStorage')
      } else {
        console.log('✅ Registration successful, email verification required')
      }

      if (process.env.NODE_ENV === 'development') {
        debugTokenInfo()
      }
    }

    return response
  } catch (error) {
    console.error('❌ Registration failed:', error)
    clearTokens()
    throw error
  }
}

/**
 * Access token yenileme işlemi
 * @returns Promise<string> - Yeni access token
 */
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  if (isRefreshTokenExpired()) {
    clearTokens()
    throw new Error('Refresh token expired')
  }

  try {
    console.log('🔄 Refreshing access token...')

    const config: RequestConfig = { skipAuth: true }
    const response: any = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
      config,
    )

    if (response.success && response.data) {
      const currentRefreshToken = getRefreshToken()

      if (!currentRefreshToken) {
        throw new Error('Refresh token lost during refresh process')
      }

      setTokens(response.data.accessToken, currentRefreshToken, response.data.expiresIn)

      console.log('✅ Access token refreshed successfully')
      return response.data.accessToken
    } else {
      throw new Error('Invalid refresh response')
    }
  } catch (error) {
    console.error('❌ Token refresh failed:', error)
    clearTokens()
    throw error
  }
}

/**
 * Kullanıcı çıkış işlemi
 * @returns Promise<void>
 */
export const logoutUser = async (): Promise<void> => {
  try {
    console.log('🔄 Logout attempt...')

    const refreshToken = SessionTokenManager.getAccessToken()

    // API'ye logout request gönder (isteğe bağlı)
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })

    console.log('✅ Logout successful')
  } catch (error) {
    console.error('⚠️ Logout API call failed, but continuing with local cleanup:', error)
  } finally {
    // Her durumda local token'ları temizle
    clearTokens()
  }
}

/**
 * Mevcut kullanıcı bilgilerini getir
 * @param _accessToken - Access token
 * @returns Promise<any> - Kullanıcı bilgileri
 */
export const getCurrentUser = async (accessToken?: string): Promise<CurrentUserResponse> => {
  try {
    console.log('🔄 Fetching current user...')

    const token = accessToken || SessionTokenManager.getAccessToken()

    if (!token) {
      throw new Error('No access token available')
    }

    const config: RequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response: any = await apiClient.get<CurrentUserResponse>('/auth/me', config)

    console.log('✅ Current user fetched successfully')
    return response
  } catch (error) {
    console.error('❌ Failed to fetch current user:', error)
    throw error
  }
}

/**
 * Email doğrulama işlemi
 * @param token - Email doğrulama token'ı
 * @returns Promise<LoginResponse>
 */
export const verifyEmail = async (token: string): Promise<LoginResponse> => {
  try {
    console.log('🔄 Email verification attempt with token')

    const config: RequestConfig = { skipAuth: true }
    const response: any = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }, config)

    if (response.success && response.data) {
      SessionTokenManager.setTokens(response.data.accessToken, response.data.refreshToken, response.data.expiresIn)

      console.log('✅ Email verification successful, tokens saved')

      if (process.env.NODE_ENV === 'development') {
        SessionTokenManager.debugInfo()
      }
    }

    return response
  } catch (error) {
    console.error('❌ Email verification failed:', error)
    throw error
  }
}

// Default export with all functions
const AuthApiService = {
  loginUser,
  logoutUser,
  verifyEmail,
  registerUser,
  getCurrentUser,
  refreshAccessToken,
}

export default AuthApiService
