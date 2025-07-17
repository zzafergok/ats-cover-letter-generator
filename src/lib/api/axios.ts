/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

import { SessionTokenManager } from '@/lib/services/sessionTokenManager'

// Global toast instance for interceptors
let globalToast: any = null

export const setGlobalToast = (toastInstance: any) => {
  globalToast = toastInstance
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

// Extended config interface for toast control
export interface ExtendedRequestConfig {
  skipAuth?: boolean
  skipSuccessToast?: boolean
  skipErrorToast?: boolean
  headers?: Record<string, string>
}

interface QueueItem {
  resolve: (config: InternalAxiosRequestConfig) => void
  reject: (error: any) => void
  config: InternalAxiosRequestConfig
}

let isRefreshing = false
let requestQueue: QueueItem[] = []

const createAxiosInstance = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.starkon-kanban.com'

  return axios.create({
    baseURL,
    timeout: 100000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
}

const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig & ExtendedRequestConfig) => {
      // Skip auth eğer belirtilmişse
      if (config.skipAuth) {
        return config
      }

      const token = SessionTokenManager.getAccessToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.error('❌ No access token available')
        // Token yoksa ve auth gerekiyorsa hata fırlat
        throw new Error('No access token available')
      }

      return config
    },
    (error: AxiosError) => Promise.reject(error),
  )
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = SessionTokenManager.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  console.log('🔄 Attempting to refresh access token')

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      },
    )

    const { accessToken, expiresIn } = response.data.data || response.data

    SessionTokenManager.setTokens(accessToken, refreshToken, expiresIn)

    console.log('✅ Access token refreshed successfully')
    return accessToken
  } catch (error) {
    console.error('❌ Failed to refresh access token:', error)
    SessionTokenManager.clearTokens()
    throw error
  }
}

const processRequestQueue = (error: any, token: string | null): void => {
  requestQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error)
    } else if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
      resolve(config)
    }
  })
  requestQueue = []
}

const handleAuthFailure = (): void => {
  console.log('🚫 Authentication failure - clearing tokens and redirecting')
  SessionTokenManager.clearTokens()
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as InternalAxiosRequestConfig & ExtendedRequestConfig

      // GET istekleri hariç tüm başarılı işlemler için toast göster
      if (config.method !== 'get' && globalToast && !config.skipSuccessToast) {
        const message = response.data?.message || 'İşlem başarıyla tamamlandı'
        globalToast.success(message)
      }

      return response.data
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & ExtendedRequestConfig & { _retry?: boolean }
      const status = error.response?.status

      // GET istekleri hariç tüm başarısız işlemler için toast göster
      if (originalRequest?.method !== 'get' && globalToast && !originalRequest?.skipErrorToast) {
        const errorMessage =
          (error.response?.data as any)?.message ||
          (typeof error.response?.data === 'object' && error.response?.data && 'error' in error.response.data
            ? (error.response.data as any).error
            : undefined) ||
          'Bir hata oluştu'
        globalToast.error(errorMessage)
      }

      if (status === 401 && !originalRequest._retry && SessionTokenManager.getRefreshToken()) {
        console.log('🔄 Attempting token refresh for 401 error')

        if (isRefreshing) {
          console.log('⏳ Token refresh already in progress, queuing request')
          return new Promise((resolve, reject) => {
            requestQueue.push({
              resolve: (config: InternalAxiosRequestConfig) => resolve(instance(config)),
              reject: (err: any) => reject(err),
              config: originalRequest,
            })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const newToken = await refreshAccessToken()
          processRequestQueue(null, newToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }

          console.log('🔄 Retrying original request with new token')
          return instance(originalRequest)
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError)
          processRequestQueue(refreshError, null)
          handleAuthFailure()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      const apiError: ApiError = {
        message: (error.response?.data as any)?.message || error.message || 'Unknown error occurred',
        status: status || 500,
        code: error.code,
      }

      return Promise.reject(apiError)
    },
  )
}

const createApiClient = (): AxiosInstance => {
  const instance = createAxiosInstance()
  setupRequestInterceptor(instance)
  setupResponseInterceptor(instance)
  return instance
}

export const apiClient = createApiClient()

export const apiRequest = {
  get: <T = any>(url: string, config?: ExtendedRequestConfig): Promise<T> => apiClient.get(url, config),
  post: <T = any>(url: string, data?: any, config?: ExtendedRequestConfig): Promise<T> =>
    apiClient.post(url, data, config),
  put: <T = any>(url: string, data?: any, config?: ExtendedRequestConfig): Promise<T> =>
    apiClient.put(url, data, config),
  delete: <T = any>(url: string, config?: ExtendedRequestConfig): Promise<T> => apiClient.delete(url, config),
  patch: <T = any>(url: string, data?: any, config?: ExtendedRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config),
}
