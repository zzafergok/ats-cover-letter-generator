/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios'

// API Endpoints - ATS CV Backend API'ye uygun endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
  },
  CV: {
    UPLOAD: '/cv/upload',
    UPLOADS: '/cv/uploads',
    DELETE_UPLOAD: (id: string) => `/cv/uploads/${id}`,
    GENERATE: '/cv/generate',
    SAVE: '/cv/save',
    SAVED: '/cv/saved',
    DELETE_SAVED: (id: string) => `/cv/saved/${id}`,
    DOWNLOAD: (id: string) => `/cv/download/${id}`,
    DOWNLOAD_PDF: '/cv/download/pdf',
    DOWNLOAD_DOCX: '/cv/download/docx',
  },
  COVER_LETTER: {
    CATEGORIES: '/cover-letter/categories',
    GENERATE: '/cover-letter/generate',
    SAVE: '/cover-letter/save',
    SAVED: '/cover-letter/saved',
    DELETE_SAVED: (id: string) => `/cover-letter/saved/${id}`,
    DOWNLOAD_PDF: '/cover-letter/download/pdf',
    DOWNLOAD_DOCX: '/cover-letter/download/docx',
  },
  CONTACT: {
    SEND: '/contact/send',
    LIMIT: '/contact/limit',
    MESSAGES: '/contact/messages',
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

// Error Codes - ATS CV projesi için güncellendi
export const ERROR_CODES = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CV_NOT_FOUND: 'CV_NOT_FOUND',
  CV_UPLOAD_FAILED: 'CV_UPLOAD_FAILED',
  CV_GENERATION_FAILED: 'CV_GENERATION_FAILED',
  COVER_LETTER_NOT_FOUND: 'COVER_LETTER_NOT_FOUND',
  COVER_LETTER_GENERATION_FAILED: 'COVER_LETTER_GENERATION_FAILED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  INVALID_CV_DATA: 'INVALID_CV_DATA',
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
} as const

// Request Timeout
export const REQUEST_TIMEOUT = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
  LONG_RUNNING: 120000,
  CV_GENERATION: 60000,
  COVER_LETTER_GENERATION: 60000,
} as const

// CV Type Constants
export const CV_TYPE = {
  ATS_OPTIMIZED: 'ATS_OPTIMIZED',
  CREATIVE: 'CREATIVE',
  EXECUTIVE: 'EXECUTIVE',
  ACADEMIC: 'ACADEMIC',
} as const

// Cover Letter Category Constants
export const COVER_LETTER_CATEGORY = {
  SOFTWARE_DEVELOPER: 'SOFTWARE_DEVELOPER',
  DATA_SCIENTIST: 'DATA_SCIENTIST',
  MARKETING: 'MARKETING',
  SALES: 'SALES',
  FINANCE: 'FINANCE',
  HUMAN_RESOURCES: 'HUMAN_RESOURCES',
  GENERAL: 'GENERAL',
} as const

// Contact Message Type Constants
export const CONTACT_TYPE = {
  CONTACT: 'CONTACT',
  SUPPORT: 'SUPPORT',
  FEEDBACK: 'FEEDBACK',
  BUG_REPORT: 'BUG_REPORT',
} as const

// CV Validation Rules
export const CV_VALIDATION = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  CONTENT: {
    MAX_LENGTH: 50000,
  },
  POSITION_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  COMPANY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  JOB_DESCRIPTION: {
    MAX_LENGTH: 5000,
  },
  ADDITIONAL_REQUIREMENTS: {
    MAX_LENGTH: 2000,
  },
  TARGET_KEYWORDS: {
    MAX_COUNT: 20,
    MAX_LENGTH: 50,
  },
} as const

// File Upload Validation
export const FILE_VALIDATION = {
  CV_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  },
} as const

// Default Values
export const CV_DEFAULTS = {
  TYPE: CV_TYPE.ATS_OPTIMIZED,
  CATEGORY: COVER_LETTER_CATEGORY.GENERAL,
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
  field?: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

// Request Config
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorHandling?: boolean
  skipSuccessToast?: boolean
  skipErrorToast?: boolean
  retryAttempts?: number
  showCustomToast?: {
    success?: string
    error?: string
  }
  skipCache?: boolean
  skipRetry?: boolean
  cacheTime?: number
  timeout?: number
}

// CV specific request configs
export interface CVRequestConfig extends RequestConfig {
  validateBeforeSend?: boolean
  optimisticUpdate?: boolean
  includeAnalytics?: boolean
}

