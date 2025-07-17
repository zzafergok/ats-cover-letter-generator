'use client'

import { useEffect, useCallback, useRef } from 'react'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  isInitialized: boolean
  isTransitioning: boolean
  setTheme: (theme: Theme) => void
  setIsInitialized: (initialized: boolean) => void
  setIsTransitioning: (transitioning: boolean) => void
}

// Zustand store with persistence
const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      isInitialized: false,
      isTransitioning: false,

      setTheme: (theme: Theme) => set({ theme }),
      setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
      setIsTransitioning: (isTransitioning: boolean) => set({ isTransitioning }),
    }),
    {
      name: 'starkon-theme-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return localStorage
      }),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)

export function useTheme() {
  const {
    theme,
    isInitialized,
    isTransitioning,
    setTheme: setStoreTheme,
    setIsInitialized,
    setIsTransitioning,
  } = useThemeStore()

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initializationRef = useRef<boolean>(false)

  const applyThemeToDocument = useCallback(
    (targetTheme: Theme) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return

      const root = document.documentElement
      const isDark = targetTheme === 'dark'

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }

      setIsTransitioning(true)
      root.classList.add('theme-transitioning')

      if (isDark) {
        root.classList.remove('light')
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
      }

      root.style.setProperty('color-scheme', targetTheme)

      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#ffffff')
      }

      transitionTimeoutRef.current = setTimeout(() => {
        root.classList.remove('theme-transitioning')
        setIsTransitioning(false)
      }, 200)
    },
    [setIsTransitioning],
  )

  useEffect(() => {
    if (typeof window === 'undefined' || initializationRef.current) return

    initializationRef.current = true

    const initialize = async () => {
      try {
        setIsInitialized(true)
      } catch (error) {
        console.error('[useTheme] Initialization failed:', error)
        setIsInitialized(true)
      }
    }

    initialize()

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [setIsInitialized])

  useEffect(() => {
    if (isInitialized && theme) {
      applyThemeToDocument(theme)
    }
  }, [theme, isInitialized, applyThemeToDocument])

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (!isInitialized || isTransitioning) return
      setStoreTheme(newTheme)
    },
    [isInitialized, isTransitioning, setStoreTheme],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return {
    theme,
    isInitialized,
    isTransitioning,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    setTheme,
    toggleTheme,
  }
}
