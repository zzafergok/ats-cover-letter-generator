'use client'

import { useEffect, useCallback, useRef } from 'react'

interface ScrollbarCompensationOptions {
  enabled?: boolean
  selector?: string
}

export function useScrollbarCompensation(options: ScrollbarCompensationOptions = {}) {
  const { enabled = true, selector = 'body' } = options
  const scrollbarWidthRef = useRef<number>(0)
  const originalStyleRef = useRef<string>('')
  const isAppliedRef = useRef<boolean>(false)

  // Scrollbar genişliğini hesapla
  const calculateScrollbarWidth = useCallback((): number => {
    if (typeof window === 'undefined') return 0

    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll'
    ;(outer.style as any).msOverflowStyle = 'scrollbar'
    document.body.appendChild(outer)

    const inner = document.createElement('div')
    outer.appendChild(inner)

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
    document.body.removeChild(outer)

    return scrollbarWidth
  }, [])

  // Scrollbar compensasyon uygula
  const applyCompensation = useCallback(() => {
    if (!enabled || isAppliedRef.current) return

    const element = document.querySelector(selector) as HTMLElement
    if (!element) return

    // Mevcut overflow değerini kaydet
    originalStyleRef.current = element.style.overflow || ''

    // Scrollbar genişliğini hesapla
    scrollbarWidthRef.current = calculateScrollbarWidth()

    // Compensasyon uygula
    if (scrollbarWidthRef.current > 0) {
      element.style.overflow = 'hidden'
      element.style.paddingRight = `${scrollbarWidthRef.current}px`
    }

    isAppliedRef.current = true
  }, [enabled, selector, calculateScrollbarWidth])

  // Scrollbar compensasyonu kaldır
  const removeCompensation = useCallback(() => {
    if (!isAppliedRef.current) return

    const element = document.querySelector(selector) as HTMLElement
    if (!element) return

    // Orijinal stilleri geri yükle
    element.style.overflow = originalStyleRef.current
    element.style.paddingRight = ''

    isAppliedRef.current = false
  }, [selector])

  // CSS custom property olarak scrollbar genişliğini ayarla
  useEffect(() => {
    if (typeof window === 'undefined') return

    // const scrollbarWidth = calculateScrollbarWidth()
    document.documentElement.style.setProperty('--scrollbar-width', `0px`)
  }, [calculateScrollbarWidth])

  return {
    applyCompensation,
    removeCompensation,
    scrollbarWidth: scrollbarWidthRef.current,
    isApplied: isAppliedRef.current,
  }
}