// Utility Functions for ATS CV project
export const cvUtils = {
  // CV tipi için renk döndür
  getCVTypeColor: (type: string): string => {
    switch (type) {
      case CV_TYPE.ATS_OPTIMIZED:
        return '#10b981' // green
      case CV_TYPE.CREATIVE:
        return '#8b5cf6' // purple
      case CV_TYPE.EXECUTIVE:
        return '#3b82f6' // blue
      case CV_TYPE.ACADEMIC:
        return '#f59e0b' // yellow
      default:
        return '#6b7280' // gray
    }
  },

  // Cover letter kategorisi için renk döndür
  getCategoryColor: (category: string): string => {
    switch (category) {
      case COVER_LETTER_CATEGORY.SOFTWARE_DEVELOPER:
        return '#3b82f6' // blue
      case COVER_LETTER_CATEGORY.DATA_SCIENTIST:
        return '#8b5cf6' // purple
      case COVER_LETTER_CATEGORY.MARKETING:
        return '#f97316' // orange
      case COVER_LETTER_CATEGORY.SALES:
        return '#ef4444' // red
      case COVER_LETTER_CATEGORY.FINANCE:
        return '#10b981' // green
      case COVER_LETTER_CATEGORY.HUMAN_RESOURCES:
        return '#ec4899' // pink
      default:
        return '#6b7280' // gray
    }
  },

  // Dosya boyutunu formatla
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Dosya tipini kontrol et
  isValidFileType: (file: File): boolean => {
    return FILE_VALIDATION.CV_UPLOAD.ALLOWED_TYPES.includes(
      file.type as (typeof FILE_VALIDATION.CV_UPLOAD.ALLOWED_TYPES)[number],
    )
  },

  // Dosya boyutunu kontrol et
  isValidFileSize: (file: File): boolean => {
    return file.size <= FILE_VALIDATION.CV_UPLOAD.MAX_SIZE
  },

  // Tarih formatla
  formatDate: (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  },

  // Relative time formatla
  formatRelativeTime: (date: string | Date): string => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} gün önce`
    } else if (diffHours > 0) {
      return `${diffHours} saat önce`
    } else if (diffMinutes > 0) {
      return `${diffMinutes} dakika önce`
    } else {
      return 'Az önce'
    }
  },

  // CV içeriğini validate et
  validateCVContent: (content: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!content || content.trim().length === 0) {
      errors.push('CV içeriği boş olamaz')
    }

    if (content.length > CV_VALIDATION.CONTENT.MAX_LENGTH) {
      errors.push(`CV içeriği maksimum ${CV_VALIDATION.CONTENT.MAX_LENGTH} karakter olabilir`)
    }

    return { isValid: errors.length === 0, errors }
  },

  // Target keywords validate et
  validateTargetKeywords: (keywords: string[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (keywords.length > CV_VALIDATION.TARGET_KEYWORDS.MAX_COUNT) {
      errors.push(`Maksimum ${CV_VALIDATION.TARGET_KEYWORDS.MAX_COUNT} anahtar kelime eklenebilir`)
    }

    keywords.forEach((keyword, index) => {
      if (keyword.length > CV_VALIDATION.TARGET_KEYWORDS.MAX_LENGTH) {
        errors.push(
          `Anahtar kelime ${index + 1} maksimum ${CV_VALIDATION.TARGET_KEYWORDS.MAX_LENGTH} karakter olabilir`,
        )
      }
    })

    return { isValid: errors.length === 0, errors }
  },

  // Random hex color generator
  generateRandomColor: (): string => {
    const colors = [
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#14b8a6',
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#d946ef',
      '#ec4899',
      '#f43f5e',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  },
}

// Request Queue for handling multiple requests during token refresh
export class RequestQueue {
  private static instance: RequestQueue
  private queue: Array<{
    resolve: (config: any) => void
    reject: (error: any) => void
    config: any
  }> = []
  private isRefreshing = false

  static getInstance(): RequestQueue {
    if (!RequestQueue.instance) {
      RequestQueue.instance = new RequestQueue()
    }
    return RequestQueue.instance
  }

  addToQueue(config: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, config })
    })
  }

  processQueue(error: any, token: string | null) {
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

  setRefreshing(status: boolean) {
    this.isRefreshing = status
  }

  isRefreshingToken(): boolean {
    return this.isRefreshing
  }
}
