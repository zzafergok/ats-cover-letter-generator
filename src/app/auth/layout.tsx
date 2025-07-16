import React from 'react'
import { AuthProvider } from '@/providers/AuthProvider'

interface AuthPagesLayoutProps {
  children: React.ReactNode
}

export default function AuthPagesLayout({ children }: AuthPagesLayoutProps) {
  return (
    <AuthProvider requireAuth={false}>
      <div className='min-h-screen bg-white dark:bg-neutral-900'>{children}</div>
    </AuthProvider>
  )
}
