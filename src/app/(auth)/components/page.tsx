'use client'

import dynamic from 'next/dynamic'

import React, { useState, useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { Search, Grid, List, Filter, X } from 'lucide-react'

import { Input } from '@/components/core/Input/Input'
import { Badge } from '@/components/core/Badge/Badge'
import { Button } from '@/components/core/Button/Button'
import { Card, CardContent } from '@/components/core/Card/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/Select/Select'

import { cn } from '@/lib/utils'
import { componentDemoData } from '@/data/componentDemoData'

const ComponentDemo = dynamic(
  () => import('@/components/ui/ComponentDemo/ComponentDemo').then((mod) => mod.ComponentDemo),
  {
    loading: () => <ComponentDemoSkeleton />,
    ssr: false,
  },
)

const ComponentDemoSkeleton = () => (
  <div className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border border-neutral-200/80 dark:border-neutral-700/50 rounded-2xl shadow-sm overflow-hidden animate-pulse'>
    <div className='p-6'>
      <div className='flex items-start justify-between mb-4'>
        <div className='space-y-3 flex-1'>
          <div className='flex items-center gap-3'>
            <div className='h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-32'></div>
            <div className='h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-16'></div>
          </div>
          <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20'></div>
        </div>
        <div className='h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded'></div>
      </div>
      <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2'></div>
      <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-6'></div>
      <div className='h-32 bg-neutral-200 dark:bg-neutral-700 rounded-xl'></div>
    </div>
    <div className='bg-neutral-100/50 dark:bg-neutral-700/30 p-6 border-t border-neutral-200/50 dark:border-neutral-600/30'>
      <div className='h-24 bg-neutral-200 dark:bg-neutral-600 rounded-lg'></div>
    </div>
  </div>
)

export default function ComponentsPage() {
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Filtreleme mantığı
  const filteredComponents = useMemo(() => {
    return componentDemoData.filter((component) => {
      const matchesSearch =
        !searchQuery ||
        component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || component.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchQuery, selectedCategory, selectedStatus])

  // Kategoriler ve durumlar
  const categories = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(componentDemoData.map((c) => c.category)))]
    return cats.map((cat) => ({
      value: cat,
      label: cat === 'all' ? t('common.allCategories') : cat,
      count: cat === 'all' ? componentDemoData.length : componentDemoData.filter((c) => c.category === cat).length,
    }))
  }, [t])

  const statuses = useMemo(() => {
    const stats = ['all', ...Array.from(new Set(componentDemoData.map((c) => c.status)))]
    return stats.map((status) => ({
      value: status,
      label: status === 'all' ? 'Tüm Durumlar' : status,
      count: status === 'all' ? componentDemoData.length : componentDemoData.filter((c) => c.status === status).length,
    }))
  }, [])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedStatus('all')
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100/50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950/80'>
      {/* Search and Filter Section */}
      <section className='sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-700/30'>
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
          <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50 shadow-lg shadow-neutral-900/5 dark:shadow-neutral-950/20'>
            <CardContent className='p-6'>
              <div className='space-y-6'>
                {/* Ana Arama ve Görünüm Kontrolleri */}
                <div className='flex flex-col xl:flex-row gap-6 items-start xl:items-center'>
                  {/* Arama Alanı - Desktop'ta daha geniş */}
                  <div className='flex-1 w-full max-w-none xl:max-w-lg relative group'>
                    <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors' />
                    <Input
                      placeholder={t('pages.components.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='pl-12 pr-4 py-3 text-base bg-white/70 dark:bg-neutral-700/70 border-neutral-200/80 dark:border-neutral-600/80 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-200'
                    />
                    {searchQuery && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setSearchQuery('')}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>

                  {/* Desktop Filtreler - Daha geniş alanlar */}
                  <div className='hidden xl:flex items-center gap-4 shrink-0'>
                    {/* Kategori Filtresi */}
                    <div className='min-w-[220px]'>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className='w-full bg-white/70 dark:bg-neutral-700/70 border-neutral-200/80 dark:border-neutral-600/80'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className='flex items-center justify-between w-full'>
                                <span>{category.label}</span>
                                <Badge variant='secondary' className='ml-2 text-xs'>
                                  {category.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Durum Filtresi */}
                    <div className='min-w-[180px]'>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className='w-full bg-white/70 dark:bg-neutral-700/70 border-neutral-200/80 dark:border-neutral-600/80'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className='flex items-center justify-between w-full'>
                                <span>{status.label}</span>
                                <Badge variant='secondary' className='ml-2 text-xs'>
                                  {status.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className='flex items-center gap-1 p-1 bg-neutral-100/70 dark:bg-neutral-700/70 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50'>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size='sm'
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          'p-2.5 transition-all duration-200',
                          viewMode === 'grid'
                            ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                            : 'hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 text-neutral-600 dark:text-neutral-300',
                        )}
                      >
                        <Grid className='h-4 w-4' />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size='sm'
                        onClick={() => setViewMode('list')}
                        className={cn(
                          'p-2.5 transition-all duration-200',
                          viewMode === 'list'
                            ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                            : 'hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 text-neutral-600 dark:text-neutral-300',
                        )}
                      >
                        <List className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  {/* Tablet Filtreler (lg breakpoint) */}
                  <div className='hidden lg:flex xl:hidden items-center gap-3 w-full justify-between'>
                    <div className='flex items-center gap-3 flex-1'>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className='w-[200px] bg-white/70 dark:bg-neutral-700/70 border-neutral-200/80 dark:border-neutral-600/80'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className='flex items-center justify-between w-full'>
                                <span>{category.label}</span>
                                <Badge variant='secondary' className='ml-2 text-xs'>
                                  {category.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className='w-auto gap-4 bg-white/70 dark:bg-neutral-700/70 border-neutral-200/80 dark:border-neutral-600/80'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className='flex items-center justify-between w-full'>
                                <span>{status.label}</span>
                                <Badge variant='secondary' className='ml-2 text-xs'>
                                  {status.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <div className='lg:hidden flex items-center gap-2 w-full'>
                    <Button
                      variant='outline'
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className='flex items-center gap-2 bg-white/70 dark:bg-neutral-700/70 border-neutral-200/80 dark:border-neutral-600/80'
                    >
                      <Filter className='h-4 w-4' />
                      Filtreler
                      {hasActiveFilters && (
                        <Badge variant='default' className='text-xs px-1.5 py-0.5'>
                          !
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mobile Filters Dropdown */}
                {isFilterOpen && (
                  <div className='lg:hidden space-y-4 p-4 bg-neutral-50/50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Kategori</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label} ({category.count})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Durum</label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label} ({status.count})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <Button variant='outline' onClick={clearFilters} className='w-full'>
                        Filtreleri Temizle
                      </Button>
                    )}
                  </div>
                )}

                {/* Aktif Filtreler */}
                {hasActiveFilters && (
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-sm font-medium text-neutral-600 dark:text-neutral-400'>Aktif filtreler:</span>
                    {searchQuery && (
                      <Badge key='search-filter' variant='secondary' className='gap-1'>
                        {`"${searchQuery}"`}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSearchQuery('')}
                          className='h-4 w-4 p-0 hover:bg-transparent'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </Badge>
                    )}
                    {selectedCategory !== 'all' && (
                      <Badge key='category-filter' variant='secondary' className='gap-1'>
                        {selectedCategory}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSelectedCategory('all')}
                          className='h-4 w-4 p-0 hover:bg-transparent'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </Badge>
                    )}
                    {selectedStatus !== 'all' && (
                      <Badge key='status-filter' variant='secondary' className='gap-1'>
                        {selectedStatus}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSelectedStatus('all')}
                          className='h-4 w-4 p-0 hover:bg-transparent'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </Badge>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={clearFilters}
                      className='text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                    >
                      Tümünü temizle
                    </Button>
                  </div>
                )}

                {/* Sonuç Özeti */}
                <div className='flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400'>
                  <span>
                    <strong className='text-neutral-900 dark:text-neutral-100'>{filteredComponents.length}</strong>{' '}
                    bileşen gösteriliyor
                    {filteredComponents.length !== componentDemoData.length && (
                      <span className='ml-1'>({componentDemoData.length} toplam)</span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Components Showcase */}
      <section className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        {filteredComponents.length > 0 ? (
          <div className={cn('grid gap-8', viewMode === 'grid' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1')}>
            {filteredComponents.map((component) => (
              <div key={component.id} className='h-fit'>
                <ComponentDemo
                  title={component.title}
                  description={component.description}
                  category={component.category}
                  status={component.status as 'stable' | 'beta' | 'alpha' | 'deprecated'}
                  demoComponent={component.demoComponent}
                  code={component.code}
                  usageExamples={component.usageExamples}
                  props={component.props?.map((prop) => ({
                    ...prop,
                    description: prop.description || '',
                    required: false,
                  }))}
                />
              </div>
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className='text-center py-20'>
            <div className='text-neutral-400 dark:text-neutral-500 mb-6'>
              <Search className='h-20 w-20 mx-auto opacity-50' />
            </div>
            <h3 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3'>
              {t('common.noComponentsFound')}
            </h3>
            <p className='text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed'>
              {t('common.changeSearchCriteria')}
            </p>
            <div className='space-y-4'>
              <Button
                variant='outline'
                onClick={clearFilters}
                className='bg-white/70 dark:bg-neutral-800/70 border-neutral-200/80 dark:border-neutral-600/80'
              >
                {t('common.clearFilters')}
              </Button>
              <div className='text-sm text-neutral-500 dark:text-neutral-400'>
                Popüler aramalar: Button, Input, Modal, Form
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer İstatistikleri */}
      {filteredComponents.length > 0 && (
        <section className='border-t border-neutral-200/50 dark:border-neutral-700/30 bg-neutral-50/50 dark:bg-neutral-900/50'>
          <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
              <div className='space-y-2'>
                <div className='text-2xl font-bold text-primary-600 dark:text-primary-400'>
                  {componentDemoData.filter((c) => c.status === 'stable').length}
                </div>
                <div className='text-sm text-neutral-600 dark:text-neutral-400'>Stable</div>
              </div>
              <div className='space-y-2'>
                <div className='text-2xl font-bold text-amber-600 dark:text-amber-400'>
                  {componentDemoData.filter((c) => c.status === 'beta').length}
                </div>
                <div className='text-sm text-neutral-600 dark:text-neutral-400'>Beta</div>
              </div>
              <div className='space-y-2'>
                <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                  {componentDemoData.filter((c) => c.status === 'alpha').length}
                </div>
                <div className='text-sm text-neutral-600 dark:text-neutral-400'>Alpha</div>
              </div>
              <div className='space-y-2'>
                <div className='text-2xl font-bold text-teal-600 dark:text-teal-400'>{categories.length - 1}</div>
                <div className='text-sm text-neutral-600 dark:text-neutral-400'>Kategoriler</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
