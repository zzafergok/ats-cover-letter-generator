import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
    UPLOAD_AVATAR: '/user/avatar',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    UPDATE: '/posts',
    DELETE: '/posts',
  },
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

// Error Codes
export const ERROR_CODES = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

// Request Timeout
export const REQUEST_TIMEOUT = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
  LONG_RUNNING: 120000,
} as const

// Type Definitions
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  status: number
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorHandling?: boolean
  retryAttempts?: number
  showErrorToast?: boolean
  skipCache?: boolean
  skipRetry?: boolean
  cacheTime?: number
}

// Request Queue for Token Refresh
interface QueuedRequest {
  resolve: (value: any) => void
  reject: (error: any) => void
  config: InternalAxiosRequestConfig
}

class RequestQueueClass {
  private static instance: RequestQueueClass
  private isRefreshing = false
  private failedQueue: QueuedRequest[] = []

  static getInstance(): RequestQueueClass {
    if (!RequestQueueClass.instance) {
      RequestQueueClass.instance = new RequestQueueClass()
    }
    return RequestQueueClass.instance
  }

  addToQueue(config: InternalAxiosRequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject, config })
    })
  }

  processQueue(error: any = null, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error)
      } else if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
        resolve(config)
      } else {
        reject(new Error('Token yenileme başarısız'))
      }
    })
    this.failedQueue = []
  }

  setRefreshing(status: boolean): void {
    this.isRefreshing = status
  }

  isRefreshingToken(): boolean {
    return this.isRefreshing
  }

  clearQueue(): void {
    this.failedQueue.forEach(({ reject }) => {
      reject(new Error('Request queue cleared'))
    })
    this.failedQueue = []
    this.isRefreshing = false
  }
}

export const RequestQueue = RequestQueueClass
