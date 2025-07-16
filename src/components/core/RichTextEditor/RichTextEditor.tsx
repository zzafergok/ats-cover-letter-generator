/* eslint-disable jsx-a11y/alt-text */
'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'

import {
  X,
  Eye,
  Bold,
  List,
  Code,
  Link,
  Undo,
  Redo,
  Type,
  Edit,
  Save,
  Quote,
  Video,
  Table,
  Image,
  Italic,
  Palette,
  Underline,
  AlignLeft,
  AlignRight,
  ListOrdered,
  AlignCenter,
  AlignJustify,
  Strikethrough,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/core/Dropdown/Dropdown'
import { Badge } from '@/components/core/Badge/Badge'
import { Input } from '@/components/core/Input/Input'
import { Button } from '@/components/core/Button/Button'
import { Separator } from '@/components/core/Separator/Seperator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/Select/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/core/Dialog/Dialog'

import { cn } from '@/lib/utils'

export interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean

  // Toolbar configuration
  enableToolbar?: boolean
  toolbarConfig?: {
    formatting?: boolean
    alignment?: boolean
    lists?: boolean
    links?: boolean
    media?: boolean
    tables?: boolean
    advanced?: boolean
  }

  // Features
  enableAutoSave?: boolean
  autoSaveInterval?: number
  onAutoSave?: (content: string) => void

  enablePreview?: boolean
  enableFullscreen?: boolean
  enableWordCount?: boolean

  // Styling
  className?: string
  height?: number | string
  maxLength?: number

  // File handling
  onImageUpload?: (file: File) => Promise<string>
  onVideoUpload?: (file: File) => Promise<string>
  allowedFileTypes?: string[]
  maxFileSize?: number // MB

  // Events
  onFocus?: () => void
  onBlur?: () => void
  onKeyDown?: (event: KeyboardEvent) => void
}

interface LinkDialogData {
  url: string
  text: string
  target: '_blank' | '_self'
}

interface TableDialogData {
  rows: number
  cols: number
  hasHeader: boolean
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Yazmaya başlayın...',
  disabled = false,
  readOnly = false,

  enableToolbar = true,
  toolbarConfig = {
    formatting: true,
    alignment: true,
    lists: true,
    links: true,
    media: true,
    tables: true,
    advanced: true,
  },

  enableAutoSave = false,
  autoSaveInterval = 30000, // 30 seconds
  onAutoSave,

  enablePreview = true,
  enableFullscreen = true,
  enableWordCount = true,

  className,
  height = 400,
  maxLength,

  onImageUpload,
  onVideoUpload,
  allowedFileTypes = ['image/*', 'video/*'],
  maxFileSize = 10, // 10MB

