/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/cv/CVUpload.tsx
'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useCVStore } from '@/store/cvStore'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Badge } from '@/components/core/badge'
import { Progress } from '@/components/core/progress'

interface CVUploadProps {
  onUploadSuccess?: (cv: any) => void
  maxFiles?: number
  className?: string
}

export function CVUpload({ onUploadSuccess, maxFiles = 1, className }: CVUploadProps) {
  const { uploadCV, isUploading, error, clearError } = useCVStore()

  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      clearError()
      setUploadSuccess(false)

      for (const file of acceptedFiles) {
        try {
          setUploadProgress(0)
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 90))
          }, 200)

          const response: any = await uploadCV(file)

          clearInterval(progressInterval)

          // API response kontrolü
          if (response?.success === true) {
            setUploadProgress(100)
            setUploadSuccess(true)

            setTimeout(() => {
              setUploadProgress(0)
              setUploadSuccess(false)
              onUploadSuccess?.(response.data)
            }, 2000)
          } else {
            throw new Error(response?.message || 'CV yüklenirken bir hata oluştu')
          }
        } catch (error: any) {
          setUploadProgress(0)
          setUploadSuccess(false)
          // Store'daki error handling'e güvenmek yerine manuel set
          console.error('CV upload failed:', error)
        }
      }
    },
    [uploadCV, clearError, onUploadSuccess],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          CV Yükle
        </CardTitle>
        <CardDescription>PDF, DOC veya DOCX formatında CV&apos;nizi yükleyiniz (Maksimum 10MB)</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className='space-y-4'>
              <div className='animate-pulse'>
                <File className='mx-auto h-12 w-12 text-primary' />
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>CV yükleniyor...</p>
                <Progress value={uploadProgress} className='w-full' />
                <p className='text-xs text-muted-foreground'>{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <Upload className='mx-auto h-12 w-12 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>
                  {isDragActive ? 'Dosyaları buraya bırakın' : 'CV dosyanızı sürükleyip bırakın'}
                </p>
                <p className='text-xs text-muted-foreground'>veya dosya seçmek için tıklayın</p>
              </div>
              <div className='flex justify-center gap-2'>
                <Badge variant='secondary'>PDF</Badge>
                <Badge variant='secondary'>DOC</Badge>
                <Badge variant='secondary'>DOCX</Badge>
              </div>
            </div>
          )}
        </div>

        {/* File Rejections */}
        {fileRejections.length > 0 && (
          <div className='space-y-2'>
            {fileRejections.map(({ file, errors }, index) => (
              <div key={index} className='flex items-center gap-2 p-3 bg-destructive/10 rounded-lg'>
                <AlertCircle className='h-4 w-4 text-destructive flex-shrink-0' />
                <div className='flex-1 text-sm'>
                  <p className='font-medium'>{file.name}</p>
                  {errors.map((error, errorIndex) => (
                    <p key={errorIndex} className='text-destructive'>
                      {error.code === 'file-too-large' && 'Dosya boyutu çok büyük (max 10MB)'}
                      {error.code === 'file-invalid-type' && 'Desteklenmeyen dosya formatı'}
                      {error.code === 'too-many-files' && 'Çok fazla dosya seçildi'}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='flex items-center gap-2 p-3 bg-destructive/10 rounded-lg'>
            <AlertCircle className='h-4 w-4 text-destructive flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-destructive'>{error}</p>
            </div>
            <Button variant='ghost' size='sm' onClick={clearError} className='h-auto p-1'>
              <X className='h-4 w-4' />
            </Button>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className='flex items-center gap-2 p-3 bg-green-50 rounded-lg'>
            <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0' />
            <p className='text-sm font-medium text-green-800'>CV başarıyla yüklendi ve işlendi!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
