'use client'

import React, { useState, useRef, useCallback, useMemo } from 'react'

import { Upload, File, X, AlertCircle, FileText, Image, FileArchive, Film } from 'lucide-react'

import { Input } from '../../core/Input/Input'
import { Button } from '../../core/Button/Button'

import { cn } from '@/lib/utils'

export interface FileUploadProps {
  onChange: (files: File[]) => void
  value?: File[]
  multiple?: boolean
  accept?: string
  maxSize?: number // MB cinsinden
  maxFiles?: number
  className?: string
  dropzoneText?: string
  browseText?: string
  disabled?: boolean
  error?: string
  showFileList?: boolean
  allowPaste?: boolean
  onError?: (error: string) => void
}

export function FileUpload({
  onChange,
  value,
  multiple = false,
  accept,
  maxSize = 10, // 10MB varsayılan
  maxFiles = 5,
  className,
  dropzoneText = 'Dosyaları buraya sürükleyin veya',
  browseText = 'Dosya Seçin',
  disabled = false,
  error: externalError,
  showFileList = true,
  allowPaste = true,
  onError,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentFiles = value || []

  // Dosya tiplerini kontrol et
  const isValidFileType = useCallback(
    (file: File) => {
      if (!accept) return true

      const acceptedTypes = accept.split(',').map((type) => type.trim())

      // Wildcard kontrolleri (image/*, .pdf vb.)
      return acceptedTypes.some((type) => {
        if (type.endsWith('*')) {
          const baseType = type.slice(0, type.length - 1)
          return file.type.startsWith(baseType)
        }

        if (type.startsWith('.')) {
          const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
          return extension === type.toLowerCase()
        }

        return file.type === type
      })
    },
    [accept],
  )

  // Dosya boyutunu kontrol et
  const isValidFileSize = useCallback(
    (file: File) => {
      const sizeInMB = file.size / (1024 * 1024)
      return sizeInMB <= maxSize
    },
    [maxSize],
  )

  // Dosya sayısını kontrol et
  const isValidFileCount = useCallback(
    (newFiles: File[]) => {
      return currentFiles.length + newFiles.length <= maxFiles
    },
    [currentFiles.length, maxFiles],
  )

  // Hata mesajı ayarla
  const setError = useCallback(
    (message: string) => {
      setInternalError(message)
      if (onError) {
        onError(message)
      }
    },
    [onError],
  )

  // Temizle
  const clearError = useCallback(() => {
    setInternalError(null)
  }, [])

  // Dosya yükleme mantığı
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      if (disabled) return

      clearError()

      const fileArray = Array.from(files)

      // Çok dosya kontrolü
      // Çok dosya kontrolü
      if (!multiple && fileArray.length > 1) {
        setError('Birden fazla dosya yüklenemez')
        return
      }

      // Maksimum dosya sayısı kontrolü
      if (!isValidFileCount(fileArray)) {
        setError(`En fazla ${maxFiles} dosya yükleyebilirsiniz`)
        return
      }

      // Geçerli dosyaları filtrele
      const validFiles: File[] = []
      const invalidFiles: { file: File; reason: string }[] = []

      for (const file of fileArray) {
        if (!isValidFileType(file)) {
          invalidFiles.push({ file, reason: 'Geçersiz dosya tipi' })
          continue
        }

        if (!isValidFileSize(file)) {
          invalidFiles.push({ file, reason: `Dosya boyutu ${maxSize}MB'dan büyük` })
          continue
        }

        validFiles.push(file)
      }

      // Geçersiz dosya varsa hata göster
      if (invalidFiles.length > 0) {
        const reasons = invalidFiles.map((item) => `${item.file.name}: ${item.reason}`)
        setError(`Bazı dosyalar yüklenemedi: ${reasons.join(', ')}`)
      }

      // Geçerli dosyaları callback'e gönder
      if (validFiles.length > 0) {
        const newFiles = multiple ? [...currentFiles, ...validFiles] : validFiles
        onChange(newFiles)
      }
    },
    [
      disabled,
      clearError,
      multiple,
      isValidFileCount,
      isValidFileType,
      isValidFileSize,
      currentFiles,
      maxFiles,
      maxSize,
      onChange,
      setError,
    ],
  )

  // Drag & Drop olayları
  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (!disabled && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [disabled, handleFiles],
  )

  // Input'dan dosya seçme
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  // Dosya kaldırma
  const handleRemoveFile = useCallback(
    (index: number) => {
      if (disabled) return

      const newFiles = [...currentFiles]
      newFiles.splice(index, 1)
      onChange(newFiles)
    },
    [currentFiles, disabled, onChange],
  )

  // Input'u aç
  const handleBrowseClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  // Paste olayı
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (!allowPaste || disabled) return

      const items = e.clipboardData.items
      const files: File[] = []

      for (const item of Array.from(items)) {
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }

      if (files.length > 0) {
        handleFiles(files)
      }
    },
    [allowPaste, disabled, handleFiles],
  )

  // Dosya tipi ikonlarını belirle
  const getFileIcon = useCallback((file: File) => {
    const type = file.type

    if (type.startsWith('image/')) return <Image className='h-5 w-5 text-blue-500' />
    if (type.startsWith('video/')) return <Film className='h-5 w-5 text-purple-500' />
    if (type.startsWith('text/')) return <FileText className='h-5 w-5 text-green-500' />
    if (type.includes('pdf')) return <FileText className='h-5 w-5 text-red-500' />
    if (type.includes('zip') || type.includes('rar') || type.includes('tar') || type.includes('gz')) {
      return <FileArchive className='h-5 w-5 text-amber-500' />
    }

    return <File className='h-5 w-5 text-neutral-500' />
  }, [])

  // Dosya boyutunu formatla
  const formatFileSize = useCallback((size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }, [])

  // Dışarıdan gelen veya içeride oluşan hata
  const error = useMemo(() => externalError || internalError, [externalError, internalError])

  return (
    <div className={cn('w-full', className)}>
      {/* Drag & Drop alanı */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
          isDragging
            ? 'border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/20'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700',
          disabled && 'opacity-60 cursor-not-allowed',
          error && 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <div className='flex flex-col items-center justify-center space-y-2'>
          <Upload
            className={cn(
              'h-10 w-10 mb-2',
              isDragging ? 'text-primary-500 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500',
              error && 'text-red-500 dark:text-red-400',
            )}
          />

          <p className='text-sm text-neutral-600 dark:text-neutral-400'>{dropzoneText}</p>

          <Button
            type='button'
            variant={error ? 'destructive' : 'default'}
            size='sm'
            disabled={disabled}
            onClick={handleBrowseClick}
            className='mt-2'
          >
            {browseText}
          </Button>

          <Input
            ref={fileInputRef}
            type='file'
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            className='hidden'
            disabled={disabled}
            tabIndex={-1}
          />

          {!error && (
            <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-2'>
              {multiple ? `En fazla ${maxFiles} dosya, her biri maksimum ${maxSize}MB` : `Maksimum ${maxSize}MB`}
              {accept && ` (${accept})`}
            </p>
          )}

          {error && (
            <div className='flex items-center mt-2 text-sm text-red-600 dark:text-red-400'>
              <AlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dosya listesi */}
      {showFileList && currentFiles.length > 0 && (
        <div className='mt-4 space-y-2'>
          {currentFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className='flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700'
            >
              <div className='flex items-center space-x-3 truncate'>
                {getFileIcon(file)}
                <div className='truncate'>
                  <p className='text-sm font-medium truncate'>{file.name}</p>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400'>{formatFileSize(file.size)}</p>
                </div>
              </div>

              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400'
                onClick={() => handleRemoveFile(index)}
                disabled={disabled}
                aria-label='Dosyayı kaldır'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Kullanım örneği
export function FileUploadExample() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className='p-6 max-w-md mx-auto'>
      <h2 className='text-lg font-medium mb-4'>Dosya Yükleme</h2>
      <FileUpload onChange={setFiles} value={files} multiple accept='image/*,.pdf,.docx' maxSize={5} maxFiles={3} />

      <div className='mt-4 text-sm text-neutral-600 dark:text-neutral-400'>
        {files.length > 0 ? `${files.length} dosya seçildi` : 'Henüz dosya seçilmedi'}
      </div>
    </div>
  )
}
