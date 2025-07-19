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
  // Yeni Template API Endpoints
  COVER_LETTER_TEMPLATES: {
    CATEGORIES: '/cover-letter-templates/categories',
    TEMPLATES: '/cover-letter-templates/templates',
    TEMPLATES_BY_CATEGORY: (category: string) => `/cover-letter-templates/templates/category/${category}`,
    TEMPLATE_DETAIL: (templateId: string) => `/cover-letter-templates/templates/${templateId}`,
    GENERATE: '/cover-letter-templates/generate',
    STATISTICS: '/cover-letter-templates/statistics',
  },
  CONTACT: {
    SEND: '/contact/send',
    LIMIT: '/contact/limit',
    MESSAGES: '/contact/messages',
  },
} as const

export const TEMPLATE_CATEGORY = {
  WEB_DEVELOPER: 'WEB_DEVELOPER',
  ACCOUNT_EXECUTIVE: 'ACCOUNT_EXECUTIVE',
  DATA_ANALYST: 'DATA_ANALYST',
  MARKETING: 'MARKETING',
  SALES: 'SALES',
  HUMAN_RESOURCES: 'HUMAN_RESOURCES',
  GENERAL: 'GENERAL',
} as const

export const TEMPLATE_VALIDATION = {
  COMPANY_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  POSITION_TITLE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  APPLICANT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  CONTACT_PERSON: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  SPECIFIC_SKILLS: {
    MAX_COUNT: 10,
    MAX_LENGTH: 30,
  },
  ADDITIONAL_INFO: {
    MAX_LENGTH: 500,
  },
} as const

export const TEMPLATE_PLACEHOLDERS = {
  CONTACT_PERSON: '{{contactPerson}}',
  COMPANY_NAME: '{{companyName}}',
  POSITION_TITLE: '{{positionTitle}}',
  APPLICANT_NAME: '{{applicantName}}',
  APPLICANT_EMAIL: '{{applicantEmail}}',
  EXPERIENCE_YEARS: '{{experienceYears}}',
  SPECIFIC_SKILLS: '{{specificSkills}}',
  ADDITIONAL_INFO: '{{additionalInfo}}',
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
  // Yeni template error kodları
  TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
  TEMPLATE_GENERATION_FAILED: 'TEMPLATE_GENERATION_FAILED',
  INVALID_TEMPLATE_DATA: 'INVALID_TEMPLATE_DATA',
  MISSING_PLACEHOLDERS: 'MISSING_PLACEHOLDERS',
  TEMPLATE_CATEGORY_NOT_FOUND: 'TEMPLATE_CATEGORY_NOT_FOUND',
} as const

// Request Timeout
export const REQUEST_TIMEOUT = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
  LONG_RUNNING: 120000,
  CV_GENERATION: 60000,
  COVER_LETTER_GENERATION: 60000,
  TEMPLATE_GENERATION: 30000,
  TEMPLATE_FETCH: 10000,
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
  // Yeni template kategorileri
  WEB_DEVELOPER: 'WEB_DEVELOPER',
  ACCOUNT_EXECUTIVE: 'ACCOUNT_EXECUTIVE',
  DATA_ANALYST: 'DATA_ANALYST',
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
    MAX_SIZE: 10 * 1024 * 1024,
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
  getCVTypeColor: (type: string): string => {
    switch (type) {
      case CV_TYPE.ATS_OPTIMIZED:
        return '#10b981'
      case CV_TYPE.CREATIVE:
        return '#8b5cf6'
      case CV_TYPE.EXECUTIVE:
        return '#3b82f6'
      case CV_TYPE.ACADEMIC:
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  },

  getCategoryColor: (category: string): string => {
    switch (category) {
      case COVER_LETTER_CATEGORY.SOFTWARE_DEVELOPER:
        return '#3b82f6'
      case COVER_LETTER_CATEGORY.DATA_SCIENTIST:
        return '#8b5cf6'
      case COVER_LETTER_CATEGORY.MARKETING:
        return '#f97316'
      case COVER_LETTER_CATEGORY.SALES:
        return '#ef4444'
      case COVER_LETTER_CATEGORY.FINANCE:
        return '#10b981'
      case COVER_LETTER_CATEGORY.HUMAN_RESOURCES:
        return '#ec4899'
      default:
        return '#6b7280'
    }
  },

  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  isValidFileType: (file: File): boolean => {
    return FILE_VALIDATION.CV_UPLOAD.ALLOWED_TYPES.includes(
      file.type as (typeof FILE_VALIDATION.CV_UPLOAD.ALLOWED_TYPES)[number],
    )
  },

  isValidFileSize: (file: File): boolean => {
    return file.size <= FILE_VALIDATION.CV_UPLOAD.MAX_SIZE
  },
}

