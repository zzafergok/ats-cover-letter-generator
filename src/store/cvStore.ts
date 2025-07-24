/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/cvStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cvApi } from '@/lib/api/api'
import type {
  CVUpload,
  SavedCV,
  DetailedCV,
  CVGenerateData,
  CVSaveData,
  CVDetailedGenerateData,
  CVUploadResponse,
  CVUploadsResponse,
  CVGenerateResponse,
  SavedCVsResponse,
  DetailedCVsResponse,
  DetailedCVResponse,
} from '@/types/api.types'

// Using types from API instead of local interfaces

interface CVState {
  uploadedCVs: CVUpload[]
  savedCVs: SavedCV[]
  detailedCVs: DetailedCV[]
  selectedCV: CVUpload | null
  isUploading: boolean
  isGenerating: boolean
  isLoading: boolean
  error: string | null
}

interface CVActions {
  // Upload CV Actions
  uploadCV: (file: File) => Promise<CVUpload>
  getUploadedCVs: () => Promise<void>
  deleteUploadedCV: (id: string) => Promise<void>

  // Generate CV Actions
  generateCV: (data: CVGenerateData) => Promise<string>

  // Save CV Actions
  saveCV: (data: CVSaveData) => Promise<void>
  getSavedCVs: () => Promise<void>
  deleteSavedCV: (id: string) => Promise<void>
  downloadSavedCV: (id: string) => Promise<void>

  // Detailed CV Actions
  generateDetailedCV: (data: CVDetailedGenerateData) => Promise<DetailedCV>
  getDetailedCVs: () => Promise<void>
  getDetailedCV: (id: string) => Promise<DetailedCV>
  deleteDetailedCV: (id: string) => Promise<void>
  downloadDetailedCVPdf: (id: string) => Promise<void>

  // Utility Actions
  selectCV: (cv: CVUpload) => void
  clearSelectedCV: () => void
  clearError: () => void
  reset: () => void
}

type CVStore = CVState & CVActions

const initialState: CVState = {
  uploadedCVs: [],
  savedCVs: [],
  detailedCVs: [],
  selectedCV: null,
  isUploading: false,
  isGenerating: false,
  isLoading: false,
  error: null,
}

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Upload CV Actions
      uploadCV: async (file: File) => {
        set({ isUploading: true, error: null })
        try {
          const response: CVUploadResponse = await cvApi.upload(file)
          const uploadedCV = response.data

          set((state) => ({
            uploadedCVs: Array.isArray(state.uploadedCVs) ? [...state.uploadedCVs, uploadedCV] : [uploadedCV],
            isUploading: false,
          }))

          return uploadedCV
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'CV yüklenirken hata oluştu'
          set({ isUploading: false, error: errorMessage })
          throw error
        }
      },

      getUploadedCVs: async () => {
        set({ isLoading: true, error: null })
        try {
          const response: CVUploadsResponse = await cvApi.getUploads()
          const uploadedCVs = response.data || []
          set({ uploadedCVs, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "CV'ler yüklenirken hata oluştu"
          set({ isLoading: false, error: errorMessage })
        }
      },

      deleteUploadedCV: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await cvApi.deleteUpload(id)
          set((state) => ({
            uploadedCVs: state.uploadedCVs.filter((cv) => cv.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Yüklenen CV silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Generate CV Actions
      generateCV: async (data) => {
        set({ isGenerating: true, error: null })
        try {
          const response: CVGenerateResponse = await cvApi.generate(data)
          set({ isGenerating: false })
          return response.data.content
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'CV oluşturulurken hata oluştu'
          set({ isGenerating: false, error: errorMessage })
          throw error
        }
      },

      // Save CV Actions
      saveCV: async (data) => {
        set({ isLoading: true, error: null })
        try {
          await cvApi.save(data)
          await get().getSavedCVs()
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'CV kaydedilirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      getSavedCVs: async () => {
        set({ isLoading: true, error: null })
        try {
          const response: SavedCVsResponse = await cvApi.getSaved()
          const savedCVs = response.data || []
          set({ savedCVs, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Kayıtlı CV'ler yüklenirken hata oluştu"
          set({ isLoading: false, error: errorMessage })
        }
      },

      deleteSavedCV: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await cvApi.deleteSaved(id)
          set((state) => ({
            savedCVs: state.savedCVs.filter((cv) => cv.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'CV silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      downloadSavedCV: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await cvApi.download(id)
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `cv-${id}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'CV indirilirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Detailed CV Actions
      generateDetailedCV: async (data) => {
        set({ isGenerating: true, error: null })
        try {
          const response = await cvApi.generateDetailed(data)
          set({ isGenerating: false })
          await get().getDetailedCVs() // Refresh the list
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı CV oluşturulurken hata oluştu'
          set({ isGenerating: false, error: errorMessage })
          throw error
        }
      },

      getDetailedCVs: async () => {
        set({ isLoading: true, error: null })
        try {
          const response: DetailedCVsResponse = await cvApi.getDetailed()
          const detailedCVs = response.data || []
          set({ detailedCVs, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Detaylı CV'ler yüklenirken hata oluştu"
          set({ isLoading: false, error: errorMessage })
        }
      },

      getDetailedCV: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response: DetailedCVResponse = await cvApi.getDetailedById(id)
          set({ isLoading: false })
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı CV yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteDetailedCV: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await cvApi.deleteDetailed(id)
          set((state) => ({
            detailedCVs: state.detailedCVs.filter((cv) => cv.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Detaylı CV silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      downloadDetailedCVPdf: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await cvApi.downloadDetailedPdf(id)
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `detayli-cv-${id}.pdf`
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
      selectCV: (cv: CVUpload) => {
        set({ selectedCV: cv })
      },

      clearSelectedCV: () => {
        set({ selectedCV: null })
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'cv-store',
      partialize: (state) => ({
        uploadedCVs: state.uploadedCVs,
        savedCVs: state.savedCVs,
        detailedCVs: state.detailedCVs,
        selectedCV: state.selectedCV,
      }),
    },
  ),
)
