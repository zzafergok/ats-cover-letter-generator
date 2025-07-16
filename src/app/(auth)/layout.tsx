import React from 'react'
import { AuthProvider } from '@/providers/AuthProvider'
import { AuthNavbar } from '@/components/layout/AuthNavbar'
import { AuthFooter } from '@/components/layout/AuthFooter'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider requireAuth redirectTo='/auth/login'>
      <div className='min-h-screen flex flex-col bg-white dark:bg-neutral-900'>
        <AuthNavbar />
        <main className='flex-1 max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900'>
          {children}
        </main>
        <AuthFooter />
      </div>
    </AuthProvider>
  )
}
