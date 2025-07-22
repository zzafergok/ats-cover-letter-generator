/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/coverLetterStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { coverLetterApi } from '@/lib/api/api'
import type {
  CoverLetterBasic,
  CoverLetterDetailed,
  CoverLetterBasicGenerateData,
  CoverLetterDetailedGenerateData,
  CoverLetterBasicUpdateData,
  CoverLetterDetailedUpdateData,
} from '@/types/api.types'

type CoverLetterType = 'basic' | 'detailed'

// Remove duplicate interface since it's imported from api.ts

interface CoverLetterState {
  basicCoverLetters: CoverLetterBasic[]
  detailedCoverLetters: CoverLetterDetailed[]
  selectedType: CoverLetterType
  isGenerating: boolean
  isLoading: boolean
  error: string | null
}

interface CoverLetterActions {
  // Basic Cover Letter Actions
  createBasicCoverLetter: (data: CoverLetterBasicGenerateData) => Promise<CoverLetterBasic>
  getBasicCoverLetters: () => Promise<void>
  getBasicCoverLetter: (id: string) => Promise<CoverLetterBasic>
  updateBasicCoverLetter: (id: string, data: CoverLetterBasicUpdateData) => Promise<CoverLetterBasic>
  deleteBasicCoverLetter: (id: string) => Promise<void>
  downloadBasicCoverLetterPdf: (id: string) => Promise<void>

  // Detailed Cover Letter Actions
  createDetailedCoverLetter: (data: CoverLetterDetailedGenerateData) => Promise<CoverLetterDetailed>
  getDetailedCoverLetters: () => Promise<void>
  getDetailedCoverLetter: (id: string) => Promise<CoverLetterDetailed>
  updateDetailedCoverLetter: (id: string, data: CoverLetterDetailedUpdateData) => Promise<CoverLetterDetailed>
  deleteDetailedCoverLetter: (id: string) => Promise<void>
  downloadDetailedCoverLetterPdf: (id: string) => Promise<void>

  // Utility Actions
  setSelectedType: (type: CoverLetterType) => void
  clearError: () => void
  reset: () => void
}

type CoverLetterStore = CoverLetterState & CoverLetterActions

const initialState: CoverLetterState = {
  basicCoverLetters: [],
  detailedCoverLetters: [],
  selectedType: 'basic',
  isGenerating: false,
  isLoading: false,
  error: null,
}

export const useCoverLetterStore = create<CoverLetterStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Basic Cover Letter Actions
      createBasicCoverLetter: async (data) => {
        set({ isGenerating: true, error: null })
        try {
          const response = await coverLetterApi.basic.create(data)
          set({ isGenerating: false })
          await get().getBasicCoverLetters() // Refresh the list
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Temel ön yazı oluşturulurken hata oluştu'
          set({ isGenerating: false, error: errorMessage })
          throw error
        }
      },

      getBasicCoverLetters: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await coverLetterApi.basic.getAll()
          const basicCoverLetters = response.data || []
          set({ basicCoverLetters, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Temel ön yazılar yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      getBasicCoverLetter: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await coverLetterApi.basic.get(id)
          set({ isLoading: false })
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Temel ön yazı yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateBasicCoverLetter: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await coverLetterApi.basic.update(id, data)
          set({ isLoading: false })
          await get().getBasicCoverLetters() // Refresh the list
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Temel ön yazı güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteBasicCoverLetter: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await coverLetterApi.basic.delete(id)
          set((state) => ({
            basicCoverLetters: state.basicCoverLetters.filter((letter) => letter.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Temel ön yazı silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      downloadBasicCoverLetterPdf: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await coverLetterApi.basic.downloadPdf(id)
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `temel-on-yazi-${id}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'PDF indirilirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Detailed Cover Letter Actions
      createDetailedCoverLetter: async (data) => {
        set({ isGenerating: true, error: null })
        try {
          const response = await coverLetterApi.detailed.create(data)
          set({ isGenerating: false })
          await get().getDetailedCoverLetters() // Refresh the list
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı ön yazı oluşturulurken hata oluştu'
          set({ isGenerating: false, error: errorMessage })
          throw error
        }
      },

      getDetailedCoverLetters: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await coverLetterApi.detailed.getAll()
          const detailedCoverLetters = response.data || []
          set({ detailedCoverLetters, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı ön yazılar yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      getDetailedCoverLetter: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await coverLetterApi.detailed.get(id)
          set({ isLoading: false })
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı ön yazı yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateDetailedCoverLetter: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await coverLetterApi.detailed.update(id, data)
          set({ isLoading: false })
          await get().getDetailedCoverLetters() // Refresh the list
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı ön yazı güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteDetailedCoverLetter: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await coverLetterApi.detailed.delete(id)
          set((state) => ({
            detailedCoverLetters: state.detailedCoverLetters.filter((letter) => letter.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı ön yazı silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      downloadDetailedCoverLetterPdf: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await coverLetterApi.detailed.downloadPdf(id)
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `detayli-on-yazi-${id}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'PDF indirilirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Utility Actions
      setSelectedType: (type) => {
        set({ selectedType: type })
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'cover-letter-store',
      partialize: (state) => ({
        basicCoverLetters: state.basicCoverLetters,
        detailedCoverLetters: state.detailedCoverLetters,
        selectedType: state.selectedType,
      }),
    },
  ),
)
