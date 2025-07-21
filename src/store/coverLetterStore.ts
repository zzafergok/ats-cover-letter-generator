/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/coverLetterStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  coverLetterApi,
  type GenerateCoverLetterData,
  type SaveCoverLetterData,
  type SavedCoverLetter,
} from '@/lib/api/api'

interface CoverLetterCategory {
  key: string
  label: string
}

// Remove duplicate interface since it's imported from api.ts

interface CoverLetterState {
  categories: CoverLetterCategory[]
  savedCoverLetters: SavedCoverLetter[]
  selectedCategory: CoverLetterCategory | null
  isGenerating: boolean
  isLoading: boolean
  error: string | null
}

interface CoverLetterActions {
  getCategories: () => Promise<void>
  selectCategory: (category: CoverLetterCategory) => void
  generateCoverLetter: (data: GenerateCoverLetterData) => Promise<string>
  saveCoverLetter: (data: SaveCoverLetterData) => Promise<void>
  getSavedCoverLetters: () => Promise<void>
  deleteSavedCoverLetter: (id: string) => Promise<void>
  downloadCoverLetter: (content: string, fileName: string, format: 'pdf' | 'docx') => Promise<void>
  clearError: () => void
  reset: () => void
}

type CoverLetterStore = CoverLetterState & CoverLetterActions

const initialState: CoverLetterState = {
  categories: [],
  savedCoverLetters: [],
  selectedCategory: null,
  isGenerating: false,
  isLoading: false,
  error: null,
}

export const useCoverLetterStore = create<CoverLetterStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      getCategories: async () => {
        set({ isLoading: true, error: null })
        try {
          const categories = await coverLetterApi.getCategories()
          set({ categories, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Kategoriler yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      selectCategory: (category: CoverLetterCategory) => {
        set({ selectedCategory: category })
      },

      generateCoverLetter: async (data) => {
        set({ isGenerating: true, error: null })
        try {
          const result = await coverLetterApi.generate(data)
          set({ isGenerating: false })
          return result.data.content
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ön yazı oluşturulurken hata oluştu'
          set({ isGenerating: false, error: errorMessage })
          throw error
        }
      },

      saveCoverLetter: async (data) => {
        set({ isLoading: true, error: null })
        try {
          await coverLetterApi.save(data)
          await get().getSavedCoverLetters()
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ön yazı kaydedilirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      getSavedCoverLetters: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await coverLetterApi.getSaved()
          const coverLetters = response.data || []
          set({ savedCoverLetters: coverLetters, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Kayıtlı ön yazılar yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      deleteSavedCoverLetter: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await coverLetterApi.delete(id)
          set((state) => ({
            savedCoverLetters: state.savedCoverLetters.filter((letter) => letter.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ön yazı silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      downloadCoverLetter: async (_content, fileName, format) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await coverLetterApi.download(fileName, format)
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${fileName}.${format}`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ön yazı indirilirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'cover-letter-store',
      partialize: (state) => ({
        categories: state.categories,
        savedCoverLetters: state.savedCoverLetters,
        selectedCategory: state.selectedCategory,
      }),
    },
  ),
)
