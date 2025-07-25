/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { templateApi, templateCoverLetterApi } from '@/lib/api/api'
import type { CoverLetterTemplate, TemplateCreateCoverLetterData } from '@/types/api.types'

interface TemplateState {
  templates: CoverLetterTemplate[]
  categories: Record<string, string[]>
  isLoading: boolean
  error: string | null
}

interface TemplateActions {
  // Template işlemleri
  getAllTemplates: (params?: {
    industry?: 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING'
    category?: string
    language?: 'TURKISH' | 'ENGLISH'
  }) => Promise<void>
  getTemplateCategories: () => Promise<void>
  getTemplatesByIndustry: (industry: 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING') => Promise<void>
  getTemplateById: (templateId: string) => Promise<CoverLetterTemplate | null>
  
  // Cover letter oluşturma
  createCoverLetterFromTemplate: (data: TemplateCreateCoverLetterData) => Promise<{
    content: string
    templateId: string
    positionTitle: string
    companyName: string
  } | null>
  
  // PDF download
  downloadTemplateBasedCoverLetterPdf: (data: {
    content: string
    positionTitle: string
    companyName: string
    templateTitle?: string
    language?: 'TURKISH' | 'ENGLISH'
  }) => Promise<void>
  
  // Admin işlemleri
  initializeTemplates: () => Promise<void>
  
  // Utility actions
  clearError: () => void
  reset: () => void
}

type TemplateStore = TemplateState & TemplateActions

const initialState: TemplateState = {
  templates: [],
  categories: {},
  isLoading: false,
  error: null,
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  ...initialState,

  getAllTemplates: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const response = await templateApi.getAll(params)
      set({ templates: response.data, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Şablonlar yüklenirken hata oluştu'
      set({ isLoading: false, error: errorMessage })
    }
  },

  getTemplateCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await templateApi.getCategories()
      set({ categories: response.data, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Kategoriler yüklenirken hata oluştu'
      set({ isLoading: false, error: errorMessage })
    }
  },

  getTemplatesByIndustry: async (industry) => {
    set({ isLoading: true, error: null })
    try {
      const response = await templateApi.getByIndustry(industry)
      set({ templates: response.data, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sektör şablonları yüklenirken hata oluştu'
      set({ isLoading: false, error: errorMessage })
    }
  },

  getTemplateById: async (templateId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await templateApi.getById(templateId)
      set({ isLoading: false })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Şablon yüklenirken hata oluştu'
      set({ isLoading: false, error: errorMessage })
      return null
    }
  },

  createCoverLetterFromTemplate: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await templateApi.createCoverLetter(data)
      set({ isLoading: false })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ön yazı oluşturulurken hata oluştu'
      set({ isLoading: false, error: errorMessage })
      return null
    }
  },

  downloadTemplateBasedCoverLetterPdf: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const blob = await templateCoverLetterApi.downloadCustomPdf(data)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.companyName}-${data.positionTitle}-Cover-Letter.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'PDF indirme işlemi başarısız'
      set({ isLoading: false, error: errorMessage })
    }
  },

  initializeTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      await templateApi.initialize()
      set({ isLoading: false })
      // Şablonları yeniden yükle
      get().getAllTemplates()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Şablonlar başlatılırken hata oluştu'
      set({ isLoading: false, error: errorMessage })
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}))