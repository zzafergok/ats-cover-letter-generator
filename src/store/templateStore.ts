// src/store/templateStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import {
  templateApi,
  type TemplateCategory,
  type TemplatePreview,
  type TemplateDetail,
  type GenerateCoverLetterFromTemplateData,
  type GeneratedCoverLetterResponse,
  type TemplateStatistics,
} from '@/lib/api/api'

interface TemplateState {
  // Data state
  categories: TemplateCategory[]
  templates: TemplatePreview[]
  templateDetails: Record<string, TemplateDetail>
  statistics: TemplateStatistics | null
  generatedContent: GeneratedCoverLetterResponse | null

  // UI state
  selectedCategory: string | null
  selectedTemplate: string | null
  isLoading: boolean
  isGenerating: boolean
  error: string | null

  // Form state
  formData: Partial<GenerateCoverLetterFromTemplateData>
  validationErrors: Record<string, string>

  // Actions
  setSelectedCategory: (category: string | null) => void
  setSelectedTemplate: (templateId: string | null) => void
  setFormData: (data: Partial<GenerateCoverLetterFromTemplateData>) => void
  setValidationError: (field: string, error: string) => void
  clearValidationErrors: () => void
  clearError: () => void
  reset: () => void

  // API Actions
  fetchCategories: () => Promise<void>
  fetchTemplates: () => Promise<void>
  fetchTemplatesByCategory: (category: string) => Promise<void>
  fetchTemplateDetail: (templateId: string) => Promise<TemplateDetail | null>
  generateCoverLetter: (data: GenerateCoverLetterFromTemplateData) => Promise<GeneratedCoverLetterResponse | null>
  fetchStatistics: () => Promise<void>

  // Cache management
  invalidateCache: () => void
  clearGeneratedContent: () => void
}

const initialState = {
  categories: [] as TemplateCategory[],
  templates: [],
  templateDetails: {},
  statistics: null,
  generatedContent: null,
  selectedCategory: null,
  selectedTemplate: null,
  isLoading: false,
  isGenerating: false,
  error: null,
  formData: {},
  validationErrors: {},
}

export const useTemplateStore = create<TemplateState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Basic setters
        setSelectedCategory: (category) =>
          set((state) => {
            state.selectedCategory = category
            state.selectedTemplate = null // Reset template when category changes
            state.error = null
          }),

        setSelectedTemplate: (templateId) =>
          set((state) => {
            state.selectedTemplate = templateId
            state.error = null
          }),

        setFormData: (data) =>
          set((state) => {
            state.formData = { ...state.formData, ...data }
            state.error = null
          }),

        setValidationError: (field, error) =>
          set((state) => {
            state.validationErrors[field] = error
          }),

        clearValidationErrors: () =>
          set((state) => {
            state.validationErrors = {}
          }),

        clearError: () =>
          set((state) => {
            state.error = null
          }),

        reset: () =>
          set((state) => {
            Object.assign(state, initialState)
          }),

        clearGeneratedContent: () =>
          set((state) => {
            state.generatedContent = null
          }),

        // Fetch categories
        fetchCategories: async () => {
          try {
            set((state) => {
              state.isLoading = true
              state.error = null
            })

            const response = await templateApi.getCategories()

            set((state) => {
              state.categories = response
              state.isLoading = false
            })
          } catch (error: unknown) {
            set((state) => {
              state.error =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Kategoriler yüklenirken hata oluştu'
              state.isLoading = false
            })
          }
        },

        // Fetch all templates
        fetchTemplates: async () => {
          try {
            set((state) => {
              state.isLoading = true
              state.error = null
            })

            const response = await templateApi.getAllTemplates()

            set((state) => {
              state.templates = response
              state.isLoading = false
            })
          } catch (error: unknown) {
            set((state) => {
              state.error =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Template'ler yüklenirken hata oluştu"
              state.isLoading = false
            })
          }
        },

        // Fetch templates by category
        fetchTemplatesByCategory: async (category) => {
          try {
            set((state) => {
              state.isLoading = true
              state.error = null
            })

            const response = await templateApi.getTemplatesByCategory(category)

            set((state) => {
              state.templates = response
              state.isLoading = false
            })
          } catch (error: unknown) {
            set((state) => {
              state.error =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Kategori template'leri yüklenirken hata oluştu"
              state.isLoading = false
            })
          }
        },

        // Fetch template detail
        fetchTemplateDetail: async (templateId) => {
          try {
            set((state) => {
              state.isLoading = true
              state.error = null
            })

            // Check cache first
            const cached = get().templateDetails[templateId]
            if (cached) {
              set((state) => {
                state.isLoading = false
              })
              return cached
            }

            const response = await templateApi.getTemplateDetail(templateId)

            set((state) => {
              state.templateDetails[templateId] = response
              state.isLoading = false
            })

            return response
          } catch (error: unknown) {
            set((state) => {
              state.error =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Template detayı yüklenirken hata oluştu'
              state.isLoading = false
            })
            return null
          }
        },

        // Generate cover letter
        generateCoverLetter: async (data) => {
          try {
            set((state) => {
              state.isGenerating = true
              state.error = null
              state.validationErrors = {}
            })

            const response = await templateApi.generateCoverLetter(data)

            set((state) => {
              state.generatedContent = response
              state.isGenerating = false
            })

            return response
          } catch (error: unknown) {
            const errorMessage =
              (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Cover letter oluşturulurken hata oluştu'
            const validationErrors =
              (error as { response?: { data?: { validationErrors?: Record<string, string> } } })?.response?.data
                ?.validationErrors || {}

            set((state) => {
              state.error = errorMessage
              state.validationErrors = validationErrors
              state.isGenerating = false
            })
            return null
          }
        },

        // Fetch statistics (Admin only)
        fetchStatistics: async () => {
          try {
            set((state) => {
              state.isLoading = true
              state.error = null
            })

            const response = await templateApi.getStatistics()

            set((state) => {
              state.statistics = response
              state.isLoading = false
            })
          } catch (error: unknown) {
            set((state) => {
              state.error =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'İstatistikler yüklenirken hata oluştu'
              state.isLoading = false
            })
          }
        },

        // Cache management
        invalidateCache: () =>
          set((state) => {
            state.templateDetails = {}
            state.categories = []
            state.templates = []
            state.statistics = null
          }),
      })),
      {
        name: 'template-store',
        partialize: (state) => ({
          selectedCategory: state.selectedCategory,
          selectedTemplate: state.selectedTemplate,
          formData: state.formData,
          // Cache template details for performance
          templateDetails: state.templateDetails,
        }),
      },
    ),
    { name: 'template-store' },
  ),
)

