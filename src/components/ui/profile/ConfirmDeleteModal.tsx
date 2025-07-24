'use client'

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  isLoading?: boolean
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div className='flex items-center space-x-2'>
            <AlertTriangle className='h-5 w-5 text-destructive' />
            <CardTitle className='text-destructive'>{title}</CardTitle>
          </div>
          <Button variant='ghost' size='sm' onClick={onClose} disabled={isLoading}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>{message}</p>
            {itemName && (
              <div className='p-3 bg-muted/50 rounded-lg border-l-4 border-destructive'>
                <p className='text-sm font-medium text-foreground'>
                  <span className='text-destructive'>Silinecek:</span> {itemName}
                </p>
              </div>
            )}
          </div>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button 
              type='button' 
              variant='outline' 
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button 
              type='button' 
              variant='destructive' 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading && (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
              )}
              Evet, Sil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}