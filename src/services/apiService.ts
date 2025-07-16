import { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { tokenManagerService } from './authService'

import { store } from '@/store'
import { showToast } from '@/store/slices/toastSlice'
import { logoutUser } from '@/store/slices/userSlice'

import apiConfig from '@/config/api'

import { HTTP_STATUS, ERROR_CODES, ApiResponse, RequestConfig, ApiError, RequestQueue } from './utils'

// Axios instance creation and configuration
export const createApiInstance = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL || apiConfig.baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: apiConfig.timeout,
    withCredentials: false,
  })

  setupAxiosInterceptors(instance)
  return instance
}

// Error handling consolidated
class ErrorHandler {
  static handleError(error: AxiosError): ApiError {
    const status = error.response?.status || 0
    const responseData = error.response?.data as any
    let message = 'Beklenmeyen bir hata oluştu'
    let code: string = ERROR_CODES.SERVER_ERROR

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        message = responseData?.message || 'Geçersiz istek parametreleri'
        code = ERROR_CODES.VALIDATION_ERROR
        break
      case HTTP_STATUS.UNAUTHORIZED:
        message = 'Oturum süreniz dolmuş, lütfen tekrar giriş yapın'
        code = ERROR_CODES.TOKEN_EXPIRED
        break
      case HTTP_STATUS.FORBIDDEN:
        message = 'Bu işlemi yapmaya yetkiniz bulunmuyor'
        code = ERROR_CODES.PERMISSION_DENIED
        break
      case HTTP_STATUS.NOT_FOUND:
        message = 'İstenen kaynak bulunamadı'
        code = ERROR_CODES.RESOURCE_NOT_FOUND
        break
      default:
        if (!error.response) {
          message = 'İnternet bağlantınızı kontrol ediniz'
          code = ERROR_CODES.NETWORK_ERROR
        }
    }

    return { message, status, code, details: responseData }
  }

  static showErrorToast(error: ApiError): void {
    try {
      store.dispatch(
        showToast({
          type: 'error',
          title: 'Hata',
          message: error.message,
          duration: 5000,
        }),
      )
    } catch (toastError) {
      console.error('Toast error:', toastError)
    }
  }

  static handleAuthError(): void {
    tokenManagerService.removeTokens()
    store.dispatch(logoutUser())

    this.showErrorToast({
      message: 'Oturumunuz sonlandırıldı, lütfen tekrar giriş yapın',
      status: 401,
      code: ERROR_CODES.TOKEN_EXPIRED,
    })

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login'
      }
    }
  }
}

// Interceptors setup
const setupAxiosInterceptors = (axiosInstance: AxiosInstance): void => {
  const requestQueue = RequestQueue.getInstance()

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig & RequestConfig) => {
      try {
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
              const refreshResult = await tokenManagerService.refreshAccessToken(axiosInstance)
              if (refreshResult) {
                config.headers.Authorization = `Bearer ${refreshResult.token}`
              } else {
                ErrorHandler.handleAuthError()
                return Promise.reject(new Error('Token yenileme başarısız'))
              }
            } catch (error) {
              ErrorHandler.handleAuthError()
              return Promise.reject(error)
            }
          } else {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        tokenManagerService.updateLastActivity()
        return config
      } catch (error) {
        return Promise.reject(error)
      }
    },
    (error: AxiosError) => Promise.reject(error),
  )

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (apiConfig.enableLogging) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`)
      }
      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & RequestConfig

      if (originalRequest?.skipErrorHandling) {
        return Promise.reject(error)
      }

      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && originalRequest && !originalRequest.skipAuth) {
        if (requestQueue.isRefreshingToken()) {
          try {
            const newConfig = await requestQueue.addToQueue(originalRequest)
            return axiosInstance(newConfig)
          } catch (queueError) {
            return Promise.reject(queueError)
          }
        }

        requestQueue.setRefreshing(true)
        try {
          const refreshResult = await tokenManagerService.refreshAccessToken(axiosInstance)
          if (refreshResult) {
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`
            requestQueue.processQueue(null, refreshResult.token)
            return axiosInstance(originalRequest)
          } else {
            const refreshError = new Error('Token yenileme başarısız')
            requestQueue.processQueue(refreshError, null)
            ErrorHandler.handleAuthError()
            return Promise.reject(refreshError)
          }
        } catch (refreshError) {
          requestQueue.processQueue(refreshError, null)
          ErrorHandler.handleAuthError()
          return Promise.reject(refreshError)
        } finally {
          requestQueue.setRefreshing(false)
        }
      }

      const apiError = ErrorHandler.handleError(error)
      if (originalRequest?.showErrorToast !== false) {
        ErrorHandler.showErrorToast(apiError)
      }
      return Promise.reject(apiError)
    },
  )
}

// Main API Service
class ApiService {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
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

// RTK Query base query
export const axiosBaseQuery = ({ baseUrl }: { baseUrl?: string } = {}): BaseQueryFn<
  {
    url: string
    method?: any
    data?: any
    params?: any
    headers?: any
  } & RequestConfig,
  unknown,
  ApiError
> => {
  return async ({ url, method = 'GET', data, params, headers, ...config }) => {
    try {
      const result = await apiInstance({
        url: baseUrl ? `${baseUrl}${url}` : url,
        method,
        data,
        params,
        headers,
        ...config,
      })
      return { data: result.data }
    } catch (axiosError) {
      const error = axiosError as ApiError
      return {
        error: {
          status: error.status,
          data: error.message,
          message: error.message,
          code: error.code,
        },
      }
    }
  }
}

// Exports
export const apiInstance = createApiInstance()
export const apiService = new ApiService(apiInstance)
