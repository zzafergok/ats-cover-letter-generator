import { useEffect, useCallback, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setTheme, selectEffectiveTheme, updateSystemPreference } from '@/store/slices/themeSlice'

export function useTheme() {
  const dispatch = useAppDispatch()
  const effectiveTheme = useAppSelector(selectEffectiveTheme)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTransitioningRef = useRef(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)

  const applyThemeToDocument = useCallback((theme: 'light' | 'dark') => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const root = document.documentElement
    const isDark = theme === 'dark'

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    isTransitioningRef.current = true

    root.classList.add('theme-transitioning')

    if (isDark) {
      root.classList.remove('light')
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }

    root.style.colorScheme = theme

    transitionTimeoutRef.current = setTimeout(() => {
      root.classList.remove('theme-transitioning')
      isTransitioningRef.current = false
    }, 150)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDisabled(true)
      setIsInitialized(false)

      const initializeTheme = async () => {
        try {
          const storedTheme = localStorage.getItem('theme') || 'system'

          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const initialSystemPreference = mediaQuery.matches ? 'dark' : 'light'

          dispatch(setTheme(storedTheme as 'light' | 'dark' | 'system'))
          dispatch(updateSystemPreference(initialSystemPreference))

          const effectiveInitialTheme = storedTheme === 'system' ? initialSystemPreference : storedTheme
          applyThemeToDocument(effectiveInitialTheme as 'light' | 'dark')

          const handleChange = (e: MediaQueryListEvent) => {
            const newSystemPreference = e.matches ? 'dark' : 'light'
            dispatch(updateSystemPreference(newSystemPreference))
          }

          mediaQuery.addEventListener('change', handleChange)

          setTimeout(() => {
            setIsInitialized(true)
            setIsDisabled(false)
          }, 100)

          return () => {
            mediaQuery.removeEventListener('change', handleChange)
            if (transitionTimeoutRef.current) {
              clearTimeout(transitionTimeoutRef.current)
            }
          }
        } catch (error) {
          console.error('[useTheme] Initialization failed:', error)
          setIsInitialized(true)
          setIsDisabled(false)
        }
      }

      const cleanup = initializeTheme()
      return () => {
        if (cleanup instanceof Function) {
          cleanup()
        }
      }
    }
  }, [dispatch, applyThemeToDocument])

  useEffect(() => {
    if (isInitialized) {
      applyThemeToDocument(effectiveTheme)
    }
  }, [effectiveTheme, applyThemeToDocument, isInitialized])

  const setThemeWithTransition = useCallback(
    (theme: 'light' | 'dark' | 'system') => {
      if (isDisabled || !isInitialized) {
        console.warn('[useTheme] Cannot change theme - disabled or not initialized')
        return
      }

      setIsDisabled(true)

      dispatch(setTheme(theme))

      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme)
      }

      setTimeout(() => {
        setIsDisabled(false)
      }, 200)
    },
    [dispatch, isDisabled, isInitialized],
  )

  return {
    theme: effectiveTheme,
    setTheme: setThemeWithTransition,
    isTransitioning: isTransitioningRef.current,
    isDisabled: isDisabled || !isInitialized,
    isInitialized,
  }
}
