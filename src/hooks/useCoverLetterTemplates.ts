import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  templateApi,
  type TemplateCategory,
  type TemplatePreview,
  type GenerateCoverLetterFromTemplateData,
} from '@/lib/api/api'

// React Query Keys - Cache key management için
export const templateKeys = {
  all: ['templates'] as const,
  categories: () => [...templateKeys.all, 'categories'] as const,
  templates: () => [...templateKeys.all, 'templates'] as const,
  templatesByCategory: (category: string) => [...templateKeys.templates(), 'category', category] as const,
  templateDetail: (templateId: string) => [...templateKeys.templates(), 'detail', templateId] as const,
  statistics: () => [...templateKeys.all, 'statistics'] as const,
}

// Template Categories Hook
export const useTemplateCategories = () => {
  return useQuery({
    queryKey: templateKeys.categories(),
    queryFn: () => templateApi.getCategories(),
    select: (data) => data,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// All Templates Hook
export const useAllTemplates = () => {
  return useQuery({
    queryKey: templateKeys.templates(),
    queryFn: () => templateApi.getAllTemplates(),
    select: (data) => data,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Templates by Category Hook
export const useTemplatesByCategory = (category: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: templateKeys.templatesByCategory(category),
    queryFn: () => templateApi.getTemplatesByCategory(category),
    select: (data) => data,
    enabled: enabled && !!category,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Template Detail Hook
export const useTemplateDetail = (templateId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: templateKeys.templateDetail(templateId),
    queryFn: () => templateApi.getTemplateDetail(templateId),
    select: (data) => data,
    enabled: enabled && !!templateId,
    staleTime: 10 * 60 * 1000, // 10 dakika
    gcTime: 20 * 60 * 1000, // 20 dakika
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Template Statistics Hook (Admin)
export const useTemplateStatistics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: templateKeys.statistics(),
    queryFn: () => templateApi.getStatistics(),
    select: (data) => data,
    enabled,
    staleTime: 10 * 60 * 1000, // 10 dakika
    gcTime: 20 * 60 * 1000, // 20 dakika
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Generate Cover Letter Mutation Hook
export const useGenerateCoverLetter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GenerateCoverLetterFromTemplateData) => templateApi.generateCoverLetter(data),
    onSuccess: () => {
      // Template istatistiklerini güncelle
      queryClient.invalidateQueries({
        queryKey: templateKeys.statistics(),
      })
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cover letter oluşturulurken hata oluştu'
      console.log('🚀 ~ useGenerateCoverLetter ~ errorMessage:', errorMessage)
    },
  })
}

// Prefetch Templates Hook - Performans için
export const usePrefetchTemplates = () => {
  const queryClient = useQueryClient()

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: templateKeys.categories(),
      queryFn: () => templateApi.getCategories(),
      staleTime: 5 * 60 * 1000,
    })
  }

  const prefetchAllTemplates = () => {
    queryClient.prefetchQuery({
      queryKey: templateKeys.templates(),
      queryFn: () => templateApi.getAllTemplates(),
      staleTime: 5 * 60 * 1000,
    })
  }

  const prefetchTemplatesByCategory = (category: string) => {
    queryClient.prefetchQuery({
      queryKey: templateKeys.templatesByCategory(category),
      queryFn: () => templateApi.getTemplatesByCategory(category),
      staleTime: 5 * 60 * 1000,
    })
  }

  const prefetchTemplateDetail = (templateId: string) => {
    queryClient.prefetchQuery({
      queryKey: templateKeys.templateDetail(templateId),
      queryFn: () => templateApi.getTemplateDetail(templateId),
      staleTime: 10 * 60 * 1000,
    })
  }

  return {
    prefetchCategories,
    prefetchAllTemplates,
    prefetchTemplatesByCategory,
    prefetchTemplateDetail,
  }
}

// Template Invalidation Hook - Cache management için
export const useTemplateInvalidation = () => {
  const queryClient = useQueryClient()

  const invalidateAllTemplateData = () => {
    queryClient.invalidateQueries({
      queryKey: templateKeys.all,
    })
  }

  const invalidateCategories = () => {
    queryClient.invalidateQueries({
      queryKey: templateKeys.categories(),
    })
  }

  const invalidateTemplates = () => {
    queryClient.invalidateQueries({
      queryKey: templateKeys.templates(),
    })
  }

  const invalidateTemplatesByCategory = (category: string) => {
    queryClient.invalidateQueries({
      queryKey: templateKeys.templatesByCategory(category),
    })
  }

  const invalidateTemplateDetail = (templateId: string) => {
    queryClient.invalidateQueries({
      queryKey: templateKeys.templateDetail(templateId),
    })
  }

  const invalidateStatistics = () => {
    queryClient.invalidateQueries({
      queryKey: templateKeys.statistics(),
    })
  }

  return {
    invalidateAllTemplateData,
    invalidateCategories,
    invalidateTemplates,
    invalidateTemplatesByCategory,
    invalidateTemplateDetail,
    invalidateStatistics,
  }
}

// Combined Hook - Kategori ve template'leri birlikte getir
export const useCategoriesWithTemplates = () => {
  const categoriesQuery = useTemplateCategories()
  const templatesQuery = useAllTemplates()

  const combinedData = React.useMemo(() => {
    if (!categoriesQuery.data || !templatesQuery.data) return null

    return categoriesQuery.data.map((category: TemplateCategory) => ({
      ...category,
      templates: templatesQuery.data.filter((template: TemplatePreview) => template.category === category.key),
    }))
  }, [categoriesQuery.data, templatesQuery.data])

  return {
    data: combinedData,
    isLoading: categoriesQuery.isLoading || templatesQuery.isLoading,
    isError: categoriesQuery.isError || templatesQuery.isError,
    error: categoriesQuery.error || templatesQuery.error,
    refetch: () => {
      categoriesQuery.refetch()
      templatesQuery.refetch()
    },
  }
}
