/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

import { useToast } from '@/store/toastStore'

import apiConfig from '@/config/api'
import { tokenManagerService } from './authService'

import { HTTP_STATUS, ApiResponse, RequestConfig, ApiError } from './utils'

// Global toast instance for interceptors
let globalToast: ReturnType<typeof useToast> | null = null

export const setGlobalToast = (toastInstance: ReturnType<typeof useToast>) => {
  globalToast = toastInstance
}

// Request Queue for handling multiple requests during token refresh
export class RequestQueue {
  private static instance: RequestQueue
  private queue: Array<{
    resolve: (config: InternalAxiosRequestConfig) => void
    reject: (error: any) => void
    config: InternalAxiosRequestConfig
  }> = []
  private isRefreshing = false

  static getInstance(): RequestQueue {
    if (!RequestQueue.instance) {
      RequestQueue.instance = new RequestQueue()
    }
    return RequestQueue.instance
  }

  addToQueue(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, config })
    })
  }

  processQueue(error: any, token: string | null): void {
    this.queue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error)
      } else if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
        resolve(config)
      }
    })
    this.queue = []
  }

  setRefreshing(status: boolean): void {
    this.isRefreshing = status
  }

  isRefreshingToken(): boolean {
    return this.isRefreshing
  }
}

// Enhanced API Service Class
export class EnhancedApiService {
  private axiosInstance: AxiosInstance
  private requestQueue = RequestQueue.getInstance()

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || apiConfig.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: apiConfig.timeout,
      withCredentials: false,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig & RequestConfig) => {
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        config.headers = config.headers || {}
        config.headers['X-Request-ID'] = requestId

        if (apiConfig.enableLogging) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
        }

        if (config.skipAuth) {
          return config
        }

        const token = tokenManagerService.getAccessToken()
        if (token) {
          if (tokenManagerService.isTokenExpired()) {
            try {
              const refreshResult = await tokenManagerService.refreshAccessToken(this.axiosInstance)
              if (refreshResult) {
                config.headers.Authorization = `Bearer ${refreshResult.token}`
              } else {
                return Promise.reject(new Error('Token yenileme başarısız'))
              }
            } catch (error) {
              return Promise.reject(error)
            }
          } else {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        tokenManagerService.updateLastActivity()
        return config
      },
      (error: AxiosError) => Promise.reject(error),
    )

    // Response Interceptor with Toast Integration
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as InternalAxiosRequestConfig & RequestConfig

        // GET istekleri hariç tüm başarılı işlemler için toast göster
        if (config.method !== 'get' && globalToast && !config.skipSuccessToast) {
          const message = response.data?.message || 'İşlem başarıyla tamamlandı'
          globalToast.success(message)
        }

        if (apiConfig.enableLogging) {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`)
        }

        return response.data
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & RequestConfig
        const errorMessage = this.extractErrorMessage(error)

        // GET istekleri hariç tüm başarısız işlemler için toast göster
        if (originalRequest?.method !== 'get' && globalToast && !originalRequest?.skipErrorToast) {
          globalToast.error(errorMessage)
        }

        if (originalRequest?.skipErrorHandling) {
          return Promise.reject(error)
        }

        // Token refresh logic
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && originalRequest && !originalRequest.skipAuth) {
          if (this.requestQueue.isRefreshingToken()) {
            try {
              const newConfig = await this.requestQueue.addToQueue(originalRequest)
              return this.axiosInstance(newConfig)
            } catch (queueError) {
              return Promise.reject(queueError)
            }
          }

          this.requestQueue.setRefreshing(true)
          try {
            const refreshResult = await tokenManagerService.refreshAccessToken(this.axiosInstance)
            if (refreshResult) {
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`
              this.requestQueue.processQueue(null, refreshResult.token)
              return this.axiosInstance(originalRequest)
            } else {
              const refreshError = new Error('Token yenileme başarısız')
              this.requestQueue.processQueue(refreshError, null)
              return Promise.reject(refreshError)
            }
          } catch (refreshError) {
            this.requestQueue.processQueue(refreshError, null)
            return Promise.reject(refreshError)
          } finally {
            this.requestQueue.setRefreshing(false)
          }
        }

        const apiError: ApiError = {
          status: error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: errorMessage,
          code: error.code || 'UNKNOWN_ERROR',
        }
        return Promise.reject(apiError)
      },
    )
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any
      return data.message || data.error || 'Bir hata oluştu'
    }
    return error.message || 'Ağ hatası oluştu'
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// Global instance
export const enhancedApiService = new EnhancedApiService()
