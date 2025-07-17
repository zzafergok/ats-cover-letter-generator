/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { TokenManager } from '@/services'
import { enhancedApiService } from '@/services/enhanced-api-service'

import { User, LoginCredentials, AuthResponse, AuthState } from '@/lib/types/auth'

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  setLoading: (loading: boolean) => void
  setUser: (user: User | null) => void
  refreshAuth: () => Promise<void>
  initialize: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        })
      },

      initialize: async () => {
        set({ isLoading: true })

        if (TokenManager.getAccessToken()) {
          try {
            await get().checkAuth()
          } catch (error) {
            console.error('Auth initialization failed:', error)
            get().logout()
          }
        } else {
          set({ isLoading: false })
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })

        try {
          const response = await enhancedApiService.post<AuthResponse>('/api/auth/login', credentials, {
            skipSuccessToast: true,
          })

          if (!response.data.success) {
            throw new Error('Login failed')
          }

          // Doğru veri erişimi
          const { user, accessToken, refreshToken } = response.data.data

          TokenManager.setTokens(accessToken, refreshToken)

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })

          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || 'Login failed')
        }
      },

      logout: async () => {
        try {
          // Logout API çağrısı - otomatik toast gösterecek
          await enhancedApiService.post(
            '/auth/logout',
            {},
            {
              skipErrorToast: true, // Logout hatalarını sessizce yönet
            },
          )
        } catch (error) {
          // Logout hatalarını sessizce yönet
          console.warn('Logout API call failed:', error)
        } finally {
          TokenManager.removeTokens()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      checkAuth: async () => {
        if (!TokenManager.getAccessToken()) {
          get().logout()
          return
        }

        try {
          const response = await enhancedApiService.get<{ success: boolean; data: User }>('/api/auth/me')

          if (response.data.success && response.data.data) {
            set({
              user: response.data.data,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            get().logout()
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          get().logout()
        }
      },

      refreshAuth: async () => {
        if (get().isAuthenticated) {
          await get().checkAuth()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
