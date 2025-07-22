'use client'

import { useCallback, useState } from 'react'

// Custom hooks for better state management
export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      return true
    } catch (error) {
      console.error('Clipboard error:', error)
      return false
    }
  }, [])

  return { isCopied, copyToClipboard }
}
