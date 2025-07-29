/*  */
'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Upload, Eye, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Input } from '@/components/core/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Label } from '@/components/core/label'
import { Alert, AlertDescription } from '@/components/core/alert'
import { LoadingSpinner } from '@/components/core/loading-spinner'
// import { docxTemplatePdfApi } from '@/lib/api/api' // REMOVED: Service no longer available
// import type { DOCXTemplate } from '@/types/api.types' // REMOVED: Type no longer used

export function TemplatesTab() {
  // REMOVED: DOCX Template functionality is no longer available
  // const [templates, setTemplates] = useState<DOCXTemplate[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingTemplate, setUploadingTemplate] = useState<string | null>(null)
  const [newTemplateId, setNewTemplateId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // REMOVED: Template listesini getir - Service no longer available
  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      // const response = await docxTemplatePdfApi.getTemplates()
      // Service removed - returning empty templates
      setTemplates([])
      setError('DOCX Template service is no longer available')
    } catch (err) {
      setError("Template'ler yüklenirken hata oluştu")
      console.error('Templates fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  // REMOVED: Template yükle - Service no longer available
  const handleUploadTemplate = async () => {
    if (!selectedFile || !newTemplateId.trim()) {
      setError('Lütfen template ID ve dosya seçin')
      return
    }

    setUploadingTemplate(newTemplateId)
    setError('DOCX Template upload service is no longer available')

    try {
      // const response = await docxTemplatePdfApi.uploadAndAnalyze(newTemplateId.trim(), selectedFile)
      // Service removed
      console.log('Template upload service is no longer available')
    } catch (err) {
      setError('Template yüklenirken hata oluştu')
      console.error('Template upload error:', err)
    } finally {
      setUploadingTemplate(null)
    }
  }

  // REMOVED: Template önizleme - Service no longer available
  const handlePreview = async (templateId: string) => {
    try {
      // const blob = await docxTemplatePdfApi.preview(templateId)
      // Service removed
      setError('Template preview service is no longer available')
      console.log('Template preview service is no longer available for template:', templateId)
    } catch (err) {
      setError('Template önizlemesi yüklenirken hata oluştu')
      console.error('Template preview error:', err)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            CV Şablonları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Kendi DOCX şablonlarınızı yükleyerek özelleştirilmiş CV'ler oluşturabilirsiniz. Şablonlar otomatik olarak
            analiz edilir ve PDF formatında kullanılır.
          </p>
        </CardContent>
      </Card>

      {/* Template Upload */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Yeni Template Yükle
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='templateId'>Template ID</Label>
              <Select value={newTemplateId} onValueChange={(value) => setNewTemplateId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Template seçin...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='professional'>Professional</SelectItem>
                  <SelectItem value='modern'>Modern</SelectItem>
                  <SelectItem value='academic'>Academic</SelectItem>
                  <SelectItem value='executive'>Executive</SelectItem>
                  <SelectItem value='classic'>Classic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='templateFile'>DOCX Dosyası</Label>
              <Input
                id='templateFile'
                type='file'
                accept='.docx'
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <Button
            onClick={handleUploadTemplate}
            disabled={!selectedFile || !newTemplateId.trim() || !!uploadingTemplate}
            className='w-full md:w-auto'
          >
            {uploadingTemplate ? (
              <>
                <LoadingSpinner size='sm' className='mr-2' />
                Yükleniyor...
              </>
            ) : (
              <>
                <Upload className='h-4 w-4 mr-2' />
                Template Yükle ve Analiz Et
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Template'ler</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center p-8'>
              <LoadingSpinner size='lg' />
            </div>
          ) : templates.length === 0 ? (
            <div className='text-center p-8 text-muted-foreground'>
              <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>Henüz yüklenmiş template yok</p>
              <p className='text-sm'>Yukarıdaki forma ile ilk template'inizi yükleyin</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {templates.map((template) => (
                <Card key={template.id} className='relative'>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-base'>{template.name || template.id}</CardTitle>
                      <div className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='text-sm text-muted-foreground'>
                      <p>ID: {template.id}</p>
                      <p>Oluşturulma: {new Date(template.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>

                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' onClick={() => handlePreview(template.id)} className='flex-1'>
                        <Eye className='h-3 w-3 mr-1' />
                        Önizle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-blue-500' />
            Template Hazırlama Rehberi
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='text-sm space-y-2'>
            <p>
              <strong>1. DOCX Dosyası Hazırlayın:</strong> Microsoft Word ile CV şablonunuzu oluşturun
            </p>
            <p>
              <strong>2. Placeholder'ları Ekleyin:</strong> Dinamik alanlar için{' '}
              <code className='bg-muted px-1 rounded'>{'{{firstName}}'}</code> formatını kullanın
            </p>
            <p>
              <strong>3. Örnek Placeholder'lar:</strong>
            </p>
            <ul className='list-disc list-inside ml-4 space-y-1 text-muted-foreground'>
              <li>
                <code className='bg-muted px-1 rounded'>{'{{fullName}}'}</code> - Ad Soyad
              </li>
              <li>
                <code className='bg-muted px-1 rounded'>{'{{email}}'}</code> - E-posta
              </li>
              <li>
                <code className='bg-muted px-1 rounded'>{'{{targetPosition}}'}</code> - Hedef Pozisyon
              </li>
              <li>
                <code className='bg-muted px-1 rounded'>{'{{workExperience}}'}</code> - İş Deneyimleri
              </li>
              <li>
                <code className='bg-muted px-1 rounded'>{'{{education}}'}</code> - Eğitim Bilgileri
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
