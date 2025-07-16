// Centralized type definitions for store
export interface LangState {
  currentLanguage: string
  availableLanguages: string[]
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system'
  systemPreference: 'light' | 'dark'
}

export interface ToastState {
  toasts: Toast[]
}

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

export interface LoadingState {
  items: Record<string, LoadingItem>
  globalLoading: boolean
  pageLoading: boolean
}

export interface LoadingItem {
  id: string
  message?: string
  progress?: number
  type: 'global' | 'component' | 'page' | 'api'
  startTime: number
}
