'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseDropdownPortalOptions {
  zIndex?: number
  autoManage?: boolean
}

export function useDropdownPortal(options: UseDropdownPortalOptions = {}) {
  const { zIndex = 10000, autoManage = true } = options
  const observerRef = useRef<MutationObserver | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updatePortalZIndex = useCallback(() => {
    if (!autoManage) return

    // Radix Portal wrapper'larını bul ve z-index'lerini güncelle
    const portalWrappers = document.querySelectorAll('[data-radix-popper-content-wrapper]')

    portalWrappers.forEach((wrapper) => {
      const element = wrapper as HTMLElement
      if (element.style.zIndex !== zIndex.toString()) {
        element.style.zIndex = zIndex.toString()
        element.style.position = 'fixed'
      }
    })

    // Dropdown content'lerini de güncelle
    const dropdownContents = document.querySelectorAll('[data-radix-menu-content]')
    dropdownContents.forEach((content) => {
      const element = content as HTMLElement
      const wrapper = element.closest('[data-radix-popper-content-wrapper]') as HTMLElement
      if (wrapper && wrapper.style.zIndex !== zIndex.toString()) {
        wrapper.style.zIndex = zIndex.toString()
      }
    })
  }, [autoManage, zIndex])

  const startObserver = useCallback(() => {
    if (!autoManage || observerRef.current) return

    observerRef.current = new MutationObserver((mutations) => {
      let shouldUpdate = false

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (
                element.hasAttribute?.('data-radix-popper-content-wrapper') ||
                element.querySelector?.('[data-radix-popper-content-wrapper]') ||
                element.hasAttribute?.('data-radix-menu-content') ||
                element.querySelector?.('[data-radix-menu-content]')
              ) {
                shouldUpdate = true
              }
            }
          })
        }
      })

      if (shouldUpdate) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(updatePortalZIndex, 10)
      }
    })

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    })
  }, [autoManage, updatePortalZIndex])

  const stopObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (autoManage) {
      startObserver()
      updatePortalZIndex()
    }

    return () => {
      stopObserver()
    }
  }, [autoManage, startObserver, stopObserver, updatePortalZIndex])

  return {
    updatePortalZIndex,
    startObserver,
    stopObserver,
  }
}
