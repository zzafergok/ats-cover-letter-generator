'use client'

import React, { createContext, useContext, ReactNode } from 'react'

import { useTokenManager, UseTokenManagerReturn } from '@/hooks/useTokenManager'

interface TokenManagerContextProps {
  children: ReactNode
}

const TokenManagerContext = createContext<UseTokenManagerReturn | null>(null)

export function TokenManagerProvider({ children }: TokenManagerContextProps) {
  const tokenManager = useTokenManager()

  return <TokenManagerContext.Provider value={tokenManager}>{children}</TokenManagerContext.Provider>
}

export function useTokenManagerContext(): UseTokenManagerReturn {
  const context = useContext(TokenManagerContext)

  if (!context) {
    throw new Error('useTokenManagerContext must be used within TokenManagerProvider')
  }

  return context
}

// Re-export hook for convenience
export { useTokenManager }
export type { UseTokenManagerReturn }
