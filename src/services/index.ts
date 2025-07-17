export * from './utils'
export * from './apiService'
export * from './authService'

// Backward compatibility exports
export { apiService } from './apiService'
export { apiInstance } from './apiService'
import { tokenManagerService } from './authService'
export { tokenManagerService as TokenManager } from './authService'

// Legacy import compatibility
export const TokenManagerInstance = {
  getInstance: () => tokenManagerService,
}
