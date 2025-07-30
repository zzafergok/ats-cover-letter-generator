'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Settings } from 'lucide-react'

import { Label } from '@/components/core/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { LoadingSpinner } from '@/components/core/loading-spinner'

interface CVTemplateFormData {
  templateType: 'basic_hr' | 'office_manager' | 'simple_classic' | 'stylish_accounting' | 'minimalist_turkish'
  version?: 'global' | 'turkey'
  language?: 'turkish' | 'english'
  [key: string]: any
}

interface TemplateSelectionStepProps {
  form: UseFormReturn<CVTemplateFormData>
  isLoadingTemplates?: boolean
}

export function TemplateSelectionStep({ form, isLoadingTemplates }: TemplateSelectionStepProps) {
  const { setValue, watch } = form
  const selectedTemplate = watch('templateType')
  const selectedVersion = watch('version')
  const selectedLanguage = watch('language')

  return (
    <div className='space-y-6'>
      <div className='space-y-3'>
        <Label className='text-sm font-medium'>CV Template Seçimi</Label>
        {isLoadingTemplates ? (
          <div className='flex items-center justify-center p-4'>
            <LoadingSpinner size='sm' />
            <span className='ml-2 text-sm text-muted-foreground'>Template'ler yükleniyor...</span>
          </div>
        ) : (
          <Select
            value={selectedTemplate}
            onValueChange={(value) => setValue('templateType', value as CVTemplateFormData['templateType'])}
          >
            <SelectTrigger>
              <SelectValue placeholder='Template seçin' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='basic_hr'>Basic HR Resume</SelectItem>
              <SelectItem value='office_manager'>Office Manager Resume</SelectItem>
              <SelectItem value='simple_classic'>Simple Classic Resume</SelectItem>
              <SelectItem value='stylish_accounting'>Stylish Accounting Resume</SelectItem>
              <SelectItem value='minimalist_turkish'>Minimalist Turkish Resume</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* All templates now support version and language selection */}
      {selectedTemplate && (
        <div className='space-y-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30'>
          <h4 className='font-medium text-primary'>Template Ayarları</h4>

          <div className='space-y-3'>
            <div>
              <Label className='text-sm font-medium'>Version</Label>
              <Select
                value={selectedVersion}
                onValueChange={(value) => setValue('version', value as CVTemplateFormData['version'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Version seçin' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='global'>Global</SelectItem>
                  <SelectItem value='turkey'>Turkey</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-xs text-muted-foreground mt-1'>Global: Basit yapı, Turkey: Detaylı alanlar</p>
            </div>

            {selectedVersion === 'turkey' && (
              <div>
                <Label className='text-sm font-medium'>Language</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={(value) => setValue('language', value as CVTemplateFormData['language'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Dil seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='turkish'>Turkish</SelectItem>
                    <SelectItem value='english'>English</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-xs text-muted-foreground mt-1'>Turkey versiyonu için içerik dili seçimi</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTemplate && selectedVersion && (
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
          <div className='flex items-start gap-3'>
            <div className='flex-shrink-0'>
              <div className='w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center'>
                <Settings className='h-4 w-4 text-blue-600 dark:text-blue-400' />
              </div>
            </div>
            <div className='space-y-1'>
              <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>Template Bilgisi</h4>
              <p className='text-xs text-blue-700 dark:text-blue-300'>
                {selectedVersion === 'turkey'
                  ? 'Turkey versiyonu: Detaylı technical skills, projeler, sertifikalar, diller ve referanslar bölümleri'
                  : selectedTemplate === 'office_manager'
                    ? 'Global versiyonu: Basit skills listesi ile ofis yönetimi odaklı yapı'
                    : 'Global versiyonu: Communication ve leadership becerileri ile basitleştirilmiş yapı'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
