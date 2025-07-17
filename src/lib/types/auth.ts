export interface User {
  id: string
  email: string
  name?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    user: User
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  success: boolean
}

export interface AuthError {
  message: string
  code?: string
  status?: number
}

// Token management types
export interface TokenInfo {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  isValid: boolean
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
