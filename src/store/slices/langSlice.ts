import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../index'

import i18n from '@/locales'

// LangState tipini export edin
export interface LangState {
  currentLanguage: string
  availableLanguages: string[]
}

const initialState: LangState = {
  currentLanguage: i18n.language || 'en',
  availableLanguages: ['en', 'tr'],
}

export const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      const lang = action.payload

      // Only update if it's one of the available languages
      if (state.availableLanguages.includes(lang)) {
        state.currentLanguage = lang
        i18n.changeLanguage(lang)

        // Update localStorage when language changes
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', lang)
        }
      }
    },
  },
})

// Actions
export const { setLanguage } = langSlice.actions

// Selectors
export const selectCurrentLanguage = (state: RootState) => state.lang?.currentLanguage
export const selectAvailableLanguages = (state: RootState) => state.lang?.availableLanguages

export default langSlice.reducer
