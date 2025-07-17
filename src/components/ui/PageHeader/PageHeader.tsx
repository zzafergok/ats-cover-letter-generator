'use client'

import React from 'react'

import { ChevronRight, HomeIcon, InfoIcon } from 'lucide-react'

import { Button } from '../../core/button'

import { cn } from '@/lib/utils'

export interface Breadcrumb {
  title: string
  href?: string
  icon?: React.ReactNode
}

export interface Action {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
}

export interface Tab {
  label: string
  value: string
  icon?: React.ReactNode
  count?: number
  disabled?: boolean
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  actions?: Action[]
  tabs?: Tab[]
  activeTab?: string
  onTabChange?: (value: string) => void
  className?: string
  sticky?: boolean
  backButton?: boolean
  onBackButtonClick?: () => void
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  tabs,
  activeTab,
  onTabChange,
  className,
  sticky = false,
  backButton = false,
  onBackButtonClick,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 pb-4',
        sticky &&
          'sticky top-0 z-10 bg-white dark:bg-neutral-900 pt-4 px-4 -mx-4 border-b border-neutral-200 dark:border-neutral-800',
        className,
      )}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className='flex items-center space-x-1 text-sm mb-4' aria-label='Breadcrumbs'>
          <ol className='flex items-center space-x-1'>
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className='flex items-center'>
                {index > 0 && <ChevronRight className='h-4 w-4 text-neutral-400 mx-1 flex-shrink-0' />}

                <a
                  href={crumb.href}
                  className={cn(
                    'flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200',
                    index === breadcrumbs.length - 1 && 'text-neutral-900 dark:text-neutral-100 font-medium',
                    !crumb.href && 'cursor-default',
                  )}
                >
                  {crumb.icon && <span className='mr-1'>{crumb.icon}</span>}
                  <span>{crumb.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
        {/* Title Section */}
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            {backButton && (
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 rounded-full'
                onClick={onBackButtonClick}
                aria-label='Geri'
              >
                <ChevronRight className='h-4 w-4 transform rotate-180' />
              </Button>
            )}

            <h1 className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>{title}</h1>
          </div>

          {subtitle && <p className='mt-1 text-neutral-600 dark:text-neutral-400 text-sm'>{subtitle}</p>}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className='flex flex-wrap items-center gap-2 md:justify-end'>
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant || 'default'} onClick={action.onClick} className='h-9'>
                {action.icon && <span className='mr-2'>{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className='mt-6 border-b border-neutral-200 dark:border-neutral-700'>
          <div className='flex space-x-4 overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                disabled={tab.disabled}
                className={cn(
                  'pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                  activeTab === tab.value
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100',
                  tab.disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                <div className='flex items-center space-x-2'>
                  {tab.icon && <span>{tab.icon}</span>}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={cn(
                        'ml-1 rounded-full px-2 py-0.5 text-xs font-medium',
                        activeTab === tab.value
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Kullanım örneği
export function PageHeaderExample() {
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className='p-4'>
      <PageHeader
        title='Proje Yönetimi'
        subtitle='Tüm projelerinizi yönetin ve izleyin'
        breadcrumbs={[
          { title: 'Ana Sayfa', href: '/', icon: <HomeIcon className='h-3.5 w-3.5' /> },
          { title: 'Projeler', href: '/projects' },
          { title: 'Proje Yönetimi' },
        ]}
        actions={[
          {
            label: 'Yardım',
            onClick: () => console.log('Yardım tıklandı'),
            icon: <InfoIcon className='h-4 w-4' />,
            variant: 'outline',
          },
          {
            label: 'Yeni Proje',
            onClick: () => console.log('Yeni proje tıklandı'),
          },
        ]}
        tabs={[
          { label: 'Genel Bakış', value: 'overview' },
          { label: 'Görevler', value: 'tasks', count: 12 },
          { label: 'Belgeler', value: 'documents', count: 5 },
          { label: 'Ayarlar', value: 'settings' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className='p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg'>
        {activeTab === 'overview' && <div>Genel Bakış içeriği</div>}
        {activeTab === 'tasks' && <div>Görevler içeriği</div>}
        {activeTab === 'documents' && <div>Belgeler içeriği</div>}
        {activeTab === 'settings' && <div>Ayarlar içeriği</div>}
      </div>
    </div>
  )
}
