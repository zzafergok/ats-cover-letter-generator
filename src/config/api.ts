interface ApiConfig {
  baseURL: string
  timeout: number
  retryDelay: number
  enableCache: boolean
  retryAttempts: number
  enableLogging: boolean
  defaultCacheTime: number
  tokenRefreshBuffer: number
  enableErrorReporting: boolean
  maxConcurrentRequests: number
  enablePerformanceMonitoring: boolean
}

const developmentConfig: ApiConfig = {
  timeout: 10000,
  retryAttempts: 2,
  retryDelay: 1000,
  enableCache: true,
  enableLogging: true,
  maxConcurrentRequests: 10,
  enableErrorReporting: false,
  enablePerformanceMonitoring: true,
  baseURL: 'http://localhost:5000/api',
  defaultCacheTime: 300000, // 5 dakika
  tokenRefreshBuffer: 300000, // 5 dakika
}

const productionConfig: ApiConfig = {
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 2000,
  enableCache: true,
  enableLogging: false,
  maxConcurrentRequests: 20,
  enableErrorReporting: true,
  enablePerformanceMonitoring: true,
  baseURL: 'https://api.example.com',
  defaultCacheTime: 600000, // 10 dakika
  tokenRefreshBuffer: 300000, // 5 dakika
}

const testConfig: ApiConfig = {
  timeout: 5000,
  retryAttempts: 1,
  retryDelay: 500,
  enableCache: false,
  defaultCacheTime: 0,
  enableLogging: false,
  maxConcurrentRequests: 5,
  enableErrorReporting: false,
  enablePerformanceMonitoring: false,
  baseURL: 'http://localhost:5000/api',
  tokenRefreshBuffer: 60000, // 1 dakika
}

export const apiConfig: ApiConfig =
  process.env.NODE_ENV === 'production'
    ? productionConfig
    : process.env.NODE_ENV === 'test'
      ? testConfig
      : developmentConfig

export default apiConfig
