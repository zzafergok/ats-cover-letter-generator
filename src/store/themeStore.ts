// src/store/themeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  systemPreference: 'light' | 'dark'
  effectiveTheme: 'light' | 'dark'
}

interface ThemeActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  updateSystemPreference: (preference: 'light' | 'dark') => void
}

type ThemeStore = ThemeState & ThemeActions

const getEffectiveTheme = (
  theme: 'light' | 'dark' | 'system',
  systemPreference: 'light' | 'dark',
): 'light' | 'dark' => {
  return theme === 'system' ? systemPreference : theme
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemPreference: 'light',
      effectiveTheme: 'light',

      setTheme: (theme) => {
        const { systemPreference } = get()
        const effectiveTheme = getEffectiveTheme(theme, systemPreference)
        set({ theme, effectiveTheme })
      },

      updateSystemPreference: (preference) => {
        const { theme } = get()
        const effectiveTheme = getEffectiveTheme(theme, preference)
        set({ systemPreference: preference, effectiveTheme })
      },
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
