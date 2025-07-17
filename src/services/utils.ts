/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios'

// API Endpoints - Yeni task endpoints'leri eklendi
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
    UPLOAD_AVATAR: '/user/avatar',
    CHANGE_PASSWORD: '/user/change-password',
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    GET_BY_ID: (id: string) => `/projects/${id}`,
  },
  COLUMNS: {
    BY_PROJECT: (projectId: string) => `/columns/project/${projectId}`,
    CREATE: (projectId: string) => `/columns/project/${projectId}`,
    UPDATE: (id: string) => `/columns/${id}`,
    DELETE: (id: string) => `/columns/${id}`,
  },
  TASKS: {
    BY_PROJECT: (projectId: string) => `/tasks/project/${projectId}`,
    CREATE: (projectId: string) => `/tasks/project/${projectId}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    GET_BY_ID: (id: string) => `/tasks/${id}`,
    MOVE: (id: string) => `/tasks/${id}/move`,
    UPLOAD_JSON: (projectId: string) => `/tasks/project/${projectId}/upload-json`,
    TAGS: (projectId: string) => `/tasks/project/${projectId}/tags`,
    CREATE_TAG: (projectId: string) => `/tasks/project/${projectId}/tags`,
  },
  POSTS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    UPDATE: '/tasks',
    DELETE: '/tasks',
  },
  TAGS: {
    UPDATE: (id: string) => `/tags/${id}`,
    DELETE: (id: string) => `/tags/${id}`,
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
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  COLUMN_NOT_FOUND: 'COLUMN_NOT_FOUND',
  TAG_NOT_FOUND: 'TAG_NOT_FOUND',
  ASSIGNEE_NOT_FOUND: 'ASSIGNEE_NOT_FOUND',
  INVALID_TASK_DATA: 'INVALID_TASK_DATA',
  INVALID_JSON_FORMAT: 'INVALID_JSON_FORMAT',
} as const

// Request Timeout
export const REQUEST_TIMEOUT = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
  LONG_RUNNING: 120000,
  BULK_OPERATIONS: 60000, // JSON upload için
} as const

// Task Priority Constants
export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const

// Task Status Constants
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const

// User Role Constants
export const USER_ROLE = {
  DEVELOPER: 'DEVELOPER',
  ADMIN: 'ADMIN',
  PROJECT_ANALYST: 'PROJECT_ANALYST',
  PRODUCT_OWNER: 'PRODUCT_OWNER',
} as const

// Task Validation Rules
export const TASK_VALIDATION = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  TAG_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 30,
  },
  COLUMN_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  ESTIMATED_TIME: {
    MIN: 1, // dakika
  },
  POSITION: {
    MIN: 0,
  },
} as const

// Default Values
export const TASK_DEFAULTS = {
  PRIORITY: TASK_PRIORITY.MEDIUM,
  STATUS: TASK_STATUS.TODO,
  POSITION: 0,
  COLUMN: 'Backlog',
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
  field?: string // Validation error için hangi alan
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

// Gelişmiş Request Config
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

// Task specific request configs
export interface TaskRequestConfig extends RequestConfig {
  validateBeforeSend?: boolean
  optimisticUpdate?: boolean
  bulkOperation?: boolean
}

// Utility Functions
export const taskUtils = {
  // Görev prioritysi için renk döndür
  getPriorityColor: (priority: string): string => {
    switch (priority) {
      case TASK_PRIORITY.LOW:
        return '#10b981' // green
      case TASK_PRIORITY.MEDIUM:
        return '#f59e0b' // yellow
      case TASK_PRIORITY.HIGH:
        return '#f97316' // orange
      case TASK_PRIORITY.URGENT:
        return '#ef4444' // red
      default:
        return '#6b7280' // gray
    }
  },

  // Görev durumu için renk döndür
  getStatusColor: (status: string): string => {
    switch (status) {
      case TASK_STATUS.TODO:
        return '#6b7280' // gray
      case TASK_STATUS.IN_PROGRESS:
        return '#3b82f6' // blue
      case TASK_STATUS.DONE:
        return '#10b981' // green
      default:
        return '#6b7280' // gray
    }
  },

  // Tahmini süreyi formatla (dakikadan saat:dakika formatına)
  formatEstimatedTime: (minutes?: number): string => {
    if (!minutes) return '-'

    if (minutes < 60) {
      return `${minutes}dk`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours}sa`
    }

    return `${hours}sa ${remainingMinutes}dk`
  },

  // Due date formatla
  formatDueDate: (dueDate?: string): string => {
    if (!dueDate) return '-'

    const date = new Date(dueDate)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} gün gecikmeli`
    } else if (diffDays === 0) {
      return 'Bugün'
    } else if (diffDays === 1) {
      return 'Yarın'
    } else if (diffDays <= 7) {
      return `${diffDays} gün sonra`
    } else {
      return date.toLocaleDateString('tr-TR')
    }
  },

  // Task pozisyonunu hesapla
  calculateNewPosition: (tasks: any[], targetColumnId: string, overIndex?: number): number => {
    const columnTasks = tasks.filter((task) => task.columnId === targetColumnId).sort((a, b) => a.position - b.position)

    if (columnTasks.length === 0) {
      return 0
    }

    if (overIndex === undefined || overIndex >= columnTasks.length) {
      // En sona ekle
      return columnTasks[columnTasks.length - 1].position + 1000
    }

    if (overIndex === 0) {
      // En başa ekle
      return Math.max(0, columnTasks[0].position - 1000)
    }

    // Belirli pozisyona ekle
    const prevTask = columnTasks[overIndex - 1]
    const nextTask = columnTasks[overIndex]

    return Math.floor((prevTask.position + nextTask.position) / 2)
  },

  // JSON validation
  validateTaskJson: (json: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!json) {
      errors.push('JSON verisi boş olamaz')
      return { isValid: false, errors }
    }

    let tasks = []

    // JSON formatını normalize et
    if (Array.isArray(json)) {
      tasks = json
    } else if (json.tasks && Array.isArray(json.tasks)) {
      tasks = json.tasks
    } else {
      errors.push('JSON "tasks" dizisi içermeli veya doğrudan dizi formatında olmalı')
      return { isValid: false, errors }
    }

    if (tasks.length === 0) {
      errors.push('En az bir görev bulunmalı')
      return { isValid: false, errors }
    }

    // Her görevi validate et
    tasks.forEach((task: any, index: number) => {
      if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
        errors.push(`Görev ${index + 1}: Başlık zorunludur`)
      }

      if (task.title && task.title.length > TASK_VALIDATION.TITLE.MAX_LENGTH) {
        errors.push(`Görev ${index + 1}: Başlık maksimum ${TASK_VALIDATION.TITLE.MAX_LENGTH} karakter olabilir`)
      }

      if (!task.columnName || typeof task.columnName !== 'string' || task.columnName.trim().length === 0) {
        errors.push(`Görev ${index + 1}: Kolon adı zorunludur`)
      }

      if (task.priority && !Object.values(TASK_PRIORITY).includes(task.priority)) {
        errors.push(`Görev ${index + 1}: Geçersiz öncelik değeri (${Object.values(TASK_PRIORITY).join(', ')})`)
      }

      if (task.status && !Object.values(TASK_STATUS).includes(task.status)) {
        errors.push(`Görev ${index + 1}: Geçersiz durum değeri (${Object.values(TASK_STATUS).join(', ')})`)
      }

      if (task.estimatedTime && (!Number.isInteger(task.estimatedTime) || task.estimatedTime < 1)) {
        errors.push(`Görev ${index + 1}: Tahmini süre pozitif tam sayı olmalı (dakika)`)
      }

      if (task.dueDate && task.dueDate !== null) {
        const date = new Date(task.dueDate)
        if (isNaN(date.getTime())) {
          errors.push(`Görev ${index + 1}: Geçersiz tarih formatı (ISO 8601 kullanın)`)
        }
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
