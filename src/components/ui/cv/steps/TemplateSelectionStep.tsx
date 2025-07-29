'use client'

import React, { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FileText, Sparkles, Target, Clock } from 'lucide-react'

import { Badge } from '@/components/core/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { atsCvMicrosoftApi } from '@/lib/api/api'
import { ATSFormData } from '@/types/form.types'

interface TemplateSelectionStepProps {
  form: UseFormReturn<ATSFormData>
}

interface MicrosoftTemplate {
  id: string
  name: string
  category: string
  language: string
  atsScore: number
  sections: string[]
  description?: string
  targetRoles?: string[]
  experienceLevel?: string
}

export function TemplateSelectionStep({ form }: TemplateSelectionStepProps) {
  const [microsoftTemplates, setMicrosoftTemplates] = useState<MicrosoftTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Microsoft templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true)
      try {
        const response = await atsCvMicrosoftApi.getTemplates()
        if (response.success) {
          setMicrosoftTemplates(response.data.templates)
          // Auto-select first template
          if (response.data.templates.length > 0) {
            setSelectedTemplate(response.data.templates[0].id)
          }
        }
      } catch (err) {
        console.error('Template loading error:', err)
        setError('Şablonlar yüklenirken hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Update form configuration
    form.setValue('configuration.templateStyle', 'PROFESSIONAL')
    // Store template ID in a way that can be accessed later
    localStorage.setItem('selectedMicrosoftTemplate', templateId)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <div className='text-center space-y-4'>
          <Clock className='h-8 w-8 animate-spin text-primary mx-auto' />
          <p className='text-muted-foreground'>Microsoft şablonları yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-8 text-center'>
        <p className='text-destructive'>{error}</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Microsoft ATS Şablonları</h3>
        <p className='text-muted-foreground'>
          Microsoft'un resmi ATS şablonlarını kullanarak yüksek başarı oranına sahip CV'ler oluşturun.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {microsoftTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/50'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <FileText className='h-4 w-4' />
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground line-clamp-2'>
                {template.description || 'Microsoft ATS uyumlu profesyonel şablon'}
              </p>

              <div className='flex flex-wrap gap-2'>
                <Badge variant='outline' className='text-xs'>
                  {template.category}
                </Badge>
                <Badge variant='secondary' className='text-xs bg-green-100 text-green-700'>
                  ATS {template.atsScore}%
                </Badge>
                {template.language === 'turkish' && (
                  <Badge variant='secondary' className='text-xs'>
                    🇹🇷 Türkçe
                  </Badge>
                )}
                {template.language === 'english' && (
                  <Badge variant='secondary' className='text-xs'>
                    🇺🇸 English
                  </Badge>
                )}
              </div>

              {template.experienceLevel && (
                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <Target className='h-3 w-3' />
                  {template.experienceLevel} seviye
                </div>
              )}

              {selectedTemplate === template.id && (
                <div className='flex items-center gap-2 text-primary text-sm font-medium'>
                  <Sparkles className='h-4 w-4' />
                  Seçili Şablon
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className='p-4 bg-muted/50 rounded-lg'>
          <p className='text-sm text-muted-foreground'>
            <span className='font-medium'>Seçili şablon:</span>{' '}
            {microsoftTemplates.find((t) => t.id === selectedTemplate)?.name}
          </p>
        </div>
      )}
    </div>
  )
}