  onFocus,
  onBlur,
  onKeyDown,
}: RichTextEditorProps) {
  // State management
  const [content, setContent] = useState(value)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [linkData, setLinkData] = useState<LinkDialogData>({ url: '', text: '', target: '_blank' })
  const [tableData, setTableData] = useState<TableDialogData>({ rows: 2, cols: 2, hasHeader: true })
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Refs
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  // Font families and sizes
  const fontFamilies = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
  ]

  const fontSizes = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '24px', label: '24' },
    { value: '32px', label: '32' },
    { value: '48px', label: '48' },
  ]

  const colors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffa500',
    '#800080',
    '#008000',
    '#800000',
    '#808080',
    '#c0c0c0',
    '#000080',
  ]

  // Initialize content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  // Auto-save functionality
  useEffect(() => {
    if (enableAutoSave && onAutoSave && content) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        onAutoSave(content)
        setLastSaved(new Date())
      }, autoSaveInterval)
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [content, enableAutoSave, onAutoSave, autoSaveInterval])

  // Word and character count
  useEffect(() => {
    const text = editorRef.current?.textContent || ''
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
    setCharacterCount(text.length)
  }, [content])

  // Execute editor command
  const executeCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        setContent(newContent)
        onChange?.(newContent)
      }
    },
    [onChange],
  )

  // Format text
  const formatText = useCallback(
    (command: string, value?: string) => {
      if (readOnly || disabled) return
      executeCommand(command, value)
    },
    [executeCommand, readOnly, disabled],
  )

  // Insert HTML
  const insertHTML = useCallback(
    (html: string) => {
      if (readOnly || disabled) return

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        const div = document.createElement('div')
        div.innerHTML = html
        const fragment = document.createDocumentFragment()
        let node
        while ((node = div.firstChild)) {
          fragment.appendChild(node)
        }
        range.insertNode(fragment)

        if (editorRef.current) {
          const newContent = editorRef.current.innerHTML
          setContent(newContent)
          onChange?.(newContent)
        }
      }
    },
    [onChange, readOnly, disabled],
  )

  // Handle content change
  const handleContentChange = useCallback(() => {
    if (editorRef.current && !readOnly && !disabled) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      onChange?.(newContent)
    }
  }, [onChange, readOnly, disabled])

  // Handle key down
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        maxLength &&
        characterCount >= maxLength &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
      ) {
        event.preventDefault()
        return
      }

      // Keyboard shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'b':
            event.preventDefault()
            formatText('bold')
            break
          case 'i':
            event.preventDefault()
            formatText('italic')
            break
          case 'u':
            event.preventDefault()
            formatText('underline')
            break
          case 'z':
            event.preventDefault()
            formatText('undo')
            break
          case 'y':
            event.preventDefault()
            formatText('redo')
            break
          case 'k':
            event.preventDefault()
            setShowLinkDialog(true)
            break
        }
      }

      onKeyDown?.(event.nativeEvent)
    },
    [formatText, maxLength, characterCount, onKeyDown],
  )

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      const isValidType = allowedFileTypes.some((type) => type === '*' || file.type.match(type.replace('*', '.*')))
      if (!isValidType) {
        alert('Desteklenmeyen dosya türü')
        return
      }

      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`Dosya boyutu ${maxFileSize}MB'dan büyük olamaz`)
        return
      }

      try {
        let url: string

        if (file.type.startsWith('image/') && onImageUpload) {
          url = await onImageUpload(file)
          insertHTML(`<img src="${url}" alt="${file.name}" style="max-width: 100%; height: auto;" />`)
        } else if (file.type.startsWith('video/') && onVideoUpload) {
          url = await onVideoUpload(file)
          insertHTML(`<video src="${url}" controls style="max-width: 100%; height: auto;"></video>`)
        }
      } catch (error) {
        console.error('File upload failed:', error)
        alert('Dosya yükleme başarısız')
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [allowedFileTypes, maxFileSize, onImageUpload, onVideoUpload, insertHTML],
  )

  // Insert link
  const insertLink = useCallback(() => {
    if (!linkData.url) return

    const html = `<a href="${linkData.url}" target="${linkData.target}">${linkData.text || linkData.url}</a>`
    insertHTML(html)
    setShowLinkDialog(false)
    setLinkData({ url: '', text: '', target: '_blank' })
  }, [linkData, insertHTML])

  // Insert table
  const insertTable = useCallback(() => {
    const { rows, cols, hasHeader } = tableData

    let html = '<table border="1" style="border-collapse: collapse; width: 100%;">'

    for (let i = 0; i < rows; i++) {
      html += '<tr>'
      for (let j = 0; j < cols; j++) {
        const tag = hasHeader && i === 0 ? 'th' : 'td'
        html += `<${tag} style="padding: 8px; border: 1px solid #ccc;">${hasHeader && i === 0 ? `Başlık ${j + 1}` : ''}</${tag}>`
      }
      html += '</tr>'
    }

    html += '</table><br>'
    insertHTML(html)
    setShowTableDialog(false)
    setTableData({ rows: 2, cols: 2, hasHeader: true })
  }, [tableData, insertHTML])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // Render toolbar
  const renderToolbar = () => {
    if (!enableToolbar) return null

    return (
      <div className='flex items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex-wrap'>
        {/* Formatting */}
        {toolbarConfig.formatting && (
          <>
            <div className='flex items-center gap-1'>
              <Select defaultValue='Arial, sans-serif' onValueChange={(value) => formatText('fontName', value)}>
                <SelectTrigger className='w-32 h-8'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue='16px' onValueChange={(value) => formatText('fontSize', value)}>
                <SelectTrigger className='w-16 h-8'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation='vertical' className='h-6' />

            <div className='flex items-center gap-1'>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('bold')}>
                <Bold className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('italic')}>
                <Italic className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('underline')}>
                <Underline className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('strikeThrough')}>
                <Strikethrough className='w-4 h-4' />
              </Button>
            </div>

            <Separator orientation='vertical' className='h-6' />

            <div className='flex items-center gap-1'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <Palette className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Metin Rengi</DropdownMenuLabel>
                  <div className='grid grid-cols-5 gap-1 p-2'>
                    {colors.map((color) => (
                      <button
                        key={color}
                        className='w-6 h-6 rounded border border-neutral-300 hover:scale-110 transition-transform'
                        style={{ backgroundColor: color }}
                        onClick={() => formatText('foreColor', color)}
                      />
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Arka Plan Rengi</DropdownMenuLabel>
                  <div className='grid grid-cols-5 gap-1 p-2'>
                    {colors.map((color) => (
                      <button
                        key={color}
                        className='w-6 h-6 rounded border border-neutral-300 hover:scale-110 transition-transform'
                        style={{ backgroundColor: color }}
                        onClick={() => formatText('backColor', color)}
                      />
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {/* Alignment */}
        {toolbarConfig.alignment && (
          <>
            <Separator orientation='vertical' className='h-6' />
            <div className='flex items-center gap-1'>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('justifyLeft')}>
                <AlignLeft className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('justifyCenter')}>
                <AlignCenter className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('justifyRight')}>
                <AlignRight className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('justifyFull')}>
                <AlignJustify className='w-4 h-4' />
              </Button>
            </div>
          </>
        )}

        {/* Lists */}
        {toolbarConfig.lists && (
          <>
            <Separator orientation='vertical' className='h-6' />
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => formatText('insertUnorderedList')}
              >
                <List className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('insertOrderedList')}>
                <ListOrdered className='w-4 h-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => formatText('formatBlock', 'blockquote')}
              >
                <Quote className='w-4 h-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => formatText('formatBlock', 'pre')}
              >
                <Code className='w-4 h-4' />
              </Button>
            </div>
          </>
        )}

        {/* Links and Media */}
        {(toolbarConfig.links || toolbarConfig.media) && (
          <>
            <Separator orientation='vertical' className='h-6' />
            <div className='flex items-center gap-1'>
              {toolbarConfig.links && (
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => setShowLinkDialog(true)}>
                  <Link className='w-4 h-4' />
                </Button>
              )}

              {toolbarConfig.media && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Video className='w-4 h-4' />
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Tables */}
        {toolbarConfig.tables && (
          <>
            <Separator orientation='vertical' className='h-6' />
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => setShowTableDialog(true)}>
              <Table className='w-4 h-4' />
            </Button>
          </>
        )}

        {/* Advanced */}
        {toolbarConfig.advanced && (
          <>
            <Separator orientation='vertical' className='h-6' />
            <div className='flex items-center gap-1'>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('undo')}>
                <Undo className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => formatText('redo')}>
                <Redo className='w-4 h-4' />
              </Button>
            </div>
          </>
        )}

        {/* View Controls */}
        <div className='ml-auto flex items-center gap-1'>
          {enablePreview && (
            <Button
              variant={isPreviewMode ? 'default' : 'ghost'}
              size='sm'
              className='h-8'
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <Edit className='w-4 h-4 mr-1' /> : <Eye className='w-4 h-4 mr-1' />}
              {isPreviewMode ? 'Düzenle' : 'Önizle'}
            </Button>
          )}

          {enableFullscreen && (
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={toggleFullscreen}>
              {isFullscreen ? <X className='w-4 h-4' /> : <Type className='w-4 h-4' />}
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Render status bar
  const renderStatusBar = () => {
    if (!enableWordCount && !enableAutoSave) return null

    return (
      <div className='flex items-center justify-between p-2 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-600 dark:text-neutral-400'>
        <div className='flex items-center gap-4'>
          {enableWordCount && (
            <>
              <span>{wordCount} kelime</span>
              <span>{characterCount} karakter</span>
              {maxLength && <Badge variant={'secondary'}>{maxLength - characterCount} kalan</Badge>}
            </>
          )}
        </div>

        {enableAutoSave && lastSaved && (
          <div className='flex items-center gap-2'>
            <Save className='w-4 h-4' />
            <span>Son kaydedilen: {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900',
          isFullscreen && 'fixed inset-0 z-50 rounded-none',
          disabled && 'opacity-50 pointer-events-none',
          className,
        )}
      >
        {/* Toolbar */}
        {renderToolbar()}

        {/* Editor Content */}
        <div className='relative'>
          {isPreviewMode ? (
            <div
              className='p-4 prose prose-neutral dark:prose-invert max-w-none'
              style={{ height: typeof height === 'number' ? `${height}px` : height }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable={!readOnly && !disabled}
              className={cn(
                'p-4 outline-none overflow-y-auto resize-none',
                'prose prose-neutral dark:prose-invert max-w-none',
                'focus:ring-2 focus:ring-primary-500 focus:ring-inset',
              )}
              style={{
                height: typeof height === 'number' ? `${height}px` : height,
                minHeight: '200px',
              }}
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              data-placeholder={placeholder}
              suppressContentEditableWarning={true}
            />
          )}

          {/* Placeholder */}
          {!content && !isPreviewMode && (
            <div className='absolute top-4 left-4 text-neutral-400 dark:text-neutral-500 pointer-events-none'>
              {placeholder}
            </div>
          )}
        </div>

        {/* Status Bar */}
        {renderStatusBar()}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept={allowedFileTypes.join(',')}
          onChange={handleFileUpload}
          className='hidden'
        />
      </div>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Ekle</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>URL</label>
              <Input
                value={linkData.url}
                onChange={(e) => setLinkData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder='https://example.com'
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Metin (opsiyonel)</label>
              <Input
                value={linkData.text}
                onChange={(e) => setLinkData((prev) => ({ ...prev, text: e.target.value }))}
                placeholder='Link metni'
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Hedef</label>
              <Select
                value={linkData.target}
                onValueChange={(value: '_blank' | '_self') => setLinkData((prev) => ({ ...prev, target: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='_blank'>Yeni sekmede aç</SelectItem>
                  <SelectItem value='_self'>Aynı sekmede aç</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowLinkDialog(false)}>
              İptal
            </Button>
            <Button onClick={insertLink} disabled={!linkData.url}>
              Link Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tablo Ekle</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Satır Sayısı</label>
                <Input
                  type='number'
                  min='1'
                  max='20'
                  value={tableData.rows}
                  onChange={(e) => setTableData((prev) => ({ ...prev, rows: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Sütun Sayısı</label>
                <Input
                  type='number'
                  min='1'
                  max='10'
                  value={tableData.cols}
                  onChange={(e) => setTableData((prev) => ({ ...prev, cols: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='hasHeader'
                checked={tableData.hasHeader}
                onChange={(e) => setTableData((prev) => ({ ...prev, hasHeader: e.target.checked }))}
              />
              <label htmlFor='hasHeader' className='text-sm font-medium'>
                Başlık satırı ekle
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowTableDialog(false)}>
              İptal
            </Button>
            <Button onClick={insertTable}>Tablo Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function for creating a basic rich text editor
export function createBasicRichTextEditor(props: Partial<RichTextEditorProps> = {}) {
  return (
    <RichTextEditor
      toolbarConfig={{
        formatting: true,
        alignment: false,
        lists: true,
        links: true,
        media: false,
        tables: false,
        advanced: true,
      }}
      enablePreview={false}
      enableFullscreen={false}
      enableWordCount={true}
      height={200}
      {...props}
    />
  )
}

// Helper function for creating a full-featured rich text editor
export function createFullRichTextEditor(props: Partial<RichTextEditorProps> = {}) {
  return (
    <RichTextEditor
      enableAutoSave={true}
      enablePreview={true}
      enableFullscreen={true}
      enableWordCount={true}
      height={400}
      {...props}
    />
  )
}
