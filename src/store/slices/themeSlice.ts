import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../index'

import { isDarkMode } from '@/lib/utils'

export type ThemeMode = 'light' | 'dark' | 'system'

// ThemeState tipini export edin
export interface ThemeState {
  mode: ThemeMode
  systemPreference: 'light' | 'dark'
}

// Initialize state with system preference if available
const initialState: ThemeState = {
  mode: 'system',
  systemPreference: isDarkMode() ? 'dark' : 'light',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload

      // Update localStorage when theme changes
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
    },
    updateSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload
    },
  },
})

// Actions
export const { setTheme, updateSystemPreference } = themeSlice.actions

// Selectors
export const selectTheme = (state: RootState) => state.theme.mode
export const selectEffectiveTheme = (state: RootState) =>
  state.theme.mode === 'system' ? state.theme.systemPreference : state.theme.mode

export default themeSlice.reducer