// Selectors for better performance
export const useTemplateSelectors = () => {
  const store = useTemplateStore()

  return {
    // Data selectors
    categories: store.categories,
    templates: store.templates,
    statistics: store.statistics,
    generatedContent: store.generatedContent,

    // UI selectors
    selectedCategory: store.selectedCategory,
    selectedTemplate: store.selectedTemplate,
    isLoading: store.isLoading,
    isGenerating: store.isGenerating,
    error: store.error,

    // Form selectors
    formData: store.formData,
    validationErrors: store.validationErrors,

    // Computed selectors
    selectedTemplateDetail: store.selectedTemplate ? store.templateDetails[store.selectedTemplate] : null,

    filteredTemplates: store.selectedCategory
      ? Array.isArray(store.templates)
        ? store.templates.filter((t) => t.category === store.selectedCategory)
        : []
      : Array.isArray(store.templates)
        ? store.templates
        : [],

    hasValidationErrors: Object.keys(store.validationErrors).length > 0,

    isFormValid:
      store.formData.templateId &&
      store.formData.companyName &&
      store.formData.positionTitle &&
      store.formData.applicantName &&
      store.formData.applicantEmail &&
      store.formData.contactPerson,
  }
}

// Actions hook for cleaner component usage
export const useTemplateActions = () => {
  const store = useTemplateStore()

  return {
    // Basic actions
    setSelectedCategory: store.setSelectedCategory,
    setSelectedTemplate: store.setSelectedTemplate,
    setFormData: store.setFormData,
    setValidationError: store.setValidationError,
    clearValidationErrors: store.clearValidationErrors,
    clearError: store.clearError,
    reset: store.reset,
    clearGeneratedContent: store.clearGeneratedContent,

    // API actions
    fetchCategories: store.fetchCategories,
    fetchTemplates: store.fetchTemplates,
    fetchTemplatesByCategory: store.fetchTemplatesByCategory,
    fetchTemplateDetail: store.fetchTemplateDetail,
    generateCoverLetter: store.generateCoverLetter,
    fetchStatistics: store.fetchStatistics,

    // Cache actions
    invalidateCache: store.invalidateCache,
  }
}