export const templateUtils = {
  // Template kategorisi için renk döndür
  getTemplateCategoryColor: (category: string): string => {
    switch (category) {
      case TEMPLATE_CATEGORY.WEB_DEVELOPER:
        return '#3b82f6' // blue
      case TEMPLATE_CATEGORY.ACCOUNT_EXECUTIVE:
        return '#ef4444' // red
      case TEMPLATE_CATEGORY.DATA_ANALYST:
        return '#8b5cf6' // purple
      case TEMPLATE_CATEGORY.MARKETING:
        return '#f97316' // orange
      case TEMPLATE_CATEGORY.SALES:
        return '#10b981' // green
      case TEMPLATE_CATEGORY.HUMAN_RESOURCES:
        return '#ec4899' // pink
      default:
        return '#6b7280' // gray
    }
  },

  // Template kategorisi için ikon döndür
  getTemplateCategoryIcon: (category: string): string => {
    const iconMap: Record<string, string> = {
      [TEMPLATE_CATEGORY.WEB_DEVELOPER]: 'Code',
      [TEMPLATE_CATEGORY.ACCOUNT_EXECUTIVE]: 'Users',
      [TEMPLATE_CATEGORY.DATA_ANALYST]: 'BarChart3',
      [TEMPLATE_CATEGORY.MARKETING]: 'Megaphone',
      [TEMPLATE_CATEGORY.SALES]: 'TrendingUp',
      [TEMPLATE_CATEGORY.HUMAN_RESOURCES]: 'Heart',
      [TEMPLATE_CATEGORY.GENERAL]: 'FileText',
    }
    return iconMap[category] || iconMap[TEMPLATE_CATEGORY.GENERAL]
  },

  // Template içindeki placeholder'ları çıkar
  extractPlaceholders: (content: string): string[] => {
    const placeholderRegex = /\{\{([^}]+)\}\}/g
    const matches = content.match(placeholderRegex)
    return matches ? [...new Set(matches)] : []
  },

  // Template content'ini placeholder'larla doldur
  replacePlaceholders: (content: string, data: Record<string, string>): string => {
    let result = content
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      result = result.replace(new RegExp(placeholder, 'g'), value || placeholder)
    })
    return result
  },

  // Template preview'ını kısalt
  truncateTemplatePreview: (content: string, maxLength: number = 150): string => {
    // Placeholder'ları temizle
    const cleanContent = content.replace(/\{\{[^}]+\}\}/g, '[...]')
    if (cleanContent.length <= maxLength) return cleanContent
    return cleanContent.substring(0, maxLength).trim() + '...'
  },

  // Template istatistiklerini formatla
  formatTemplateStatistics: (wordCount: number, characterCount: number) => ({
    wordCount,
    characterCount,
    estimatedReadingTime: Math.ceil(wordCount / 200), // 200 kelime/dakika ortalama okuma hızı
    characterCountFormatted: characterCount.toLocaleString('tr-TR'),
    wordCountFormatted: wordCount.toLocaleString('tr-TR'),
  }),

  // Placeholder validation
  validateTemplateData: (placeholders: string[], data: Record<string, any>): string[] => {
    const missingFields: string[] = []
    placeholders.forEach((placeholder) => {
      const field = placeholder.replace(/\{\{|\}\}/g, '')
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        missingFields.push(field)
      }
    })
    return missingFields
  },
}

export interface CVRequestConfig extends RequestConfig {
  validateBeforeSend?: boolean
  optimisticUpdate?: boolean
  includeAnalytics?: boolean
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
