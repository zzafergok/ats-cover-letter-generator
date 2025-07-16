import * as React from 'react'

// React bileşen türleri
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

// Form bileşen türleri
export interface FormFieldProps extends BaseComponentProps {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  description?: string
}

// Button türleri
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  fullWidth?: boolean
  loading?: boolean
}

// Input türleri
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

// Select türleri
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  onValueChange?: (value: string) => void
}

// Theme türleri
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeState {
  mode: ThemeMode
  systemPreference: 'light' | 'dark'
}

// API türleri
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, unknown>
}

// User türleri
export interface User {
  id: string
  username: string
  email: string
  name: string
  avatar?: string
  role: string
  createdAt?: string
  updatedAt?: string
}

// Auth türleri
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface AuthResponse {
  user: User
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

// Loading türleri
export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
}

// Toast türleri
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

// Utility türleri
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export type NonEmptyArray<T> = [T, ...T[]]
export type ValueOf<T> = T[keyof T]
