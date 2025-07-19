/* eslint-disable react-hooks/exhaustive-deps */
// src/components/ui/template/TemplateSelector.tsx
'use client'

import React, { useEffect, useMemo } from 'react'
import { Search, Filter, Grid, List, Eye, Sparkles } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Badge } from '@/components/core/badge'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { useTemplateSelectors, useTemplateActions } from '@/store/templateStore'
import { templateUtils } from '@/services/utils'

interface TemplateSelectorProps {
  onTemplateSelect?: (templateId: string) => void
  className?: string
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect, className = '' }) => {
  const { categories, templates, filteredTemplates, selectedCategory, selectedTemplate, isLoading, error } =
    useTemplateSelectors()
  console.log('🚀 ~ templates:', templates)

  const { fetchCategories, fetchTemplates, setSelectedCategory, setSelectedTemplate, clearError } = useTemplateActions()

  const [searchTerm, setSearchTerm] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  // Initialize data
  useEffect(() => {
    fetchCategories()
    fetchTemplates()
  }, [])

  // Handle category change
  const handleCategoryChange = async (category: string | null) => {
    setSelectedCategory(category)
  }

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    onTemplateSelect?.(templateId)
  }

  // Filter templates by search term
  const filteredAndSortedTemplates = useMemo(() => {
    // Base templates array - use raw data not pre-filtered
    const baseTemplates = Array.isArray(templates?.data) ? templates.data : []

    if (baseTemplates.length === 0) return []

    let filtered = baseTemplates

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((template: any) => template.category === selectedCategory)
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (template: any) =>
          template.title?.toLowerCase().includes(searchLower) || template.preview?.toLowerCase().includes(searchLower),
      )
    }

    return filtered
  }, [templates?.data, selectedCategory, searchTerm])

  if (isLoading && templates?.data?.length === 0) {
    return (
      <div className='flex items-center justify-center p-8'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className='flex flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-semibold'>Template Seç</h2>
            <p className='text-sm text-muted-foreground'>İhtiyacınıza uygun cover letter template&apos;ini seçin</p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size='sm' onClick={() => setViewMode('grid')}>
              <Grid className='h-4 w-4' />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size='sm' onClick={() => setViewMode('list')}>
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Template ara...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => handleCategoryChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className='w-full sm:w-[200px]'>
              <Filter className='h-4 w-4 mr-2' />
              <SelectValue placeholder='Kategori seç' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tüm Kategoriler</SelectItem>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label} ({category.templateCount})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className='border-destructive'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-destructive'>{error}</p>
              <Button variant='outline' size='sm' onClick={clearError}>
                Tamam
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates */}
      <div className='space-y-4'>
        {(() => {
          // Loading state
          if (isLoading) {
            return (
              <div className='flex items-center justify-center p-8'>
                <LoadingSpinner />
              </div>
            )
          }

          // Check if we have any templates at all
          const hasBaseTemplates = Array.isArray(templates?.data) && templates.data.length > 0

          // No templates loaded yet
          if (!hasBaseTemplates) {
            return (
              <Card>
                <CardContent className='pt-6 text-center'>
                  <p className='text-muted-foreground'>Henüz template yüklenmedi</p>
                </CardContent>
              </Card>
            )
          }

          // Templates exist but filtered results are empty
          if (filteredAndSortedTemplates.length === 0) {
            const hasActiveFilters = searchTerm.trim() || selectedCategory

            return (
              <Card>
                <CardContent className='pt-6 text-center'>
                  <p className='text-muted-foreground'>
                    {hasActiveFilters ? 'Arama kriterlerinize uygun template bulunamadı' : 'Template bulunamadı'}
                  </p>
                </CardContent>
              </Card>
            )
          }

          // Render filtered templates
          return (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredAndSortedTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  viewMode={viewMode}
                  onSelect={() => handleTemplateSelect(template.id)}
                />
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// Template Card Component
interface TemplateCardProps {
  template: any
  isSelected: boolean
  viewMode: 'grid' | 'list'
  onSelect: () => void
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, viewMode, onSelect }) => {
  const categoryColor = templateUtils.getTemplateCategoryColor(template.category)
  interface Template {
    id: string
    title: string
    preview: string
    category: string
    placeholders: any[]
    createdAt: string | number | Date
  }

  const categoryLabel: string = (template as Template).category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l: string) => l.toUpperCase())

  if (viewMode === 'list') {
    return (
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={onSelect}
      >
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <div className='flex items-center space-x-3'>
                <Badge variant='secondary' style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
                  {categoryLabel}
                </Badge>
                <h3 className='font-medium'>{template.title}</h3>
              </div>
              <p className='text-sm text-muted-foreground mt-2 line-clamp-2'>
                {templateUtils.truncateTemplatePreview(template.preview)}
              </p>
            </div>
            <div className='flex items-center space-x-2 ml-4'>
              <Badge variant='outline' className='text-xs'>
                {template.placeholders.length} alan
              </Badge>
              <Button variant='ghost' size='sm'>
                <Eye className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <Badge variant='secondary' style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
            {categoryLabel}
          </Badge>
          {isSelected && <Sparkles className='h-4 w-4 text-primary' />}
        </div>
        <CardTitle className='text-lg'>{template.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='line-clamp-3 mb-4'>
          {templateUtils.truncateTemplatePreview(template.preview)}
        </CardDescription>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>{template.placeholders.length} alan</span>
          <span>{new Date(template.createdAt).toLocaleDateString('tr-TR')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
