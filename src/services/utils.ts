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

// Contact Message Type Constants
export const CONTACT_TYPE = {
  CONTACT: 'CONTACT',
  SUPPORT: 'SUPPORT',
  FEEDBACK: 'FEEDBACK',
  BUG_REPORT: 'BUG_REPORT',
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
