/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/cvStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cvApi } from '@/lib/api/api'

interface UploadedCV {
  id: string
  originalName: string
  uploadDate: string
  markdownContent: string
}

interface SavedCV {
  id: string
  title: string
  content: string
  cvType: string
  createdAt: string
  updatedAt: string
}

interface CVState {
  uploadedCVs: UploadedCV[]
  savedCVs: SavedCV[]
  selectedCV: UploadedCV | null
  isUploading: boolean
  isGenerating: boolean
  isLoading: boolean
  error: string | null
}

interface CVActions {
  uploadCV: (file: File) => Promise<UploadedCV>
  getUploadedCVs: () => Promise<void>
  selectCV: (cv: UploadedCV) => void
  generateCV: (data: {
    cvUploadId: string
    positionTitle: string
    companyName: string
    cvType: 'ATS_OPTIMIZED' | 'CREATIVE' | 'TECHNICAL'
    jobDescription: string
    additionalRequirements?: string
    targetKeywords?: string[]
  }) => Promise<string>
  saveCV: (data: {
    title: string
    content: string
    cvType: 'ATS_OPTIMIZED' | 'CREATIVE' | 'TECHNICAL'
  }) => Promise<void>
  getSavedCVs: () => Promise<void>
  deleteSavedCV: (id: string) => Promise<void>
  downloadCV: (content: string, fileName: string, format: 'pdf' | 'docx') => Promise<void>
  clearError: () => void
  reset: () => void
}

type CVStore = CVState & CVActions

const initialState: CVState = {
  uploadedCVs: [],
  savedCVs: [],
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

      uploadCV: async (file: File) => {
        set({ isUploading: true, error: null })
        try {
          const uploadedCV = await cvApi.upload(file)
          set((state) => ({
            uploadedCVs: [...state.uploadedCVs, uploadedCV],
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
          const cvs = await cvApi.getUploaded()
          set({ uploadedCVs: cvs, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "CV'ler yüklenirken hata oluştu"
          set({ isLoading: false, error: errorMessage })
        }
      },

      selectCV: (cv: UploadedCV) => {
        set({ selectedCV: cv })
      },

      generateCV: async (data) => {
        set({ isGenerating: true, error: null })
        try {
          const result = await cvApi.generate(data)
          set({ isGenerating: false })
          return result.content
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'CV oluşturulurken hata oluştu'
          set({ isGenerating: false, error: errorMessage })
          throw error
        }
      },

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
          const cvs = await cvApi.getSaved()
          set({ savedCVs: cvs, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Kayıtlı CV'ler yüklenirken hata oluştu"
          set({ isLoading: false, error: errorMessage })
        }
      },

      deleteSavedCV: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await cvApi.delete(id)
          set((state) => ({
            savedCVs: state.savedCVs.filter((cv) => cv.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'CV silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      downloadCV: async (content, fileName, format) => {
        set({ isLoading: true, error: null })
        try {
          const blob = await cvApi.download(format, content, fileName)
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
          const errorMessage = error.response?.data?.message || 'CV indirilirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'cv-store',
      partialize: (state) => ({
        uploadedCVs: state.uploadedCVs,
        savedCVs: state.savedCVs,
        selectedCV: state.selectedCV,
      }),
    },
  ),
)
