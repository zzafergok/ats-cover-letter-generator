'use client'

import { useEffect } from 'react'

/**
 * Navbar dropdown'larının z-index sorununu çözen yardımcı bileşen
 * Bu bileşen navbar bileşenlerinde kullanılarak dropdown'ların
 * navbar'ın üstünde görünmesini sağlar
 */
export function NavbarZIndexFix() {
  useEffect(() => {
    // Radix UI portal'larını navbar için optimize et
    const optimizePortalZIndex = () => {
      // Tüm Radix portal'larını bul
      const portals = document.querySelectorAll('[data-radix-portal]')

      portals.forEach((portal) => {
        const element = portal as HTMLElement
        // Navbar dropdown'ları için yüksek z-index ata
        if (
          element.querySelector('[data-radix-dropdown-menu-content]') ||
          element.querySelector('[data-radix-select-content]') ||
          element.querySelector('[data-radix-popover-content]')
        ) {
          element.style.zIndex = '9999'
        }
      })
    }

    // Initial optimization
    optimizePortalZIndex()

    // MutationObserver ile yeni portal'ları izle
    const observer = new MutationObserver(() => {
      optimizePortalZIndex()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
