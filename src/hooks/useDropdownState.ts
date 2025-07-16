'use client'

import { useState, useCallback, useEffect } from 'react'
import { useScrollbarCompensation } from './useScrollbarCompensation'

interface UseDropdownStateOptions {
  onOpenChange?: (open: boolean) => void
  preventBodyScroll?: boolean
  scrollbarCompensation?: boolean
}

export function useDropdownState(options: UseDropdownStateOptions = {}) {
  const { onOpenChange, preventBodyScroll = true, scrollbarCompensation = true } = options

  const [isOpen, setIsOpen] = useState(false)
  const { applyCompensation, removeCompensation } = useScrollbarCompensation({
    enabled: scrollbarCompensation,
  })

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)

      if (preventBodyScroll) {
        if (open) {
          applyCompensation()
        } else {
          removeCompensation()
        }
      }
    },
    [onOpenChange, preventBodyScroll, applyCompensation, removeCompensation],
  )

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (isOpen) {
        removeCompensation()
      }
    }
  }, [isOpen, removeCompensation])

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleOpenChange])

  return {
    isOpen,
    setIsOpen: handleOpenChange,
    toggle: () => handleOpenChange(!isOpen),
  }
}
