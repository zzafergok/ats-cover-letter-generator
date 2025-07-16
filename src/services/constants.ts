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
  FILES: {
    UPLOAD: '/files/upload',
    DELETE: '/files',
    DOWNLOAD: '/files/download',
  },
} as const

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

export const REQUEST_TIMEOUT = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
  LONG_RUNNING: 120000,
} as const

export const CACHE_DURATIONS = {
  SHORT: 60000, // 1 dakika
  MEDIUM: 300000, // 5 dakika
  LONG: 900000, // 15 dakika
  VERY_LONG: 3600000, // 1 saat
}
