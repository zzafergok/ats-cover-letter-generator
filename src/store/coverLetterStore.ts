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
import { formatPdfFilename } from '@/lib/filename-utils'

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
  downloadBasicCoverLetterCustomPdf: (data: {
    content: string
    positionTitle: string
    companyName: string
    language?: 'TURKISH' | 'ENGLISH'
  }) => Promise<void>

  // Detailed Cover Letter Actions
  createDetailedCoverLetter: (data: CoverLetterDetailedGenerateData) => Promise<CoverLetterDetailed>
  getDetailedCoverLetters: () => Promise<void>
  getDetailedCoverLetter: (id: string) => Promise<CoverLetterDetailed>
  updateDetailedCoverLetter: (id: string, data: CoverLetterDetailedUpdateData) => Promise<CoverLetterDetailed>
  deleteDetailedCoverLetter: (id: string) => Promise<void>
  downloadDetailedCoverLetterPdf: (id: string) => Promise<void>
  downloadDetailedCoverLetterCustomPdf: (data: {
    content: string
    positionTitle: string
    companyName: string
    language?: 'TURKISH' | 'ENGLISH'
  }) => Promise<void>

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

          // Try to get filename from Content-Disposition header or use default
          let filename = `Cover_Letter_${id}.pdf`

          // Find the cover letter to get company and position info for better filename
          const state = get()
          const coverLetter = state.basicCoverLetters.find((letter) => letter.id === id)
          if (coverLetter) {
            const cleanCompany = formatPdfFilename(coverLetter.companyName)
            const cleanPosition = formatPdfFilename(coverLetter.positionTitle)
            filename = `${cleanCompany}_${cleanPosition}_Cover_Letter.pdf`
          }

          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
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

      downloadBasicCoverLetterCustomPdf: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await coverLetterApi.basic.downloadCustomPdf(data)

          // Create filename based on the provided data
          const cleanCompany = formatPdfFilename(data.companyName)
          const cleanPosition = formatPdfFilename(data.positionTitle)
          const filename = `${cleanCompany}_${cleanPosition}_Edited_Cover_Letter.pdf`

          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Düzenlenmiş PDF indirilirken hata oluştu'
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

          // Try to get filename from Content-Disposition header or use default
          let filename = `Detailed_Cover_Letter_${id}.pdf`

          // Find the cover letter to get company and position info for better filename
          const state = get()
          const coverLetter = state.detailedCoverLetters.find((letter) => letter.id === id)
          if (coverLetter) {
            const cleanCompany = formatPdfFilename(coverLetter.companyName)
            const cleanPosition = formatPdfFilename(coverLetter.positionTitle)
            filename = `${cleanCompany}_${cleanPosition}_Cover_Letter.pdf`
          }

          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
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

      downloadDetailedCoverLetterCustomPdf: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await coverLetterApi.detailed.downloadCustomPdf(data)

          // Create filename based on the provided data
          const cleanCompany = formatPdfFilename(data.companyName)
          const cleanPosition = formatPdfFilename(data.positionTitle)
          const filename = `${cleanCompany}_${cleanPosition}_Edited_Cover_Letter.pdf`

          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Düzenlenmiş PDF indirilirken hata oluştu'
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
